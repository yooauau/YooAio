"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagicBento({
    children,
    className = "",
    isExpanded = false,
    isCollapsed = false,
    style = {}
}) {
    const containerRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.div
            ref={containerRef}
            className={`absolute ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={false}
            animate={{
                scale: isHovered ? 1.02 : 1,
                y: isHovered ? -4 : 0,
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
            }}
            style={{
                top: style.top ?? 0,
                left: style.left ?? 0,
                width: style.width ?? 'auto',
                height: style.height ?? 'auto',
                borderRadius: '24px',
                overflow: 'visible',
                zIndex: isExpanded ? 10 : isHovered ? 8 : isCollapsed ? 5 : 1,
                transition: 'top 0.5s cubic-bezier(0.4, 0, 0.2, 1), left 0.5s cubic-bezier(0.4, 0, 0.2, 1), width 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            {/* 핑크색 테두리 - 기본 연한 핑크 2px, 호버 시 그라데이션으로 진해짐 */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '24px',
                    padding: isHovered ? '2.5px' : '2px',
                    background: isHovered
                        ? 'linear-gradient(135deg, #ff6b9d 0%, #c44569 25%, #ff85ad 50%, #d45579 75%, #ff6b9d 100%)'
                        : 'linear-gradient(135deg, rgba(255, 182, 193, 0.8), rgba(255, 192, 203, 0.6))',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease',
                    backgroundSize: isHovered ? '200% 200%' : '100% 100%',
                    animation: isHovered ? 'borderGradientMove 2s ease infinite' : 'none',
                }}
            />

            {/* 마우스 따라다니는 글로우 보더 효과 */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '24px',
                    padding: '2px',
                    background: isHovered
                        ? `radial-gradient(circle 180px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 107, 157, 0.9), rgba(196, 69, 105, 0.5) 40%, transparent 70%)`
                        : 'transparent',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                    transition: 'opacity 0.2s ease',
                    opacity: isHovered ? 1 : 0,
                }}
            />

            {/* 호버 시 외부 글로우 효과 */}
            <div
                style={{
                    position: 'absolute',
                    inset: '-8px',
                    borderRadius: '32px',
                    background: isHovered
                        ? 'linear-gradient(135deg, rgba(255, 107, 157, 0.2), rgba(196, 69, 105, 0.15), rgba(255, 133, 173, 0.2))'
                        : 'transparent',
                    pointerEvents: 'none',
                    transition: 'all 0.3s ease',
                    filter: 'blur(12px)',
                    opacity: isHovered ? 1 : 0,
                }}
            />

            {/* 메인 컨텐츠 영역 */}
            <div
                style={{
                    position: 'relative',
                    height: '100%',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: isHovered
                        ? '0 20px 50px -10px rgba(255, 107, 157, 0.25), 0 10px 30px -5px rgba(196, 69, 105, 0.15)'
                        : isExpanded
                            ? '0 25px 60px -15px rgba(0, 0, 0, 0.12)'
                            : '0 4px 24px rgba(0, 0, 0, 0.06)',
                    opacity: isCollapsed ? 0.9 : 1,
                    transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
                }}
            >
                {children}
            </div>
        </motion.div>
    );
}
