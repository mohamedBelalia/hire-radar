'use client'

import { Header } from './Header'
import { Hero } from './Hero'
import { Features } from './Features'
import { Reviews } from './Reviews'
import { Partners } from './Partners'
import { Footer } from './Footer'

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground selection:bg-sky-500/30">
            <Header />
            <main>
                <Hero />
                <Partners />
                <Features />
                <Reviews />
            </main>
            <Footer />
        </div>
    )
}
