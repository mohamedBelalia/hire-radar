'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

import Image from 'next/image'

export const Header = () => {
    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-black/5 dark:border-white/5"
        >
            <div className="flex items-center gap-2">
                <Image
                    src="/radar.svg"
                    alt="Hire Radar"
                    width={32}
                    height={32}
                    className="invert dark:invert-0"
                />
                <span className="text-xl font-bold tracking-tighter">Hire Radar</span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80">
                <Link href="#features" className="hover:opacity-100 transition-opacity">Features</Link>
                <Link href="#reviews" className="hover:opacity-100 transition-opacity">Reviews</Link>
                <Link href="#partners" className="hover:opacity-100 transition-opacity">Partners</Link>
            </nav>

            <div className="flex items-center gap-4">
                <Link href="/login">
                    <Button variant="ghost" className="hidden sm:flex hover:bg-black/5 dark:hover:bg-white/5">
                        Log in
                    </Button>
                </Link>
                <Link href="/signup">
                    <Button className="rounded-full px-6 bg-sky-600 hover:bg-sky-500 text-white border-none shadow-lg shadow-sky-500/20">
                        Get Started
                    </Button>
                </Link>
            </div>
        </motion.header>
    )
}
