'use client';

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Welcome to Squigly! You're on the early access list 🎉");
        setEmail("");
      } else {
        setMessage(data.error || "Something went wrong — try again");
      }
    } catch (err) {
      setMessage("Network error — check your connection and try again");
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0f172a] to-black text-white">
        <div className="container mx-auto px-6 py-24 text-center md:py-32 lg:py-40">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Squigly
          </h1>

          <p className="mt-8 text-xl text-gray-300 sm:text-2xl md:text-3xl max-w-4xl mx-auto">
            Your playful AI coach for YouTube Shorts growth
          </p>

          <p className="mt-8 text-lg text-gray-400 sm:text-xl md:text-2xl max-w-3xl mx-auto">
            Connect your channel · Get daily personalized video ideas · Predict virality before you film · Grow faster without the guesswork
          </p>

          <div className="mt-16 max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                  className="flex-1 px-6 py-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-white disabled:opacity-50"
              />
              <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition disabled:opacity-50"
              >
                {loading ? "Adding..." : "Join Early Access"}
              </button>
            </form>

            {message && (
                <p className={`mt-6 text-lg font-medium ${message.includes('Welcome') || message.includes('already') ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </p>
            )}
          </div>

          <p className="mt-20 text-base text-gray-500 md:text-lg">
            Built by a dad honoring his autistic son's nickname — the spark that started it all
          </p>
        </div>
      </main>
  );
}