import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Squigly - Your Playful AI Coach for YouTube Shorts",
  description: "Daily personalized video ideas, channel analysis, and virality predictions for creators",
};

export default function Home() {
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

          <div className="mt-16">
            <div className="inline-block rounded-2xl bg-gray-800/50 border border-gray-700 px-12 py-8 shadow-2xl">
              <p className="text-4xl font-bold text-white md:text-5xl">Coming January 2026</p>
              <p className="mt-4 text-xl text-gray-300">Early access waitlist open soon</p>
            </div>
          </div>

          <p className="mt-20 text-base text-gray-500 md:text-lg">
            Built by a dad honoring his autistic son's nickname — the spark that started it all
          </p>
        </div>
      </main>
  );
}