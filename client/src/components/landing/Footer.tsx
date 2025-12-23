'use client'

import Link from 'next/link'

export const Footer = () => {
    return (
        <footer className="py-12 bg-slate-50 dark:bg-black border-t border-black/5 dark:border-white/5">
            <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 bg-sky-500 rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full" />
                    </div>
                    <span className="text-lg font-bold tracking-tighter">Hire Radar</span>
                </div>

                <div className="flex gap-8 text-sm text-muted-foreground">
                    <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                </div>

                <div className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Hire Radar. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
