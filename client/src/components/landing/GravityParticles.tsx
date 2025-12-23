'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface Point {
    x: number;
    y: number;
    originX: number;
    originY: number;
    angle: number;
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
        let mouseX = -100 // Initialize off-screen
        let mouseY = -100

        const spacing = 40 // Grid spacing
        const connectionRadius = 150 // Mouse influence radius

        const init = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height

            points = []
            // Create grid of points
            for (let x = 0; x < width; x += spacing) {
                for (let y = 0; y < height; y += spacing) {
                    points.push({
                        x: x,
                        y: y,
                        originX: x,
                        originY: y,
                        angle: Math.random() * Math.PI * 2
                    })
                }
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height)

            // Color based on theme
            const isDark = theme === 'dark' || document.documentElement.classList.contains('dark')
            ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(59, 130, 246, 0.4)' // Sky blue in light, white in dark

            points.forEach(point => {
                // Calculate distance to mouse
                const dx = mouseX - point.x
                const dy = mouseY - point.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                // Mouse interaction physics
                if (distance < connectionRadius) {
                    // Repel/Attract logic simulating "gravity" or "distortion"
                    // The google example seems to have a "Lens" effect where points move OUTWARDS or Rotate around
                    const force = (connectionRadius - distance) / connectionRadius
                    const angle = Math.atan2(dy, dx)

                    // Push away
                    const pushX = Math.cos(angle) * force * 40
                    const pushY = Math.sin(angle) * force * 40

                    point.x += (point.originX - pushX - point.x) * 0.1
                    point.y += (point.originY - pushY - point.y) * 0.1
                } else {
                    // Return to origin
                    point.x += (point.originX - point.x) * 0.05
                    point.y += (point.originY - point.y) * 0.05
                }

                // Draw "Tick" or small rect to look like the reference image
                ctx.save()
                ctx.translate(point.x, point.y)

                // Rotate towards mouse for compass effect
                const rotAngle = Math.atan2(mouseY - point.y, mouseX - point.x)
                ctx.rotate(rotAngle)

                ctx.fillRect(-1.5, -0.5, 3, 1) // Small tick
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
