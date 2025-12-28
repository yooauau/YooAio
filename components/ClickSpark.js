"use client";

import React, { useRef, useCallback, useEffect } from "react";

export default function ClickSpark({
    sparkColor = '#ff6b9d',
    sparkSize = 10,
    sparkRadius = 15,
    sparkCount = 8,
    duration = 400,
    enabled = true,
    style = {},
}) {
    const canvasRef = useRef(null);
    const isDraggingRef = useRef(false);
    const mouseDownPosRef = useRef({ x: 0, y: 0 });

    const createSpark = useCallback((x, y) => {
        if (!canvasRef.current || !enabled) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Canvas 크기 설정
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const sparks = [];

        // 스파크 생성
        for (let i = 0; i < sparkCount; i++) {
            const angle = (Math.PI * 2 / sparkCount) * i;
            sparks.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * sparkRadius,
                vy: Math.sin(angle) * sparkRadius,
                size: sparkSize,
                alpha: 1,
            });
        }

        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress >= 1) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            sparks.forEach((spark) => {
                const currentProgress = progress;
                const currentX = spark.x + spark.vx * currentProgress * 2;
                const currentY = spark.y + spark.vy * currentProgress * 2;
                const currentSize = spark.size * (1 - currentProgress * 0.5);
                const currentAlpha = 1 - currentProgress;

                ctx.beginPath();
                ctx.arc(currentX, currentY, currentSize, 0, Math.PI * 2);
                ctx.fillStyle = sparkColor;
                ctx.globalAlpha = currentAlpha;
                ctx.fill();
                ctx.closePath();
            });

            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        };

        animate();
    }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, enabled]);

    useEffect(() => {
        if (!enabled) return;

        // 클릭 영역 체크 (좌우 15%~85%)
        const isInClickArea = (x) => {
            const windowWidth = window.innerWidth;
            const leftBound = windowWidth * 0.15;
            const rightBound = windowWidth * 0.85;
            return x >= leftBound && x <= rightBound;
        };

        const handleMouseDown = (e) => {
            mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
            isDraggingRef.current = false;
        };

        const handleMouseMove = (e) => {
            const dx = Math.abs(e.clientX - mouseDownPosRef.current.x);
            const dy = Math.abs(e.clientY - mouseDownPosRef.current.y);
            if (dx > 5 || dy > 5) {
                isDraggingRef.current = true;
            }
        };

        const handleMouseUp = (e) => {
            // 드래그가 아닌 클릭일 때만 스파크 생성
            if (!isDraggingRef.current && isInClickArea(e.clientX)) {
                createSpark(e.clientX, e.clientY);
            }
            isDraggingRef.current = false;
        };

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [createSpark, enabled]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 9999,
                ...style,
            }}
        />
    );
}
