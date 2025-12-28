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
            animate={{ scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
            }}
            style={{
                top: style.top ?? 0,
                left: style.left ?? 0,
                width: style.width ?? 'auto',
                height: style.height ?? 'auto',
                borderRadius: '24px',
                overflow: 'visible',
                zIndex: isExpanded ? 10 : isCollapsed ? 5 : 1,
                transition: 'top 0.5s cubic-bezier(0.4, 0, 0.2, 1), left 0.5s cubic-bezier(0.4, 0, 0.2, 1), width 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        >
            {/* 마우스 따라다니는 글로우 보더 효과 */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '24px',
                    padding: '1px',
                    background: isHovered
                        ? `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 180, 180, 0.8), rgba(255, 200, 180, 0.4) 40%, transparent 70%)`
                        : 'linear-gradient(135deg, rgba(255, 200, 200, 0.3), rgba(255, 220, 200, 0.2))',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                    pointerEvents: 'none',
                    transition: 'background 0.15s ease',
                }}
            />

            {/* 호버 시 전체 글로우 효과 */}
            <div
                style={{
                    position: 'absolute',
                    inset: '-1px',
                    borderRadius: '25px',
                    background: isHovered
                        ? `radial-gradient(circle 200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 180, 170, 0.15), transparent 60%)`
                        : 'transparent',
                    pointerEvents: 'none',
                    transition: 'background 0.2s ease',
                    filter: 'blur(8px)',
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
                    boxShadow: isExpanded
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
