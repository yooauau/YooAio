"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MagicBento({
    children,
    className = "",
    isExpanded = false,
    isCollapsed = false,
    style = {}
}) {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.div
            className={`absolute rounded-3xl p-[4px] ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={false}
            animate={{
                top: style.top,
                left: style.left,
                width: style.width,
                height: style.height,
                scale: isHovered && !isExpanded && !isCollapsed ? 1.02 : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                scale: { duration: 0.2 }
            }}
            style={{
                background: isHovered
                    ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 182, 193, 0.4), rgba(255, 182, 193, 0.1) 40%, transparent 80%)`
                    : 'linear-gradient(to bottom, rgba(255, 182, 193, 0.15), rgba(255, 182, 193, 0.1))',
                boxShadow: isHovered
                    ? '0 25px 50px -12px rgba(255, 182, 193, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
                    : isExpanded
                        ? '0 40px 80px -20px rgba(255, 182, 193, 0.4)'
                        : '0 10px 40px rgba(0,0,0,0.1)',
                zIndex: isExpanded ? 10 : isCollapsed ? 5 : 1,
            }}
        >
            {/* Content wrapper with white background */}
            <div className="relative h-full rounded-3xl overflow-hidden bg-white"
                style={{
                    opacity: isCollapsed ? 0.85 : 1,
                    transition: 'opacity 0.3s ease',
                }}
            >
                {children}
            </div>
        </motion.div>
    );
}
