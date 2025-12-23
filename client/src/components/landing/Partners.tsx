'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// Simplified logos for demo purposes (Paths from simpleicons.org or generic)
const partners = [
    {
        name: "LinkedIn",
        path: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
    },
    {
        name: "Indeed",
        path: "M13.6 15.6c-.7.5-1.6.8-2.6.8-1.9 0-3.3-1.4-3.3-3.3 0-1.9 1.4-3.3 3.3-3.3 1 0 1.9.3 2.6.8l2.2-2.3c-1.3-1.2-3-1.8-4.8-1.8-4.2 0-7.7 3.4-7.7 7.7s3.5 7.7 7.7 7.7c1.8 0 3.5-.6 4.8-1.8l-2.2-2.5zm10.4-3.5c0 4.2-3.4 7.7-7.7 7.7-4.2 0-7.7-3.4-7.7-7.7s3.4-7.7 7.7-7.7 7.7 3.4 7.7 7.7z"
    },
    {
        name: "Monster",
        path: "M24 12c0 6.627-5.373 12-12 12s-12-5.373-12-12 5.373-12 12-12 12 5.373 12 12zm-4.322 0l-2.355 7.643h-2.356l2.356-7.643h2.355zm-6.677 0l-2.356 7.643h-2.355l2.355-7.643h2.355zm-1.178-5.714c.651 0 1.178-.527 1.178-1.178s-.527-1.178-1.178-1.178-1.177.527-1.177 1.178.526 1.178 1.177 1.178zm5.5 0c.651 0 1.178-.527 1.178-1.178s-.527-1.178-1.178-1.178-1.178.527-1.178 1.178.527 1.178 1.178 1.178z"
    },
    {
        name: "Glassdoor",
        path: "M19.9 2h-15.8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h15.8c1.1 0 2-.9 2-2v-16c0-1.1-.9-2-2-2zm-12.8 15h-3v-3h3v3zm0-5h-3v-3h3v3zm0-5h-3v-3h3v3zm8 10h-6v-3h6v3zm0-5h-6v-3h6v3zm0-5h-6v-3h6v3zm5 10h-3v-3h3v3zm0-5h-3v-3h3v3z"
    }
]

export const Partners = () => {
    return (
        <section id="partners" className="py-16 border-t border-black/5 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
            <div className="container px-4 md:px-6 mx-auto text-center">
                <p className="text-sm font-medium text-muted-foreground mb-8">TRUSTED BY LEADING RECRUITMENT PLATFORMS</p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    {/* 
                        Ideally we would use SVGs here. 
                        Since we don't have them, I'll use text placeholders styled to look like logos 
                        or minimal SVGs if I could generate them. For now, text/blocks.
                     */}
                    {partners.map((partner) => (
                        <div key={partner.name} className="flex items-center gap-2 group cursor-default">
                            <svg
                                className="h-8 w-8 md:h-10 md:w-10 fill-current"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d={partner.path} />
                            </svg>
                            <span className="text-xl md:text-2xl font-bold">{partner.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
