'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface Point {
    x: number;
    y: number;
    vx: number;
    vy: number;
    originX: number;
    originY: number;
}

export const GravityParticles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { theme } = useTheme()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrame: number
        let points: Point[] = []
        let width = window.innerWidth
        let height = window.innerHeight
        let mouseX = width / 2; // Start center
        let mouseY = height / 2;

        const spacing = 45
        // "Cloud" parameters
        const mouseRadius = 400 // Large radius for cloud effect
        const mouseStrength = 0.003 // Gentle pull force
        const anchorStrength = 0.02 // Spring back to origin (stiffness)
        const friction = 0.92 // Damping

        const init = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height

            points = []
            for (let x = 0; x < width + spacing; x += spacing) {
                for (let y = 0; y < height + spacing; y += spacing) {
                    points.push({
                        x: x,
                        y: y,
                        vx: 0,
                        vy: 0,
                        originX: x,
                        originY: y,
                    })
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height)

            // "Darker" colors as requested
            const isDark = theme === 'dark' || document.documentElement.classList.contains('dark')
            ctx.fillStyle = isDark ? 'rgba(148, 163, 184, 0.5)' : 'rgba(2, 132, 199, 0.5)'

            points.forEach(point => {
                // 1. Vector to Mouse
                const dx = mouseX - point.x
                const dy = mouseY - point.y
                const dist = Math.sqrt(dx * dx + dy * dy)

                // 2. Mouse Attraction (Cloud Pull)
                if (dist < mouseRadius) {
                    // Pull towards mouse, stronger when closer, but smoothened
                    const force = (mouseRadius - dist) / mouseRadius
                    point.vx += dx * force * mouseStrength
                    point.vy += dy * force * mouseStrength
                }

                // 3. Anchor Pull (Spring back to grid)
                const ax = point.originX - point.x
                const ay = point.originY - point.y
                point.vx += ax * anchorStrength
                point.vy += ay * anchorStrength

                // 4. Physics Integration
                point.vx *= friction
                point.vy *= friction
                point.x += point.vx
                point.y += point.vy

                ctx.save()
                ctx.translate(point.x, point.y)

                // Rotate to velocity (flow direction) or mouse?
                // Let's face the mouse for "attention"
                const angle = Math.atan2(mouseY - point.y, mouseX - point.x)
                ctx.rotate(angle)

                // Draw tick
                ctx.fillRect(-1, -1, 3, 3)
                ctx.restore()
            })

            animationFrame = requestAnimationFrame(animate)
        }

        const handleResize = () => {
            init()
        }

        const handleMouseMove = (e: MouseEvent) => {
            // Need relative coordinates if canvas is not fixed full screen, 
            // but we plan to make it fixed/absolute covering the section.
            const rect = canvas.getBoundingClientRect()
            mouseX = e.clientX - rect.left
            mouseY = e.clientY - rect.top
        }

        init()
        animate()

        window.addEventListener('resize', handleResize)
        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            cancelAnimationFrame(animationFrame)
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [theme])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        />
    )
}
