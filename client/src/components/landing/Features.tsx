'use client'

import { motion } from 'framer-motion'
import { Briefcase, Users, BarChart3, Lock } from 'lucide-react'

const features = [
    {
        icon: <Briefcase className="w-6 h-6" />,
        title: "Smart Matching",
        description: "Our algorithm learns from your preferences to show you jobs that actually match your skills and interests."
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: "Direct Connections",
        description: "Skip the queue. Connect directly with hiring managers and get feedback faster than ever before."
    },
    {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Career Insights",
        description: "Get real-time data on salary trends, demand for your skills, and market opportunities."
    },
    {
        icon: <Lock className="w-6 h-6" />,
        title: "Privacy First",
        description: "Your data is yours. We use enterprise-grade encryption to keep your personal information secure."
    }
]

export const Features = () => {
    return (
        <section id="features" className="py-24 bg-white dark:bg-black border-t border-black/5 dark:border-white/5">
            <div className="container px-4 md:px-6 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Why choose Hire Radar?</h2>
                    <p className="text-muted-foreground text-lg">We've rebuilt the job search experience from the ground up to focus on what matters most: you.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-6 rounded-3xl bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                            <div className="h-12 w-12 rounded-2xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
