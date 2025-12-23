'use client'

import { motion, useAnimationFrame, motionValue, MotionValue } from 'framer-motion'
import { useEffect, useState, useRef, useMemo } from 'react'
import { useTheme } from 'next-themes'

interface ParticleData {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    size: number
    baseOpacity: number
    currentOpacity: number
    mass: number
    mx: MotionValue<number>
    my: MotionValue<number>
    mOpacity: MotionValue<number>
}

const PARTICLE_COUNT = 200
const MOVEMENT_SPEED = 0.5
const MOUSE_INFLUENCE = 150
const GRAVITY_STRENGTH = 5
const USE_GLOW = true

export const GravityParticles = () => {
    const { theme } = useTheme()
    const containerRef = useRef<HTMLDivElement>(null)
    const [isReady, setIsReady] = useState(false)
    const mouseRef = useRef({ x: -1000, y: -1000 })
    const particles = useMemo(() => {
        const temp: ParticleData[] = []
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            temp.push({
                id: i,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                size: 2,
                baseOpacity: 0.5,
                currentOpacity: 0.5,
                mass: 1,
                mx: motionValue(0),
                my: motionValue(0),
                mOpacity: motionValue(0.5)
            })
        }
        return temp
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return

        const width = window.innerWidth
        const height = window.innerHeight

        particles.forEach(p => {
            const x = Math.random() * width
            const y = Math.random() * height
            const opacity = 0.3 + Math.random() * 0.5

            p.x = x
            p.y = y
            p.vx = (Math.random() - 0.5) * MOVEMENT_SPEED
            p.vy = (Math.random() - 0.5) * MOVEMENT_SPEED
            p.size = Math.random() * 3 + 2
            p.baseOpacity = opacity
            p.currentOpacity = opacity
            p.mass = Math.random() * 0.5 + 0.5

            p.mx.set(x)
            p.my.set(y)
            p.mOpacity.set(opacity)
        })

        setIsReady(true)

        const handleMouseMove = (e: MouseEvent) => {
            const rect = containerRef.current?.getBoundingClientRect()
            if (rect) {
                mouseRef.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                }
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [particles])

    useAnimationFrame((time) => {
        if (!isReady) return

        const width = containerRef.current?.offsetWidth || window.innerWidth
        const height = containerRef.current?.offsetHeight || window.innerHeight
        const mouse = mouseRef.current

        particles.forEach(p => {
            const dx = mouse.x - p.x
            const dy = mouse.y - p.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < MOUSE_INFLUENCE && distance > 0) {
                const force = (MOUSE_INFLUENCE - distance) / MOUSE_INFLUENCE
                const normalizedDx = dx / distance
                const normalizedDy = dy / distance
                const gravityForce = force * GRAVITY_STRENGTH * 0.05

                p.vx += normalizedDx * gravityForce
                p.vy += normalizedDy * gravityForce

                p.currentOpacity = Math.min(1, p.baseOpacity + force * 0.4)
            } else {
                p.currentOpacity = Math.max(p.baseOpacity, p.currentOpacity - 0.01)

                p.vx *= 0.99
                p.vy *= 0.99

                if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.01
                if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.01
            }

            p.x += p.vx
            p.y += p.vy

            if (p.x < 0) p.x = width
            if (p.x > width) p.x = 0
            if (p.y < 0) p.y = height
            if (p.y > height) p.y = 0

            p.mx.set(p.x)
            p.my.set(p.y)
            p.mOpacity.set(p.currentOpacity)
        })
    })

    const particleColor = theme === 'dark' ? '#FFFFFF' : '#0ea5e9'

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
            aria-hidden="true"
        >
            {isReady && particles.map((p) => (
                <Particle
                    key={p.id}
                    data={p}
                    color={particleColor}
                />
            ))}
        </div>
    )
}

const Particle = ({ data, color }: { data: ParticleData, color: string }) => {
    return (
        <motion.div
            style={{
                x: data.mx,
                y: data.my,
                opacity: data.mOpacity,
                width: data.size,
                height: data.size,
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}`
            }}
            className="absolute top-0 left-0 rounded-full"
        />
    )
}
