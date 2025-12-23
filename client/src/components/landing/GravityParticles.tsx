'use client'

import { motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { useTheme } from 'next-themes'

/**
 * GravityParticles Component
 * 
 * Implements a "Gravity Halo" effect.
 * The cursor acts as a gravity center, but particles are constrained to a minimum radius,
 * forming a floating cloud/ring around the cursor that never collapses to the center.
 */

interface ParticleConfig {
    id: number
    initialX: number
    initialY: number
    // Polar coordinates relative to cursor for the "Halo" target
    targetRadius: number
    targetAngle: number
    scale: number
    mass: number
    floatDuration: number
}

export const GravityParticles = () => {
    const { theme } = useTheme()

    // Track cursor position
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Strength of the pull: 0 = Idle (distributed), 1 = Active (Halo)
    const gravityStrength = useMotionValue(0)

    const [particles, setParticles] = useState<ParticleConfig[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Initialize particles
        // Use a decent count for the "cloud" feel, but keep performant
        const count = window.innerWidth < 768 ? 40 : 120
        const newParticles: ParticleConfig[] = []

        for (let i = 0; i < count; i++) {
            newParticles.push({
                id: i,
                initialX: Math.random() * window.innerWidth,
                initialY: Math.random() * window.innerHeight,
                // The "Halo" zone: 80px to 220px from cursor
                targetRadius: Math.random() * 140 + 80,
                targetAngle: Math.random() * Math.PI * 2,
                scale: Math.random() * 0.5 + 0.5, // 0.5 to 1.0 scale
                mass: Math.random() * 2 + 1, // varied internal inertia
                floatDuration: Math.random() * 4 + 3
            })
        }
        setParticles(newParticles)

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
            // Activate gravity on first move
            if (gravityStrength.get() === 0) {
                gravityStrength.set(1)
            }
        }

        const handleMouseLeave = () => {
            // optional: gravityStrength.set(0)
        }

        window.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [gravityStrength, mouseX, mouseY])

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
            aria-hidden="true"
        >
            {particles.map((p) => (
                <Particle
                    key={p.id}
                    config={p}
                    mouseX={mouseX}
                    mouseY={mouseY}
                    gravityStrength={gravityStrength}
                />
            ))}
        </div>
    )
}

const Particle = ({
    config,
    mouseX,
    mouseY,
    gravityStrength
}: {
    config: ParticleConfig,
    mouseX: MotionValue<number>,
    mouseY: MotionValue<number>,
    gravityStrength: MotionValue<number>
}) => {
    // 1. Calculate Target Position
    // Idle: Initial grid/random position
    // Active: Cursor Pos + (Radius * cos(angle))

    const targetX = useTransform(() => {
        const strength = gravityStrength.get()
        const haloX = mouseX.get() + Math.cos(config.targetAngle) * config.targetRadius
        return config.initialX * (1 - strength) + haloX * strength
    })

    const targetY = useTransform(() => {
        const strength = gravityStrength.get()
        const haloY = mouseY.get() + Math.sin(config.targetAngle) * config.targetRadius
        return config.initialY * (1 - strength) + haloY * strength
    })

    // 2. Physics (Spring)
    // Smooth, airy, with slight "lag" (damping)
    const springConfig = {
        stiffness: 40, // Low stiffness = loose spring
        damping: 15,   // Medium damping = some oscillation but settles
        mass: config.mass
    }

    const x = useSpring(targetX, springConfig)
    const y = useSpring(targetY, springConfig)

    return (
        <motion.div
            style={{
                x,
                y,
                scale: config.scale
            }}
            // Style: Tiny dot (2px)
            className="absolute top-0 left-0 w-1 h-1 bg-slate-400/60 dark:bg-slate-300/60 rounded-full"
        >
        </motion.div>
    )
}
