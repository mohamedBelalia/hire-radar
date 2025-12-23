'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Globe, Zap, Shield, Rocket, Target, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { GravityParticles } from './GravityParticles'

export const Hero = () => {
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 500], [0, 200])
    const opacity = useTransform(scrollY, [0, 300], [1, 0])

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden bg-gradient-to-b from-sky-50/50 to-white dark:from-slate-950 dark:to-black">
            {/* Gravity Particles Background */}
            <GravityParticles />

            {/* Floating Background Elements (Ambient) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <AmbientFloat delay={0} x="10%" y="20%"><Globe className="w-12 h-12 text-slate-400/50" /></AmbientFloat>
                <AmbientFloat delay={2} x="85%" y="15%"><Zap className="w-10 h-10 text-amber-400/50" /></AmbientFloat>
                <AmbientFloat delay={4} x="15%" y="60%"><Shield className="w-8 h-8 text-emerald-400/50" /></AmbientFloat>
                <AmbientFloat delay={1} x="80%" y="70%"><Rocket className="w-14 h-14 text-rose-400/50" /></AmbientFloat>
                <AmbientFloat delay={3} x="5%" y="40%"><Target className="w-8 h-8 text-cyan-400/50" /></AmbientFloat>
                <AmbientFloat delay={5} x="90%" y="40%"><Briefcase className="w-10 h-10 text-violet-400/50" /></AmbientFloat>
            </div>

            <motion.div
                style={{ y, opacity }}
                className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/50 dark:bg-white/5 dark:border-white/10 px-3 py-1 text-sm backdrop-blur-sm mb-8"
                >
                    <span className="flex h-2 w-2 rounded-full bg-sky-500"></span>
                    <span className="text-muted-foreground">Reimagining Job Search</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-black to-black/60 dark:from-white dark:to-white/60 mb-6"
                >
                    Find your next <br className="hidden md:block" />
                    <span className="text-sky-600">adventure</span>.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
                >
                    Hire Radar connects you with top-tier opportunities using intelligent matching algorithms. Stop searching, start discovering.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-4 items-center"
                >
                    <Link href="/register">
                        <Button size="lg" className="rounded-full h-12 px-8 text-base bg-sky-600 hover:bg-sky-500 shadow-xl shadow-sky-500/20 transition-transform hover:scale-105">
                            Start Exploring
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button variant="outline" size="lg" className="rounded-full h-12 px-8 text-base border-black/10 hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/5">
                            Learn More
                        </Button>
                    </Link>
                </motion.div>

            </motion.div>
        </section>
    )
}

const AmbientFloat = ({ delay, x, y, children }: { delay: number, x: string, y: string, children: React.ReactNode }) => {
    return (
        <motion.div
            animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
            }}
            transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay
            }}
            style={{ left: x, top: y }}
            className="absolute p-4 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-sm border border-white/20 shadow-lg"
        >
            {children}
        </motion.div>
    )
}
