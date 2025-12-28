"use client";

import React, { useEffect, useRef } from "react";

export default function PixelSnow() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Snowflake particles
        const particles = [];
        const particleCount = 100;

        class Snowflake {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 2; // 2-5px
                this.speedX = Math.random() * 1 - 0.5; // -0.5 to 0.5
                this.speedY = Math.random() * 1 + 0.5; // 0.5 to 1.5
                this.opacity = Math.random() * 0.5 + 0.3; // 0.3 to 0.8
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Reset when snowflake goes off screen
                if (this.y > canvas.height) {
                    this.y = -10;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x > canvas.width) {
                    this.x = 0;
                } else if (this.x < 0) {
                    this.x = canvas.width;
                }
            }

            draw() {
                ctx.fillStyle = `rgba(255, 182, 193, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Snowflake());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });

            requestAnimationFrame(animate);
        }

        animate();

        // Handle resize
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ mixBlendMode: "screen" }}
        />
    );
}
