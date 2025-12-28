"use client";

import React, { useState } from "react";
import { Instagram, Youtube, Mail } from "lucide-react";
import { motion } from "framer-motion";

// 치지직 아이콘 컴포넌트
const ChzzkIcon = ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// 나무위키 아이콘 컴포넌트
const NamuWikiIcon = ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
);

// 소셜 버튼 컴포넌트 (호버 효과 포함)
const SocialButton = ({ social, iconStyle }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.a
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                padding: '14px',
                background: isHovered ? 'rgba(255, 107, 157, 0.15)' : 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(4px)',
                borderRadius: '14px',
                border: isHovered ? '1px solid rgba(255, 107, 157, 0.5)' : '1px solid rgba(200, 200, 200, 0.3)',
                color: isHovered ? '#ff6b9d' : '#6b7280',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
            }}
            whileHover={{
                scale: 1.1,
                y: -4,
            }}
            whileTap={{
                scale: 0.95,
            }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
            }}
        >
            <social.icon style={iconStyle} />
        </motion.a>
    );
};

export default function Footer() {
    const socialLinks = [
        {
            name: "YouTube",
            icon: Youtube,
            url: "https://www.youtube.com/@yooauau_official",
        },
        {
            name: "Instagram",
            icon: Instagram,
            url: "https://www.instagram.com/yooauau/",
        },
        {
            name: "Email",
            icon: Mail,
            url: "mailto:yooa@yooa.io",
        },
        {
            name: "CHZZK",
            icon: ChzzkIcon,
            url: "https://chzzk.naver.com/0c21abb4cc94b8d1de5b2bdaf9a69aa9",
        },
        {
            name: "NamuWiki",
            icon: NamuWikiIcon,
            url: "https://namu.wiki/w/유아%20YooA",
        },
    ];

    const iconStyle = {
        width: '26px',
        height: '26px',
    };

    const linkStyle = {
        color: '#6b7280',
        textDecoration: 'none',
        fontSize: '16px',
        transition: 'color 0.2s',
    };

    return (
        <motion.footer
            style={{
                padding: '16px 24px',
                paddingBottom: '0',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div style={{
                maxWidth: '75vw',
                margin: '0 auto',
                position: 'relative',
            }}>
                {/* 배경 박스 - 아래로 50% 이동하여 바닥에 반 박힘 */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    top: '20px',
                    bottom: '-40px',
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '24px 24px 0 0',
                    border: '1px solid rgba(255, 200, 200, 0.3)',
                    borderBottom: 'none',
                    boxShadow: '0 -4px 24px rgba(0, 0, 0, 0.06)',
                    zIndex: -1,
                }} />
                {/* 컨텐츠 */}
                <div style={{
                    padding: '12px 32px',
                    paddingBottom: '18px',
                }}>
                {/* Social Links - Center */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '6px', marginTop: '28px' }}>
                    {socialLinks.map((social) => (
                        <SocialButton key={social.name} social={social} iconStyle={iconStyle} />
                    ))}
                </div>

                {/* Copyright - Right aligned */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '6px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '16px', color: '#4b5563', margin: 0 }}>
                            © 2025 YooA. All rights reserved.
                        </p>
                        <p style={{ fontSize: '14px', color: '#9ca3af', margin: '4px 0 0 0' }}>
                            Made <span style={{ color: '#fb7185' }}>♡</span> by YooA
                        </p>
                    </div>
                </div>

                {/* Navigation Links - Center */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                    <a href="#" style={linkStyle}>About</a>
                    <span style={{ color: '#d1d5db' }}>·</span>
                    <a href="#" style={linkStyle}>Contact</a>
                    <span style={{ color: '#d1d5db' }}>·</span>
                    <a href="#" style={linkStyle}>Privacy Policy</a>
                    <span style={{ color: '#d1d5db' }}>·</span>
                    <a href="#" style={linkStyle}>Terms of Service</a>
                </div>
                </div>
            </div>
        </motion.footer>
    );
}
