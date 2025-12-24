// src/app/about/page.tsx
export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-black text-white py-20 px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-12 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent text-center">
                    About SquigAI
                </h1>

                <div className="prose prose-invert max-w-none space-y-8 text-lg leading-relaxed">
                    <p>
                        Hi, I'm the solo developer behind Squigly — a dad of three, including my son who has autism.
                    </p>

                    <p>
                        For over 30 years, I chased the corporate dream, climbing ladders only to be hit with layoffs — four so far, and another one looming.
                        Each time it felt like the ground disappeared beneath me, but it also taught me something important: security isn't found in a company title or paycheck — it's built by creating something of your own that truly helps people.
                    </p>

                    <p>
                        That's why I turned to AI. After years of side projects, late nights, and learning through trial and error, Squigly was born — a tool to help YouTube creators grow with honest, powerful AI coaching.
                    </p>

                    <p>
                        Every subscription, every bit of feedback, every creator who finds value here brings me one step closer to something sustainable — a way to provide for my family, give back to autism causes, and build more tools that make AI accessible and useful for everyone getting started.
                    </p>

                    <p className="font-bold text-xl mt-12">
                        Thank you for using Squigly.
                    </p>

                    <p>
                        Your support isn't just a subscription — it's helping a family, funding autism advocacy, and proving that leaving corporate disappointment can lead to something meaningful for creators and users alike.
                    </p>

                    <p className="text-purple-400 font-medium mt-8">
                        Gratefully,
                        The Squigly Creator
                    </p>
                </div>
            </div>
        </div>
    );
}