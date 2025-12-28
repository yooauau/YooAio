"use client";

import React from "react";
import { Instagram, Youtube, Mail } from "lucide-react";
import { motion } from "framer-motion";

// 치지직 아이콘 컴포넌트
const ChzzkIcon = ({ style }) => (
    <svg style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

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
    ];

    const iconStyle = {
        width: '20px',
        height: '20px',
    };

    const socialButtonStyle = {
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(4px)',
        borderRadius: '12px',
        border: '1px solid rgba(200, 200, 200, 0.3)',
        color: '#6b7280',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s',
    };

    const linkStyle = {
        color: '#6b7280',
        textDecoration: 'none',
        fontSize: '14px',
        transition: 'color 0.2s',
    };

    return (
        <motion.footer
            style={{
                padding: '24px 32px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* Social Links - Center */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
                    {socialLinks.map((social) => (
                        <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={socialButtonStyle}
                        >
                            <social.icon style={iconStyle} />
                        </a>
                    ))}
                </div>

                {/* Copyright - Right aligned */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '14px', color: '#4b5563', margin: 0 }}>
                            © 2025 YooA. All rights reserved.
                        </p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0 0 0' }}>
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
        </motion.footer>
    );
}
