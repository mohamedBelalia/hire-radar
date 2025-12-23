'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const reviews = [
    {
        name: "Sarah Jenkins",
        role: "Senior Developer",
        content: "Hire Radar found me a job that wasn't even listed on other major platforms. The matching algorithm is scarily accurate.",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=sarah"
    },
    {
        name: "Michael Chen",
        role: "Product Manager",
        content: "The direct connection to hiring managers changed everything. No more applying into the void.",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=michael"
    },
    {
        name: "Emily Davis",
        role: "UX Designer",
        content: "Beautiful interface and incredibly easy to use. I landed my dream role in less than two weeks.",
        rating: 5,
        image: "https://i.pravatar.cc/150?u=emily"
    }
]

export const Reviews = () => {
    return (
        <section id="reviews" className="py-24 relative overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Loved by Professionals</h2>
                    <p className="text-muted-foreground text-lg">Don't just take our word for it. Here's what our users have to say.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/5 shadow-sm"
                        >
                            <div className="flex gap-1 text-amber-500 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" />
                                ))}
                            </div>
                            <p className="text-lg mb-6 leading-relaxed">"{review.content}"</p>
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={review.image} />
                                    <AvatarFallback>{review.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-sm">{review.name}</p>
                                    <p className="text-xs text-muted-foreground">{review.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
