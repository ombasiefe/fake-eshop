import React from 'react'

type Props = {}

function About({ }: Props) {
    return (
        <div className="text-slate-100 max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">

            {/* Header Section */}
            <header className="mb-24 text-center sm:text-left">
                <p className="text-xs font-semibold tracking-widest text-amber-500 uppercase mb-3">
                    Our Heritage
                </p>
                <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white max-w-2xl leading-tight">
                    Our Story: From Heritage to Innovation
                </h1>
                <div className="h-[1px] w-12 bg-amber-500/50 mt-6 hidden sm:block" />
            </header>

            {/* Narrative Timeline */}
            <div className="space-y-24 sm:space-y-32">

                {/* Section 1: The Foundation (Image Left, Text Right) */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <div className="md:col-span-5 order-2 md:order-1">
                        <div className="relative group overflow-hidden rounded-lg border border-slate-700/30">
                            <img
                                src="/carousel_images/Oliver & Co_Store_1978.png"
                                alt="Oliver & Co. Storefront in 1978"
                                className="w-full h-80 object-cover object-center grayscale hover:grayscale-0 transition duration-700 ease-out scale-105 group-hover:scale-100"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-7 order-1 md:order-2 space-y-4">
                        <span className="text-xs font-mono text-slate-500">EST. 1978</span>
                        <h2 className="text-2xl font-normal text-white">The Oliver & Co. Legacy</h2>
                        <p className="text-slate-400 leading-relaxed font-light text-base">
                            In 1978, we opened our doors as a modest corner shop under the name <strong>Oliver & Co.</strong>
                            It was a cozy space built on a simple foundation: a passion for quality goods and a dedication
                            to the community. For decades, we welcomed generations of customers, learning how the items we
                            surround ourselves with shape our daily lives.
                        </p>
                    </div>
                </section>

                {/* Section 2: The Evolution (Text Left, Logo/Image Right) */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <div className="md:col-span-7 space-y-4">
                        <span className="text-xs font-mono text-slate-500">THE EVOLUTION</span>
                        <h2 className="text-2xl font-normal text-white">Adapting to a Fast-Moving World</h2>
                        <p className="text-slate-400 leading-relaxed font-light text-base">
                            But as the world began to move faster, we realized that the way we live was changing, too. Our daily essentials were no longer just the clothes on our backs, but also the technology in our pockets and the subtle details that elevate our personal style.
                        </p>
                        <p className="text-slate-400 leading-relaxed font-light text-base">
                            To meet this new era, we evolved. We took the legacy of trust, curation, and care built during the Oliver & Co. years and distilled it into a new vision for the modern individual. From that evolution, <strong>Oura</strong> was born.
                        </p>
                    </div>
                    <div className="md:col-span-5">
                        <div className="bg-slate-900/40 p-12 rounded-lg border border-slate-700/30 flex items-center justify-center h-80">
                            <img
                                src="/carousel_images/Oura_Logo.png"
                                alt="Oura Minimalist Logo"
                                className="max-h-32 w-auto opacity-90 object-contain hover:opacity-100 transition duration-300"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 3: Today's Vision (Full Screen/Wide Layout) */}
                <section className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                    <div className="md:col-span-5 order-2 md:order-1">
                        <div className="relative overflow-hidden rounded-lg border border-slate-700/30">
                            <img
                                src="/carousel_images/Oura_Store.png"
                                alt="Oura Modern Storefront"
                                className="w-full h-80 object-cover object-center scale-105 hover:scale-100 transition duration-700 ease-out"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-7 order-1 md:order-2 space-y-6">
                        <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">Oura Today</span>
                        <h2 className="text-3xl font-light text-white tracking-tight">The Complete Modern Lifestyle</h2>
                        <div className="space-y-4 text-slate-400 leading-relaxed font-light text-base">
                            <p>
                                Oura represents the complete modern lifestyle. We dropped the traditional boundaries to create a seamless, hand-picked collective where cutting-edge electronics, sophisticated men's and women's apparel, and exquisite jewelry live together in harmony.
                            </p>
                            <p className="border-l-2 border-amber-500/40 pl-4 py-1 text-slate-300 italic font-normal">
                                "Our look is now sleek and minimalist, but our heart remains exactly where it was in 1978."
                            </p>
                            <p>
                                We are still here to help you curate your life—bringing you the smart innovations and sharp aesthetics you need to navigate your world with ease and elegance.
                            </p>
                        </div>
                        <div className="pt-4">
                            <span className="inline-block text-sm font-semibold tracking-wider text-white border-b border-amber-500 pb-1">
                                Welcome to Oura.
                            </span>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}

export default About