// src/components/DashboardClient.tsx
'use client';

import { useState, useEffect, useRef } from "react";
import { supabaseBrowser } from '@/components/Providers';
import { User } from '@supabase/supabase-js';

interface DashboardClientProps {
    initialUserId: string;
}

export default function DashboardClient({ initialUserId }: DashboardClientProps) {
    const [user, setUser] = useState<User | null>(null);
    const [channels, setChannels] = useState<any[]>([]);
    const [profiles, setProfiles] = useState<{ [channelId: string]: any }>({});
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
    const [videos, setVideos] = useState<any[]>([]);
    const [subscription, setSubscription] = useState<any>(null);
    const [editingChannel, setEditingChannel] = useState<string | null>(null);
    const [tempProfile, setTempProfile] = useState<any>({ channel_name: "", channel_about: "", goal: "" });
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState<any | null>(null);
    const [savedAnalysis, setSavedAnalysis] = useState<any | null>(null);
    const [addingChannel, setAddingChannel] = useState(false);
    const [hourlyMessage, setHourlyMessage] = useState<string | null>(null);
    const [monthlyMessage, setMonthlyMessage] = useState<string | null>(null);
    const [analyticsSummary, setAnalyticsSummary] = useState<any>(null);
    const [currentVideoFingerprint, setCurrentVideoFingerprint] = useState<string | null>(null);
    const [reconnectingChannel, setReconnectingChannel] = useState<string | null>(null);
    const [hasConnectedChannel, setHasConnectedChannel] = useState<boolean | null>(null); // NEW gating

    const isMounted = useRef(true);

    // ──────────────────────────────────────────────────────────────
    // Helpers (unchanged)
    // ──────────────────────────────────────────────────────────────
    const formatTimestamp = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'short' }).format(date);
    };

    const parseDuration = (duration: string) => {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = match?.[1] ? parseInt(match[1]) : 0;
        const minutes = match?.[2] ? parseInt(match[2]) : 0;
        const seconds = match?.[3] ? parseInt(match[3]) : 0;
        return hours * 3600 + minutes * 60 + seconds;
    };

    const getVideoFingerprint = (videos: any[]) => {
        return videos
            .map(v => `${v.id}|${v.publishedAt || 'unknown'}`)
            .sort()
            .join('||');
    };

    const calculateStats = (videoList: any[]) => {
        if (videoList.length === 0) return null;
        const totalViews = videoList.reduce((sum: number, v: any) => sum + v.views, 0);
        const totalLikes = videoList.reduce((sum: number, v: any) => sum + v.likes, 0);
        const totalComments = videoList.reduce((sum: number, v: any) => sum + v.comments, 0);
        const avgEngagement = totalViews > 0 ? ((totalLikes + totalComments) / totalViews * 100).toFixed(2) : '0';
        const mid = Math.floor(videoList.length / 2);
        const recentViews = videoList.slice(0, mid).reduce((sum: number, v: any) => sum + v.views, 0);
        const olderViews = videoList.slice(mid).reduce((sum: number, v: any) => sum + v.views, 0);
        const viewTrend = recentViews > olderViews ? 'up' : recentViews < olderViews ? 'down' : 'flat';
        const top = [...videoList].sort((a: any, b: any) => b.views - a.views).slice(0, 5);
        return { total: videoList.length, totalViews, totalLikes, totalComments, avgEngagement, viewTrend, top };
    };

    const resetAllState = () => {
        setChannels([]);
        setProfiles({});
        setSelectedChannel(null);
        setVideos([]);
        setSubscription(null);
        setAnalysisData(null);
        setSavedAnalysis(null);
        setHourlyMessage(null);
        setMonthlyMessage(null);
        setAnalyticsSummary(null);
        setCurrentVideoFingerprint(null);
        setReconnectingChannel(null);
    };

    // ──────────────────────────────────────────────────────────────
    // Auth + initial load (unchanged)
    // ──────────────────────────────────────────────────────────────
    useEffect(() => {
        isMounted.current = true;

        const loadInitialUser = async () => {
            const { data: { user } } = await supabaseBrowser.auth.getUser();
            if (isMounted.current) {
                setUser(user);
                if (user) {
                    fetchChannels(user.id);
                    fetchSubscription(user.id);
                }
            }
        };

        loadInitialUser();

        const { data: listener } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
            if (isMounted.current) {
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                if (currentUser) {
                    fetchChannels(currentUser.id);
                    fetchSubscription(currentUser.id);
                } else {
                    resetAllState();
                }
            }
        });

        return () => {
            isMounted.current = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    // NEW: Gate check - has any YouTube channel connected?
    useEffect(() => {
        if (!user?.id) return;

        const checkConnection = async () => {
            try {
                const { data, error } = await supabaseBrowser
                    .from('youtube_tokens')
                    .select('id')
                    .eq('user_id', user.id)
                    .limit(1);

                if (error) throw error;
                setHasConnectedChannel(!!data?.length);
            } catch (err) {
                console.error('Error checking channel connection:', err);
                setHasConnectedChannel(false);
            }
        };

        checkConnection();
    }, [user?.id]);

    // ──────────────────────────────────────────────────────────────
    // Fetch & handlers (unchanged)
    // ──────────────────────────────────────────────────────────────
    const fetchChannels = async (userId: string) => {
        const { data } = await supabaseBrowser
            .from('youtube_tokens')
            .select('channel_id, channel_title')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        setChannels(data || []);
    };

    const fetchProfile = async (channelId: string) => {
        if (!user) return null;
        const { data } = await supabaseBrowser
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .eq('channel_id', channelId)
            .single();
        if (data) {
            setProfiles(prev => ({ ...prev, [channelId]: data }));
            setTempProfile({ channel_name: data.channel_name || "", channel_about: data.channel_about || "", goal: data.goal || "" });
            return data;
        }
        setTempProfile({ channel_name: "", channel_about: "", goal: "" });
        return null;
    };

    const fetchVideos = async (channelId: string) => {
        const res = await fetch('/api/youtube/videos', {
            method: 'POST',
            body: JSON.stringify({ channel_id: channelId }),
        });
        const data = await res.json();
        const items = data.items || [];
        setVideos(items);
        const fingerprint = getVideoFingerprint(items);
        setCurrentVideoFingerprint(fingerprint);
    };

    const fetchSavedAnalysis = async (channelId: string) => {
        if (!user) return;
        const { data } = await supabaseBrowser
            .from('channel_analyses')
            .select('analysis_text, fixes, created_at')
            .eq('user_id', user.id)
            .eq('channel_id', channelId)
            .single();
        if (data) {
            const saved = { analysis: data.analysis_text, fixes: data.fixes, timestamp: data.created_at };
            setSavedAnalysis(saved);
            setAnalysisData({ analysis: data.analysis_text, fixes: data.fixes });
        } else {
            setSavedAnalysis(null);
            setAnalysisData(null);
        }
    };

    const fetchSubscription = async (userId: string) => {
        const { data } = await supabaseBrowser
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .single();
        setSubscription(data || { status: 'free' });
    };

    const fetchAnalytics = async (channelId: string) => {
        try {
            const { data: tokenData } = await supabaseBrowser
                .from('youtube_tokens')
                .select('access_token, refresh_token')
                .eq('channel_id', channelId)
                .eq('user_id', user?.id)
                .single();
            if (!tokenData?.access_token) return;

            const res = await fetch('/api/youtube/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channel_id: channelId,
                    access_token: tokenData.access_token,
                    refresh_token: tokenData.refresh_token || null,
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setAnalyticsSummary(data);
                if (reconnectingChannel === channelId) {
                    setReconnectingChannel(null);
                }
            } else if (res.status === 403 && data.error?.includes('insufficient authentication scopes')) {
                console.log('Insufficient scopes detected - auto-reconnecting channel', channelId);
                setReconnectingChannel(channelId);
                handleAutoReconnect(channelId);
            } else {
                console.error('Analytics API error:', data.error);
            }
        } catch (err) {
            console.error('Analytics fetch error:', err);
        }
    };

    const handleAddChannel = () => {
        if (!user) return;
        setAddingChannel(true);
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const redirectUri = `${window.location.origin}/api/youtube-callback`;
        const scope = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/analytics.readonly';
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            new URLSearchParams({
                client_id: clientId!,
                redirect_uri: redirectUri,
                response_type: 'code',
                scope: scope,
                access_type: 'offline',
                prompt: 'select_account consent',
                state: JSON.stringify({ userId: user.id }),
            }).toString();
        window.location.href = authUrl;
    };

    const handleAutoReconnect = (channelId: string) => {
        if (!user) return;
        setAddingChannel(true);
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const redirectUri = `${window.location.origin}/api/youtube/callback`;
        const scope = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/analytics.readonly';
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            new URLSearchParams({
                client_id: clientId!,
                redirect_uri: redirectUri,
                response_type: 'code',
                scope: scope,
                access_type: 'offline',
                prompt: 'consent',
                state: JSON.stringify({ userId: user.id, channel_id: channelId, reconnect: true }),
            }).toString();
        window.location.href = authUrl;
    };

    const handleSignOut = async () => {
        try {
            const { error } = await supabaseBrowser.auth.signOut();
            if (error) {
                console.error('Sign out error:', error);
                alert('Failed to sign out. Please try again.');
                return;
            }
            resetAllState();
            window.location.href = '/';
        } catch (err) {
            console.error('Sign out error:', err);
            alert('Failed to sign out. Please try again.');
        }
    };

    const handleProfileSave = async () => {
        if (!user || !editingChannel) return;
        const { error } = await supabaseBrowser
            .from('user_profiles')
            .upsert({
                user_id: user.id,
                channel_id: editingChannel,
                channel_name: tempProfile.channel_name,
                channel_about: tempProfile.channel_about,
                goal: tempProfile.goal,
            });
        if (!error) {
            setProfiles(prev => ({ ...prev, [editingChannel]: tempProfile }));
            setEditingChannel(null);
        }
    };

    const checkRateLimits = async () => {
        if (!user || !subscription) return;
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const { data: usesThisMonth, error: monthError } = await supabaseBrowser
            .from('analysis_uses')
            .select('id')
            .eq('user_id', user.id)
            .gte('used_at', monthStart.toISOString());
        if (monthError) {
            console.error('Monthly limit check failed:', monthError);
            setMonthlyMessage('Error checking monthly limit');
            return;
        }
        const tier = subscription.status || 'free';
        const monthlyLimit = tier === 'pro' ? 500 : tier === 'starter' ? 100 : 1;
        const monthlyUsed = usesThisMonth?.length || 0;
        const monthlyRemaining = monthlyLimit - monthlyUsed;
        setMonthlyMessage(`${monthlyRemaining} of ${monthlyLimit} analyses remaining this month`);

        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const { data: recentUses, error: hourError } = await supabaseBrowser
            .from('analysis_uses')
            .select('id, used_at')
            .eq('user_id', user.id)
            .gte('used_at', hourAgo.toISOString())
            .order('used_at', { ascending: false });
        if (hourError) {
            console.error('Hourly limit check failed:', hourError);
            setHourlyMessage('Error checking hourly limit');
            return;
        }
        const hourlyUsed = recentUses?.length || 0;
        const hourlyRemaining = 5 - hourlyUsed;
        if (hourlyRemaining < 5) {
            setHourlyMessage(`${hourlyRemaining} of 5 analyses remaining this hour`);
        } else {
            setHourlyMessage(null);
        }
    };

    const analyzeChannel = async () => {
        if (videos.length === 0 || !selectedChannel || !user) return;

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const { data: usesThisMonth, error: monthError } = await supabaseBrowser
            .from('analysis_uses')
            .select('id')
            .eq('user_id', user.id)
            .gte('used_at', monthStart.toISOString());
        if (monthError) {
            console.error('Monthly limit check error:', monthError);
            setAnalysisData({ error: 'Failed to check monthly limit.' });
            return;
        }

        const tier = subscription?.status || 'free';
        const monthlyLimit = tier === 'pro' ? 500 : tier === 'starter' ? 100 : 1;
        if ((usesThisMonth?.length || 0) >= monthlyLimit) {
            setAnalysisData({
                error: tier === 'pro' ? "You've reached your Pro limit of 500 analyses this month." :
                    tier === 'starter' ? "You've reached your Starter limit of 100 analyses this month. Upgrade to Pro!" :
                        "Free users get 1 analysis per month. Upgrade to Starter!"
            });
            return;
        }

        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const { data: recentUses, error: hourError } = await supabaseBrowser
            .from('analysis_uses')
            .select('id, used_at')
            .eq('user_id', user.id)
            .gte('used_at', hourAgo.toISOString())
            .order('used_at', { ascending: false });
        if (hourError) {
            console.error('Hourly limit check error:', hourError);
            setAnalysisData({ error: 'Failed to check rate limit.' });
            return;
        }
        if ((recentUses?.length || 0) >= 5) {
            const oldestInWindow = new Date(recentUses[4].used_at);
            const minutesUntilReset = Math.ceil((60 * 60 * 1000 - (now.getTime() - oldestInWindow.getTime())) / 60000);
            setHourlyMessage(`Rate limit reached: 0 of 5 remaining. Resets in ${minutesUntilReset} minute${minutesUntilReset === 1 ? '' : 's'}.`);
            setAnalysisData({ error: "Too many requests. Please wait." });
            return;
        }

        if (savedAnalysis && currentVideoFingerprint) {
            const lastTime = new Date(savedAnalysis.timestamp);
            const hoursSince = (now.getTime() - lastTime.getTime()) / (1000 * 60 * 60);
            if (hoursSince < 24) {
                setAnalysisData({
                    analysis: savedAnalysis.analysis,
                    fixes: savedAnalysis.fixes,
                    cached: true,
                });
                return;
            }
        }

        setAnalyzing(true);
        setAnalysisData(null);

        try {
            const profile = profiles[selectedChannel] || {};
            const res = await fetch('/api/ai/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videos,
                    channel_name: profile.channel_name || 'Unknown',
                    channel_about: profile.channel_about || 'No description',
                    goal: profile.goal || 'No goal stated',
                }),
            });
            const data = await res.json();

            if (res.ok) {
                setAnalysisData(data);
                const nowIso = new Date().toISOString();
                setSavedAnalysis({ analysis: data.analysis, fixes: data.fixes, timestamp: nowIso });

                const { error: insertError } = await supabaseBrowser
                    .from('analysis_uses')
                    .insert({
                        user_id: user.id,
                        channel_id: selectedChannel,
                        used_at: nowIso,
                    });

                if (insertError) {
                    console.error('Failed to record usage:', insertError);
                } else {
                    checkRateLimits();
                }

                await supabaseBrowser
                    .from('channel_analyses')
                    .upsert({
                        user_id: user.id,
                        channel_id: selectedChannel,
                        analysis_text: data.analysis,
                        fixes: data.fixes || null,
                    });
            } else {
                setAnalysisData({ error: data.error || 'Analysis failed.' });
            }
        } catch (err) {
            console.error('Analyze error:', err);
            setAnalysisData({ error: 'Network error — try again.' });
        } finally {
            setAnalyzing(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    // ──────────────────────────────────────────────────────────────
    // Existing effects (unchanged)
    // ──────────────────────────────────────────────────────────────
    useEffect(() => {
        if (selectedChannel && user) {
            fetchVideos(selectedChannel);
            fetchProfile(selectedChannel);
            fetchSavedAnalysis(selectedChannel);
            fetchAnalytics(selectedChannel);
            checkRateLimits();
        } else {
            setVideos([]);
            setAnalysisData(null);
            setSavedAnalysis(null);
            setHourlyMessage(null);
            setMonthlyMessage(null);
            setAnalyticsSummary(null);
            setCurrentVideoFingerprint(null);
            setReconnectingChannel(null);
        }
    }, [selectedChannel, user, subscription]);

    useEffect(() => {
        if (user) {
            fetchChannels(user.id);
            setAddingChannel(false);
        }
    }, [user]);

    // ──────────────────────────────────────────────────────────────
    // GATING LOGIC
    // ──────────────────────────────────────────────────────────────
    if (hasConnectedChannel === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0f172a] to-black">
                <div className="text-2xl text-purple-400 animate-pulse">Loading your account...</div>
            </div>
        );
    }

    if (!hasConnectedChannel) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-black text-white flex items-center justify-center p-8">
                <div className="max-w-3xl text-center space-y-8">
                    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                        Welcome to Squigly!
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-200">
                        Connect your YouTube channel to unlock AI-powered analysis, analytics, and growth tools.
                    </p>

                    <button
                        onClick={handleAddChannel}
                        disabled={addingChannel}
                        className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-2xl rounded-2xl shadow-2xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
                    >
                        {addingChannel ? 'Connecting...' : 'Connect Your YouTube Channel'}
                    </button>

                    <p className="text-lg text-gray-400 pt-6">
                        Once connected, you'll get instant access to everything Squigly has to offer.
                    </p>
                </div>
            </div>
        );
    }

    // ──────────────────────────────────────────────────────────────
    // FULL ORIGINAL DASHBOARD (nothing removed)
    // ──────────────────────────────────────────────────────────────
    const shortsStats = calculateStats(videos.filter(v => parseDuration(v.duration || 'PT0S') <= 60));
    const longFormStats = calculateStats(videos.filter(v => parseDuration(v.duration || 'PT0S') > 60));

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-black text-white">
            <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <h2 className="text-3xl font-bold mb-6">Your Channels</h2>
                    <div className="space-y-4">
                        {channels.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-400 mb-8">No channels connected yet</p>
                                <button
                                    onClick={handleAddChannel}
                                    disabled={addingChannel}
                                    className="px-8 py-6 bg-purple-600 text-white font-bold text-xl rounded-2xl hover:bg-purple-700 transition disabled:opacity-50"
                                >
                                    {addingChannel ? 'Connecting...' : 'Add Your First Channel'}
                                </button>
                                <p className="mt-6 text-sm text-gray-500 max-w-xs mx-auto">
                                    You can connect channels from any Google account — even different from the one you signed in with.
                                </p>
                            </div>
                        ) : (
                            <>
                                {channels.map((ch) => (
                                    <div
                                        key={ch.channel_id}
                                        className={`bg-gray-800/50 rounded-xl p-6 border transition cursor-pointer ${selectedChannel === ch.channel_id ? 'border-purple-500 shadow-purple-500/50 shadow-xl' : 'border-gray-700'}`}
                                        onClick={() => setSelectedChannel(ch.channel_id)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xl font-bold">{ch.channel_title}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingChannel(ch.channel_id);
                                                    fetchProfile(ch.channel_id);
                                                }}
                                                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-sm"
                                            >
                                                Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={handleAddChannel}
                                    disabled={addingChannel}
                                    className="w-full py-6 bg-gray-800/50 rounded-xl border border-dashed border-gray-600 hover:border-purple-500 transition flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    <span className="text-2xl">+</span>
                                    <span>{addingChannel ? 'Adding...' : 'Add Another Channel'}</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-3">
                    {selectedChannel ? (
                        <>
                            <div className="mb-16">
                                <h2 className="text-3xl font-bold mb-6">
                                    Profile for {channels.find(c => c.channel_id === selectedChannel)?.channel_title || "Loading..."}
                                </h2>
                                {editingChannel === selectedChannel ? (
                                    <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-lg mb-2">Channel Name (as you want Squigly to call it)</label>
                                                <input
                                                    type="text"
                                                    value={tempProfile.channel_name || ""}
                                                    onChange={(e) => setTempProfile({ ...tempProfile, channel_name: e.target.value })}
                                                    className="w-full px-6 py-4 rounded-xl bg-gray-700 text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-lg mb-2">What is your channel about?</label>
                                                <textarea
                                                    value={tempProfile.channel_about || ""}
                                                    onChange={(e) => setTempProfile({ ...tempProfile, channel_about: e.target.value })}
                                                    className="w-full px-6 py-4 rounded-xl bg-gray-700 text-white h-32 resize-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-lg mb-2">What is your goal with this channel?</label>
                                                <textarea
                                                    value={tempProfile.goal || ""}
                                                    onChange={(e) => setTempProfile({ ...tempProfile, goal: e.target.value })}
                                                    className="w-full px-6 py-4 rounded-xl bg-gray-700 text-white h-32 resize-none"
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={handleProfileSave}
                                                    className="px-8 py-4 bg-green-600 rounded-xl hover:bg-green-700 transition"
                                                >
                                                    Save Profile
                                                </button>
                                                <button
                                                    onClick={() => setEditingChannel(null)}
                                                    className="px-8 py-4 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                            <p className="text-gray-400 mb-2">Channel Name</p>
                                            <p className="text-2xl font-bold">{profiles[selectedChannel]?.channel_name || "Not set"}</p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                            <p className="text-gray-400 mb-2">About</p>
                                            <p className="text-lg">{profiles[selectedChannel]?.channel_about || "Not set"}</p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                            <p className="text-gray-400 mb-2">Goal</p>
                                            <p className="text-lg">{profiles[selectedChannel]?.goal || "Not set"}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {reconnectingChannel === selectedChannel && (
                                <div className="text-center text-yellow-400 mb-4 animate-pulse">
                                    Updating channel permissions... Redirecting to Google for consent.
                                </div>
                            )}

                            {analyticsSummary ? (
                                <div className="mb-16">
                                    <h2 className="text-3xl font-bold mb-8">Channel Analytics (Last 30 Days)</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Total Views</p>
                                            <p className="text-3xl font-bold">
                                                {analyticsSummary.totalViews ? analyticsSummary.totalViews.toLocaleString() : 'No data yet'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Avg View Duration</p>
                                            <p className="text-3xl font-bold">
                                                {analyticsSummary.avgViewDuration ? ((analyticsSummary.avgViewDuration / 60).toFixed(1) + ' min') : 'No data yet'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Impressions</p>
                                            <p className="text-3xl font-bold text-gray-500">N/A</p>
                                        </div>
                                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">CTR</p>
                                            <p className="text-3xl font-bold text-gray-500">N/A</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-16 text-center text-gray-400">
                                    Loading analytics... or no data available for this channel yet.
                                </div>
                            )}

                            {shortsStats && (
                                <div className="mb-16">
                                    <h2 className="text-3xl font-bold mb-8">Shorts Analytics</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Total Shorts</p>
                                            <p className="text-3xl font-bold mt-2">{shortsStats.total}</p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Total Views</p>
                                            <p className="text-3xl font-bold mt-2">{shortsStats.totalViews.toLocaleString()}</p>
                                            <p className="text-sm mt-2">
                                                {shortsStats.viewTrend === 'up' && '↑ Trending up'}
                                                {shortsStats.viewTrend === 'down' && '↓ Trending down'}
                                                {shortsStats.viewTrend === 'flat' && '→ Steady'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Total Likes</p>
                                            <p className="text-3xl font-bold mt-2">{shortsStats.totalLikes.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Comments</p>
                                            <p className="text-3xl font-bold mt-2">{shortsStats.totalComments.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Engagement Rate</p>
                                            <p className="text-3xl font-bold mt-2">{shortsStats.avgEngagement}%</p>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-6">Top 5 Shorts</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {shortsStats.top.map((short: any, index: number) => (
                                            <div key={short.id} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
                                                <div className="relative">
                                                    <img src={short.thumbnail} alt={short.title} className="w-full h-48 object-cover" />
                                                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                        #{index + 1}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <p className="font-semibold line-clamp-2 mb-2">{short.title}</p>
                                                    <p className="text-gray-300">Views: {short.views.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {longFormStats && (
                                <div className="mb-16">
                                    <h2 className="text-3xl font-bold mb-8">Long-form Videos Analytics</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Total Videos</p>
                                            <p className="text-3xl font-bold mt-2">{longFormStats.total}</p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Total Views</p>
                                            <p className="text-3xl font-bold mt-2">{longFormStats.totalViews.toLocaleString()}</p>
                                            <p className="text-sm mt-2">
                                                {longFormStats.viewTrend === 'up' && '↑ Trending up'}
                                                {longFormStats.viewTrend === 'down' && '↓ Trending down'}
                                                {longFormStats.viewTrend === 'flat' && '→ Steady'}
                                            </p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Total Likes</p>
                                            <p className="text-3xl font-bold mt-2">{longFormStats.totalLikes.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Comments</p>
                                            <p className="text-3xl font-bold mt-2">{longFormStats.totalComments.toLocaleString()}</p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 text-center">
                                            <p className="text-gray-400 text-sm">Engagement Rate</p>
                                            <p className="text-3xl font-bold mt-2">{longFormStats.avgEngagement}%</p>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-6">Top 5 Long-form Videos</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {longFormStats.top.map((video: any, index: number) => (
                                            <div key={video.id} className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 shadow-xl">
                                                <div className="relative">
                                                    <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                                                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                                                        #{index + 1}
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <p className="font-semibold line-clamp-2 mb-2">{video.title}</p>
                                                    <p className="text-gray-300">Views: {video.views.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-20">
                                <button
                                    onClick={analyzeChannel}
                                    disabled={analyzing}
                                    className="px-16 py-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-4xl rounded-3xl hover:from-purple-700 hover:to-pink-700 transition shadow-2xl disabled:opacity-70"
                                >
                                    {analyzing ? "Squigly is analyzing..." : "Run Deep AI Analysis"}
                                </button>
                                <div className="mt-6 text-gray-400 text-lg space-y-2">
                                    <p>Rate limit: 5 analyses per hour</p>
                                    {hourlyMessage && <p className="text-yellow-400 font-medium">{hourlyMessage}</p>}
                                    {monthlyMessage && <p className="text-yellow-400 font-medium">{monthlyMessage}</p>}
                                </div>
                            </div>

                            {analysisData && analysisData.analysis && (
                                <>
                                    <div className="mb-20">
                                        {savedAnalysis?.timestamp && (
                                            <div className="text-center mb-4 text-gray-400">
                                                Last analysis: {formatTimestamp(savedAnalysis.timestamp)}
                                            </div>
                                        )}
                                        {analysisData.cached && (
                                            <div className="text-center text-sm text-green-400 mb-4">
                                                Using cached analysis (videos unchanged)
                                            </div>
                                        )}
                                        <h2 className="text-4xl font-bold mb-8 text-center">Squigly's God Mode Analysis</h2>
                                        <div className="bg-gray-800/70 rounded-3xl p-10 border border-purple-500 shadow-2xl">
                      <pre className="whitespace-pre-wrap text-lg leading-relaxed text-gray-100">
                        {analysisData.analysis}
                      </pre>
                                        </div>
                                    </div>

                                    {analysisData.fixes && (
                                        <div className="mb-20">
                                            <h2 className="text-4xl font-bold mb-8 text-center">Fix It For Me</h2>
                                            <div className="grid md:grid-cols-3 gap-8">
                                                {analysisData.fixes.description && (
                                                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                                        <h3 className="font-bold text-xl mb-4">Optimized Channel Description</h3>
                                                        <p className="text-gray-300 mb-4">{analysisData.fixes.description}</p>
                                                        <button
                                                            onClick={() => copyToClipboard(analysisData.fixes.description)}
                                                            className="w-full py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
                                                        >
                                                            Copy to Clipboard
                                                        </button>
                                                    </div>
                                                )}
                                                {analysisData.fixes.shortsTitleTemplate && (
                                                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                                        <h3 className="font-bold text-xl mb-4">Shorts Title Template</h3>
                                                        <p className="text-gray-300 mb-4">{analysisData.fixes.shortsTitleTemplate}</p>
                                                        <button
                                                            onClick={() => copyToClipboard(analysisData.fixes.shortsTitleTemplate)}
                                                            className="w-full py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
                                                        >
                                                            Copy Template
                                                        </button>
                                                    </div>
                                                )}
                                                {analysisData.fixes.longformTitleTemplate && (
                                                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                                        <h3 className="font-bold text-xl mb-4">Long-form Title Template</h3>
                                                        <p className="text-gray-300 mb-4">{analysisData.fixes.longformTitleTemplate}</p>
                                                        <button
                                                            onClick={() => copyToClipboard(analysisData.fixes.longformTitleTemplate)}
                                                            className="w-full py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
                                                        >
                                                            Copy Template
                                                        </button>
                                                    </div>
                                                )}
                                                {analysisData.fixes.hashtags && (
                                                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                                                        <h3 className="font-bold text-xl mb-4">Recommended Hashtags</h3>
                                                        <p className="text-gray-300 mb-4">{analysisData.fixes.hashtags}</p>
                                                        <button
                                                            onClick={() => copyToClipboard(analysisData.fixes.hashtags)}
                                                            className="w-full py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
                                                        >
                                                            Copy Hashtags
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-32">
                            <p className="text-2xl text-gray-400">Select a channel from the sidebar to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}