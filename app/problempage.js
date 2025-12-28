"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    Play,
    Users,
    Heart,
    MessageCircle,
    TrendingUp,
    Radio,
    ChevronDown,
    X,
} from "lucide-react";
import dynamic from "next/dynamic";
import MagicBento from "../components/MagicBento";
import Footer from "../components/Footer";
// 3D 모델 뷰어 (클라이언트 전용)

// Three.js component - loaded only on client side
const ThreeBackground = dynamic(
    () => import("../components/ThreeBackground"),
    { ssr: false }
);

// 3D Model Viewer - loaded only on client side
const YooAModelViewer = dynamic(
    () => import("../components/YooAModelViewer"),
    { ssr: false }
);
export default function StreamerDashboard() {
    const [isLive, setIsLive] = useState(false);
    const [youtubeVideos, setYoutubeVideos] = useState([]);
    const [youtubeLongform, setYoutubeLongform] = useState([]);
    const [youtubeShorts, setYoutubeShorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [channelStats, setChannelStats] = useState({
        subscribers: "0",
        totalViews: "0",
        videoCount: "0",
        channelName: "YouTube",
        channelThumbnail: "",
    });
    const [expandedPlatform, setExpandedPlatform] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
    const [chatMessages, setChatMessages] = useState([
        { id: 1, user: "팬123", message: "오늘 방송 재밌어요!", time: "10:23" },
        { id: 2, user: "시청자456", message: "ㅋㅋㅋㅋㅋ", time: "10:23" },
        {
            id: 3,
            user: "구독자789",
            message: "오늘도 힐링합니다",
            time: "10:24",
        },
        {
            id: 4,
            user: "팬999",
            message: "다음 컨텐츠 기대돼요!",
            time: "10:24",
        },
    ]);
    // 스크롤 관련 상태
const [scrollProgress, setScrollProgress] = useState(0);
const containerRef = useRef(null);
// 스크롤 이벤트 처리 - 3단계 (YooA World → 대시보드 → YooA's Room)
useEffect(() => {
    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        // 총 3개 화면 (3 * 100vh)
        const totalHeight = windowHeight * 2;
        const progress = Math.min(scrollTop / totalHeight, 1);
        setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);

    const instagramPosts = [
        {
            id: 1,
            image: "/art.jpg",
            likes: 2341,
        },
        {
            id: 2,
            image: "/hanbok.jpg",
            likes: 1892,
        },
        {
            id: 3,
            image: "/hanbokface.jpg",
            likes: 3201,
        },
        {
            id: 4,
            image: "/lotte.jpg",
            likes: 2756,
        },
        {
            id: 5,
            image: "/lottebody.jpg",
            likes: 1654,
        },
        {
            id: 6,
            image: "/lotteeat.jpg",
            likes: 2103,
        },
        {
            id: 7,
            image: "/lotteface.jpg",
            likes: 1823,
        },
        {
            id: 8,
            image: "/okinawa.jpg",
            likes: 2567,
        },
        {
            id: 9,
            image: "/okinawa2.jpg",
            likes: 1945,
        },
        {
            id: 10,
            image: "/park.jpg",
            likes: 2234,
        },
        {
            id: 11,
            image: "/egg.jpg",
            likes: 1678,
        },
        {
            id: 12,
            image: "/egg4.jpg",
            likes: 2089,
        },
    ];

    // 네이버 카페 데이터 상태
    const [cafePosts, setCafePosts] = useState([
        {
            id: 1,
            title: "🎉 12월 이벤트 안내",
            author: "관리자",
            date: "12/23",
            comments: 45,
        },
        {
            id: 2,
            title: "다음주 콘텐츠 투표해주세요!",
            author: "운영진",
            date: "12/22",
            comments: 128,
        },
        {
            id: 3,
            title: "팬아트 공유합니다 💕",
            author: "팬123",
            date: "12/21",
            comments: 67,
        },
        {
            id: 4,
            title: "지난 방송 명장면 모음",
            author: "편집자",
            date: "12/20",
            comments: 89,
        },
        {
            id: 5,
            title: "신규 멤버 환영합니다!",
            author: "관리자",
            date: "12/19",
            comments: 34,
        },
    ]);
    const [cafeLoading, setCafeLoading] = useState(true);

    // 네이버 카페 API 호출
    useEffect(() => {
        const fetchCafePosts = async () => {
            try {
                const response = await fetch('/api/cafe-rss');
                const data = await response.json();
                
                if (data.posts && data.posts.length > 0) {
                    setCafePosts(data.posts);
                }
            } catch (error) {
                console.error('카페 데이터 로드 실패:', error);
                // 에러 시 기존 더미 데이터 유지
            } finally {
                setCafeLoading(false);
            }
        };

        fetchCafePosts();
    }, []);

    // Window dimensions tracking
    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Handle platform expand/collapse
    const handleExpand = (platformId) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setExpandedPlatform(expandedPlatform === platformId ? null : platformId);
        setTimeout(() => setIsAnimating(false), 700);
    };

    // Calculate card positions based on state
    const getCardStyle = (index, platformId) => {
        const gap = 20;
        const headerHeight = 96;  // 상단 여백 (pt-24 = 96px)
        const padding = 16;
        const bottomPadding = 0;  // 하단 여백 없음

        const containerWidth = dimensions.width - padding * 2;
        const containerHeight = dimensions.height - headerHeight - bottomPadding;  // 100vh 기준

        const cardWidth = (containerWidth - gap) / 2;
        const cardHeight = (containerHeight - gap) / 2;

        const isExpanded = expandedPlatform === platformId;
        const hasExpanded = expandedPlatform !== null;

        const platforms = ['youtube', 'instagram', 'chzzk', 'naver'];
        const expandedIndex = platforms.findIndex(p => p === expandedPlatform);
        const isExpandedFromTopRow = expandedIndex < 2;

        if (isExpanded) {
            return {
                top: isExpandedFromTopRow ? 0 : 140,
                left: 0,
                width: containerWidth,
                height: containerHeight - 160,
            };
        }

        if (hasExpanded) {
            const otherPlatforms = platforms.filter(p => p !== expandedPlatform);
            const collapsedIndex = otherPlatforms.findIndex(p => p === platformId);
            const collapsedWidth = (containerWidth - gap * 2) / 3;

            const collapsedTop = isExpandedFromTopRow
                ? containerHeight - 140
                : 0;

            return {
                top: collapsedTop,
                left: collapsedIndex * (collapsedWidth + gap),
                width: collapsedWidth,
                height: 120,
            };
        }

        const col = index % 2;
        const row = Math.floor(index / 2);

        return {
            top: row * (cardHeight + gap),
            left: col * (cardWidth + gap),
            width: cardWidth,
            height: cardHeight,
        };
    };

    // YouTube API 호출
    useEffect(() => {
        const fetchYouTubeData = async () => {
            const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
            const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

            try {
                // 채널 정보 가져오기
                const channelResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`
                );
                const channelData = await channelResponse.json();

                if (channelData.items && channelData.items.length > 0) {
                    const stats = channelData.items[0].statistics;
                    const snippet = channelData.items[0].snippet;
                    setChannelStats({
                        subscribers: formatNumber(stats.subscriberCount),
                        totalViews: formatNumber(stats.viewCount),
                        videoCount: stats.videoCount,
                        channelName: snippet.title,
                        channelThumbnail: snippet.thumbnails.default.url,
                    });
                }

                // 최신 영상 가져오기 (더 많이 가져옴)
                const videosResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=30&type=video`
                );
                const videosData = await videosResponse.json();

                if (videosData.items) {
                    // 영상 상세 정보 가져오기 (조회수, 좋아요, duration)
                    const videoIds = videosData.items
                        .map((item) => item.id.videoId)
                        .join(",");
                    const statsResponse = await fetch(
                        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
                    );
                    const statsData = await statsResponse.json();

                    // duration을 초로 변환하는 함수
                    const parseDuration = (duration) => {
                        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                        if (!match) return 0;
                        const hours = parseInt(match[1] || 0);
                        const minutes = parseInt(match[2] || 0);
                        const seconds = parseInt(match[3] || 0);
                        return hours * 3600 + minutes * 60 + seconds;
                    };

                    const allVideos = videosData.items.map((item, index) => {
                        const statsItem = statsData.items.find(s => s.id === item.id.videoId);
                        const duration = statsItem?.contentDetails?.duration || 'PT0S';
                        const durationSeconds = parseDuration(duration);
                        const isShorts = durationSeconds <= 60 || item.snippet.title.toLowerCase().includes('#shorts');
                        
                        return {
                            id: item.id.videoId,
                            title: item.snippet.title,
                            thumbnail: item.snippet.thumbnails.medium.url,
                            thumbnailHigh: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
                            views: formatNumber(statsItem?.statistics?.viewCount || 0),
                            likes: formatNumber(statsItem?.statistics?.likeCount || 0),
                            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                            isShorts: isShorts,
                            durationSeconds: durationSeconds,
                        };
                    });

                    // 숏츠와 롱폼 분리
                    const shorts = allVideos.filter(v => v.isShorts).slice(0, 8);
                    const longform = allVideos.filter(v => !v.isShorts).slice(0, 12);

                    setYoutubeShorts(shorts);
                    setYoutubeLongform(longform);
                    setYoutubeVideos(allVideos.slice(0, 3)); // 기존 호환용
                }

                setLoading(false);
            } catch (error) {
                console.error("YouTube API 에러:", error);
                setLoading(false);
            }
        };

        fetchYouTubeData();
    }, []);

    // 숫자 포맷팅 (1000 -> 1K)
    const formatNumber = (num) => {
        if (!num) return "0";
        const number = parseInt(num);
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + "M";
        }
        if (number >= 1000) {
            return (number / 1000).toFixed(1) + "K";
        }
        return number.toString();
    };

    // 실시간 채팅 시뮬레이션
    useEffect(() => {
        const mockMessages = [
            "안녕하세요!",
            "오늘 방송 기대됩니다",
            "ㅋㅋㅋㅋ",
            "구독했어요!",
            "다음엔 뭐하나요?",
            "최고예요 👍",
            "재밌어요!!",
            "응원합니다",
        ];

        const interval = setInterval(() => {
            const newMessage = {
                id: Date.now(),
                user: `시청자${Math.floor(Math.random() * 1000)}`,
                message:
                    mockMessages[
                        Math.floor(Math.random() * mockMessages.length)
                    ],
                time: new Date().toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };

            setChatMessages((prev) => [...prev.slice(-20), newMessage]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative"
        >
            {/* ============================================ */}
            {/* 🏠 YooA's Room - Fixed Background */}
            {/* ============================================ */}
            <div 
                className="fixed inset-0"
                style={{
                    background: 'linear-gradient(to bottom right, #fce7f3, #fed7aa, #fbcfe8)',
                    zIndex: 0,
                }}
            >
                <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                        opacity: 1,
                        transform: `scale(${0.95 + scrollProgress * 0.05})`,
                        transition: 'transform 0.1s',
                        pointerEvents: scrollProgress > 0.68 ? 'auto' : 'none',
                    }}
                >
                    <YooAModelViewer 
                        modelPath="/models/YooAwebb.glb"
                        width="100vw" 
                        height="100vh"
                        autoRotate={true}
                        transparent={true}
                    />
                </div>

                {/* YooA's Room 타이틀 - 68% 이후 가운데 아래에서 나타남 */}
                <div 
                    className="absolute bottom-40 left-1/2 z-20"
                    style={{
                        transform: `translateX(-50%) translateY(${scrollProgress > 0.65 ? 0 : 50}px)`,
                        opacity: scrollProgress > 0.65 ? Math.min((scrollProgress - 0.65) * 5, 1) : 0,
                        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                        pointerEvents: scrollProgress > 0.68 ? 'auto' : 'none',
                    }}
                >
                    <motion.div 
                        className="px-4 py-2 rounded-xl"
                        style={{
                            background: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(8px)',
                        }}
                        animate={{
                            y: [0, -3, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-pink-400" viewBox="0 0 24 24" fill="none">
                                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <div className="text-center">
                                <h2 className="text-lg font-semibold text-gray-700 tracking-tight">YooA's Room</h2>
                                <div className="flex items-center justify-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                    </svg>
                                    <p className="text-xs text-gray-500">Drag to explore!</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ============================================ */}
            {/* 🌟 첫 화면 - YooA World 타이틀 */}
            {/* ============================================ */}
            <div 
                className="fixed inset-0 flex items-center justify-center z-20 pointer-events-none"
                style={{
                    opacity: scrollProgress < 0.2 ? 1 - scrollProgress * 5 : 0,
                    transform: `translateY(${-scrollProgress * 150}px) scale(${1 - scrollProgress * 0.3})`,
                    transition: 'opacity 0.15s, transform 0.15s',
                }}
            >
                <div className="text-center">
                    <h1 
                        className="text-7xl md:text-9xl font-bold tracking-tight"
                        style={{
                            background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #ff6b9d 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            textShadow: '0 0 60px rgba(255, 107, 157, 0.3)',
                        }}
                    >
                        YooA World
                    </h1>
                    <div className="mt-6 flex items-center justify-center gap-2 text-xl text-gray-500 font-light">
                        <span>Scroll down to find me!</span>
                        <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* 🎯 Dock 스타일 헤더 - 위에서 내려옴 (MagicBento 스타일) */}
            {/* ============================================ */}
            <motion.div 
                className="fixed z-30"
                style={{
                    left: '50%',
                    x: '-50%',
                    top: '-20px',
                }}
                initial={{ y: -80, opacity: 0 }}
                animate={{
                    y: scrollProgress >= 0.20 && scrollProgress <= 0.65 ? 0 : -80,
                    opacity: scrollProgress >= 0.20 && scrollProgress <= 0.65 
                        ? (scrollProgress < 0.28 
                            ? (scrollProgress - 0.20) / 0.08  // 서서히 나타남
                            : scrollProgress > 0.58 
                                ? 1 - (scrollProgress - 0.58) / 0.07  // 서서히 사라짐
                                : 1)
                        : 0,
                }}
                whileHover={{ 
                    scale: 1.02,
                    y: 5,
                }}
                transition={{ 
                    duration: 0.5, 
                    ease: [0.25, 0.1, 0.25, 1],
                }}
            >
                <div 
                    className="flex items-center gap-4 px-5 py-2 rounded-b-2xl"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 40px -10px rgba(255, 182, 193, 0.3), 0 4px 15px rgba(0, 0, 0, 0.05)',
                        border: '1px solid rgba(255, 182, 193, 0.2)',
                        borderTop: 'none',
                        pointerEvents: scrollProgress >= 0.22 && scrollProgress <= 0.63 ? 'auto' : 'none',
                    }}
                >
                    {/* 프로필 */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-rose-200 shadow-sm">
                            <img
                                src="/profile.jpg"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h1 className="text-base font-semibold text-gray-800 tracking-tight">
                            유아 YooA
                        </h1>
                    </div>

                    {/* 구분선 */}
                    <div className="w-px h-6 bg-gray-200/50" />

                    {/* 통계 */}
                    <div className="flex gap-3 text-xs">
                        <motion.div 
                            className="text-center px-2 py-1 rounded-lg cursor-default"
                            whileHover={{ backgroundColor: 'rgba(255, 182, 193, 0.2)', scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="font-semibold text-gray-800">
                                {channelStats.subscribers}
                            </div>
                            <div className="text-xs text-gray-400">
                                구독자
                            </div>
                        </motion.div>
                        <motion.div 
                            className="text-center px-2 py-1 rounded-lg cursor-default"
                            whileHover={{ backgroundColor: 'rgba(255, 182, 193, 0.2)', scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="font-semibold text-gray-800">
                                {channelStats.totalViews}
                            </div>
                            <div className="text-xs text-gray-400">
                                조회수
                            </div>
                        </motion.div>
                        <motion.div 
                            className="text-center px-2 py-1 rounded-lg cursor-default"
                            whileHover={{ backgroundColor: 'rgba(255, 182, 193, 0.2)', scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="font-semibold text-emerald-500">
                                {channelStats.videoCount}
                            </div>
                            <div className="text-xs text-gray-400">
                                영상
                            </div>
                        </motion.div>
                    </div>

                    {/* 라이브 상태 */}
                    {isLive && (
                        <>
                            <div className="w-px h-6 bg-gray-200/50" />
                            <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-md animate-pulse">
                                <Radio className="w-2.5 h-2.5" />
                                LIVE
                            </div>
                        </>
                    )}
                </div>
            </motion.div>

            {/* ============================================ */}
            {/* 📊 Dashboard Content - ScrollStack 애니메이션 */}
            {/* ============================================ */}
            <div 
                className="fixed inset-0 z-10"
                style={{
                    // 15%~70% 스크롤 구간에서 동작 (YooA World 사라질 때 서서히 올라옴)
                    transform: `translateY(${
                        scrollProgress < 0.15 
                            ? 100  // 15% 미만: 화면 아래 대기
                            : scrollProgress > 0.70 
                                ? -100  // 70% 이상: 화면 위로 완전히 사라짐
                                : scrollProgress < 0.30
                                    ? (1 - (scrollProgress - 0.15) / 0.15) * 100  // 15~30%: 천천히 올라옴 (15% 구간)
                                    : scrollProgress > 0.58
                                        ? -((scrollProgress - 0.58) / 0.12) * 100  // 58~70%: 천천히 올라가며 사라짐
                                        : 0  // 30~58%: 화면에 고정
                    }vh)`,
                    opacity: scrollProgress < 0.15 
                        ? 0 
                        : scrollProgress < 0.28 
                            ? (scrollProgress - 0.15) / 0.13  // 15~28%: 서서히 나타남
                            : scrollProgress > 0.58 
                                ? 1 - (scrollProgress - 0.58) / 0.12  // 58~70%: 서서히 사라짐
                                : 1,
                    pointerEvents: (scrollProgress > 0.25 && scrollProgress < 0.65) ? 'auto' : 'none',
                    transition: 'transform 0.25s ease-out, opacity 0.25s ease-out',
                    transformOrigin: 'top center',
                    willChange: 'transform, opacity',
                }}
            >
                <div 
                    className="overflow-hidden relative z-10"
                    style={{
                        background: 'transparent',
                        height: '100vh',
                    }}
                >
                    <div className="relative px-4 pt-24 pb-0 z-10 h-full">
                        {/* YouTube Section */}
                        <MagicBento
                            className="group"
                            isExpanded={expandedPlatform === 'youtube'}
                            isCollapsed={expandedPlatform && expandedPlatform !== 'youtube'}
                            style={getCardStyle(0, 'youtube')}
                        >
                            {/* Expand/Collapse Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleExpand('youtube');
                                }}
                                className="absolute top-4 right-4 w-10 h-10 cursor-pointer flex items-center justify-center text-rose-400 hover:text-rose-600 transition-all hover:scale-110 z-20"
                            >
                                {expandedPlatform === 'youtube' ? (
                                    <X className="w-6 h-6" />
                                ) : (
                                    <ChevronDown className="w-6 h-6" />
                                )}
                    </button>

                <div className="backdrop-blur-xl rounded-3xl flex flex-col h-full">
                    <a
                        href="https://www.youtube.com/@yooauau_official"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-red-50 to-rose-50 border-b border-gray-200/50 px-5 py-4 flex items-center justify-between hover:from-red-100 hover:to-rose-100 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            {channelStats.channelThumbnail ? (
                                <img 
                                    src={channelStats.channelThumbnail} 
                                    alt={channelStats.channelName}
                                    className="w-11 h-11 rounded-full border-2 border-red-200 shadow-sm"
                                />
                            ) : (
                                <div className="bg-white p-2 rounded-xl shadow-md flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 159 110"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M154 17.5C154 13.4 154 11.4 153.3 9.9C152.6 8.5 151.5 7.4 150.1 6.7C148.6 6 146.6 6 142.5 6H16.5C12.4 6 10.4 6 8.9 6.7C7.5 7.4 6.4 8.5 5.7 9.9C5 11.4 5 13.4 5 17.5V62.5C5 66.6 5 68.6 5.7 70.1C6.4 71.5 7.5 72.6 8.9 73.3C10.4 74 12.4 74 16.5 74H142.5C146.6 74 148.6 74 150.1 73.3C151.5 72.6 152.6 71.5 153.3 70.1C154 68.6 154 66.6 154 62.5V17.5Z"
                                            fill="#FF0000"
                                        />
                                        <path
                                            d="M105 53L65 77V29L105 53Z"
                                            fill="white"
                                        />
                                    </svg>
                                </div>
                            )}
                            <div>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                                        {channelStats.channelName || 'YouTube'}
                                    </h2>
                                    <span className="text-sm text-gray-600 font-medium">구독자 {channelStats.subscribers}명</span>
                                    <div className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded text-xs font-semibold transition-colors shadow-sm">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                        </svg>
                                        구독
                                    </div>
                                </div>
                            </div>
                        </div>
                    </a>

                    <div className="flex-1 overflow-y-auto p-3 rounded-b-3xl">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-gray-400">로딩 중...</div>
                            </div>
                        ) : expandedPlatform === 'youtube' ? (
                            /* 펼쳐진 상태: 왼쪽 롱폼 + 오른쪽 숏츠 (50:50) */
                            <div className="flex gap-3 h-full">
                                {/* 왼쪽: 롱폼 영상 (50%) */}
                                <div className="flex-1 overflow-y-auto pr-2">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2 sticky top-0 bg-white/80 backdrop-blur-sm py-1 z-10">
                                        <Play className="w-4 h-4 text-red-500" />
                                        동영상
                                    </h3>
                                    <div className="space-y-2">
                                        {youtubeLongform.length > 0 ? youtubeLongform.map((video) => (
                                            <a
                                                key={video.id}
                                                href={video.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-white/80 rounded-xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex gap-3 border border-gray-100"
                                            >
                                                <div className="relative w-64 flex-shrink-0">
                                                    <img
                                                        src={video.thumbnailHigh || video.thumbnail}
                                                        alt={video.title}
                                                        className="w-full h-36 object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Play className="w-12 h-12 text-white" fill="white" />
                                                    </div>
                                                </div>
                                                <div className="py-3 pr-3 flex-1 flex flex-col justify-center">
                                                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2 leading-snug mb-2">
                                                        {video.title}
                                                    </h3>
                                                    <div className="flex gap-3 text-xs text-gray-500">
                                                        <span>👁️ {video.views}</span>
                                                        <span>❤️ {video.likes}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        )) : (
                                            <div className="text-gray-400 text-sm">롱폼 영상이 없습니다</div>
                                        )}
                                    </div>
                                </div>

                                {/* 구분선 */}
                                <div className="w-px bg-gray-200/50 flex-shrink-0" />

                                {/* 오른쪽: 숏츠 (50%) */}
                                <div className="flex-1 overflow-y-auto pl-2">
                                    <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2 sticky top-0 bg-white/80 backdrop-blur-sm py-1 z-10">
                                        <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                                        </svg>
                                        Shorts
                                    </h3>
                                    <div className="grid grid-cols-4 gap-2">
                                        {youtubeShorts.length > 0 ? youtubeShorts.map((video) => (
                                            <a
                                                key={video.id}
                                                href={video.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group cursor-pointer"
                                            >
                                                <div className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-all">
                                                    <img
                                                        src={video.thumbnailHigh || video.thumbnail}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Play className="w-8 h-8 text-white" fill="white" />
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                                        <p className="text-white text-xs line-clamp-2 leading-tight font-medium">
                                                            {video.title.replace(/#shorts|#Shorts|#SHORT/gi, '').trim()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        )) : (
                                            <div className="col-span-4 text-gray-400 text-sm">숏츠가 없습니다</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* 접힌 상태: 기존 리스트 형태 */
                            <div className="space-y-3">
                                {(youtubeLongform.length > 0 ? youtubeLongform.slice(0, 3) : youtubeVideos.length > 0 ? youtubeVideos : []).length > 0 ? (
                                    (youtubeLongform.length > 0 ? youtubeLongform.slice(0, 3) : youtubeVideos).map((video) => (
                                        <a
                                            key={video.id}
                                            href={video.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white/80 rounded-2xl overflow-hidden hover:shadow-md transition-all cursor-pointer group flex gap-4 border border-gray-100"
                                        >
                                            <div className="relative w-40 flex-shrink-0">
                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    className="w-full h-24 object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Play className="w-8 h-8 text-white" fill="white" />
                                                </div>
                                            </div>
                                            <div className="py-2 pr-3 flex-1">
                                                <h3 className="font-medium text-gray-800 text-sm mb-1 line-clamp-2 leading-snug">
                                                    {video.title}
                                                </h3>
                                                <div className="flex gap-3 text-xs text-gray-500">
                                                    <span>👁️ {video.views}</span>
                                                    <span>❤️ {video.likes}</span>
                                                </div>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-gray-400">영상을 불러올 수 없습니다</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                </MagicBento>

                {/* Instagram Section */}
                <MagicBento
                    className="group"
                    isExpanded={expandedPlatform === 'instagram'}
                    isCollapsed={expandedPlatform && expandedPlatform !== 'instagram'}
                    style={getCardStyle(1, 'instagram')}
                >
                    {/* Expand/Collapse Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleExpand('instagram');
                        }}
                        className="absolute top-4 right-4 w-10 h-10 cursor-pointer flex items-center justify-center text-rose-400 hover:text-rose-600 transition-all hover:scale-110 z-20"
                    >
                        {expandedPlatform === 'instagram' ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <ChevronDown className="w-6 h-6" />
                        )}
                    </button>

                <div className="backdrop-blur-xl rounded-3xl flex flex-col h-full">
                    <a
                        href="https://www.instagram.com/yooauau/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-pink-50 to-rose-50 border-b border-gray-200/50 px-5 py-4 flex items-center gap-3 hover:from-pink-100 hover:to-rose-100 transition-colors cursor-pointer"
                    >
                        <svg
                            className="w-10 h-10"
                            viewBox="0 0 132 132"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <defs>
                                <linearGradient
                                    id="instagram-gradient"
                                    x1="0%"
                                    y1="100%"
                                    x2="100%"
                                    y2="0%"
                                >
                                    <stop
                                        offset="0%"
                                        style={{
                                            stopColor: "#FED576",
                                            stopOpacity: 1,
                                        }}
                                    />
                                    <stop
                                        offset="25%"
                                        style={{
                                            stopColor: "#F47133",
                                            stopOpacity: 1,
                                        }}
                                    />
                                    <stop
                                        offset="50%"
                                        style={{
                                            stopColor: "#BC3081",
                                            stopOpacity: 1,
                                        }}
                                    />
                                    <stop
                                        offset="100%"
                                        style={{
                                            stopColor: "#4C63D2",
                                            stopOpacity: 1,
                                        }}
                                    />
                                </linearGradient>
                            </defs>
                            <rect
                                width="132"
                                height="132"
                                rx="30"
                                fill="url(#instagram-gradient)"
                            />
                            <circle
                                cx="66"
                                cy="66"
                                r="23"
                                stroke="white"
                                strokeWidth="6"
                                fill="none"
                            />
                            <circle
                                cx="95"
                                cy="37"
                                r="8"
                                fill="white"
                            />
                        </svg>
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                            @yooauau
                        </h2>
                    </a>

                    <div className="flex-1 overflow-y-auto p-6 min-h-0 rounded-b-3xl">
                        <div className="grid grid-cols-3 gap-3">
                            {instagramPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square border border-gray-100 shadow-sm hover:shadow-md transition-all"
                                >
                                    <img
                                        src={post.image}
                                        alt="Instagram post"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                        <div className="text-center text-white">
                                            <Heart
                                                className="w-5 h-5 mx-auto mb-1"
                                                fill="white"
                                            />
                                            <span className="font-medium text-sm">
                                                {post.likes.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </MagicBento>

                {/* CHZZK Section */}
                <MagicBento
                    className="group"
                    isExpanded={expandedPlatform === 'chzzk'}
                    isCollapsed={expandedPlatform && expandedPlatform !== 'chzzk'}
                    style={getCardStyle(2, 'chzzk')}
                >
                    {/* Expand/Collapse Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleExpand('chzzk');
                        }}
                        className="absolute top-4 right-4 w-10 h-10 cursor-pointer flex items-center justify-center text-emerald-400 hover:text-emerald-600 transition-all hover:scale-110 z-20"
                    >
                        {expandedPlatform === 'chzzk' ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <ChevronDown className="w-6 h-6" />
                        )}
                    </button>

                <div className="backdrop-blur-xl rounded-3xl flex flex-col h-full">
                    <a
                        href="https://chzzk.naver.com/0c21abb4cc94b8d1de5b2bdaf9a69aa9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-200/50 px-5 py-4 flex items-center justify-between hover:from-emerald-100 hover:to-teal-100 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <svg
                                className="w-10 h-10"
                                viewBox="0 0 200 200"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <rect
                                    width="200"
                                    height="200"
                                    rx="40"
                                    fill="#00E396"
                                />
                                <path
                                    d="M50 100L80 130L150 70"
                                    stroke="white"
                                    strokeWidth="20"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                />
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="80"
                                    stroke="white"
                                    strokeWidth="12"
                                    fill="none"
                                />
                                </svg>
                            <div className="flex flex-col">
                                <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                                    치지직 - 유아 YooA 채널
                                </h2>
                                <div className="text-sm text-gray-500 font-medium">
                                    {chatMessages.length} 메시지
                                </div>
                            </div>
                        </div>
                    </a>

                    <div className="flex-1 overflow-y-auto p-6 rounded-b-3xl">
                        <div className="space-y-3">
                            {chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className="bg-white/80 rounded-xl p-3.5 hover:bg-white transition-all border border-gray-100"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-sm font-medium text-white flex-shrink-0 shadow-sm">
                                            {msg.user[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm text-gray-800 truncate">
                                                    {msg.user}
                                                </span>
                                                <span className="text-xs text-gray-400 font-light">
                                                    {msg.time}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {msg.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </MagicBento>

                {/* Naver Cafe Section */}
                <MagicBento
                    className="group"
                    isExpanded={expandedPlatform === 'naver'}
                    isCollapsed={expandedPlatform && expandedPlatform !== 'naver'}
                    style={getCardStyle(3, 'naver')}
                >
                    {/* Expand/Collapse Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleExpand('naver');
                        }}
                        className="absolute top-4 right-4 w-10 h-10 cursor-pointer flex items-center justify-center text-emerald-400 hover:text-emerald-600 transition-all hover:scale-110 z-20"
                    >
                        {expandedPlatform === 'naver' ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <ChevronDown className="w-6 h-6" />
                        )}
                    </button>

                <div className="backdrop-blur-xl rounded-3xl flex flex-col h-full">
                    <a
                        href="https://cafe.naver.com/yooauau"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200/50 px-5 py-4 flex items-center gap-3 hover:from-green-100 hover:to-emerald-100 transition-colors cursor-pointer"
                    >
                        <svg
                            className="w-10 h-10"
                            viewBox="0 0 200 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                width="200"
                                height="200"
                                rx="20"
                                fill="#00C73C"
                            />
                            <path
                                d="M60 80C60 70 65 60 75 55C85 50 95 50 105 55C115 60 120 70 120 80V120C120 130 115 140 105 145C95 150 85 150 75 145C65 140 60 130 60 120V80Z"
                                fill="white"
                            />
                            <ellipse
                                cx="90"
                                cy="85"
                                rx="12"
                                ry="18"
                                fill="#00C73C"
                            />
                            <path
                                d="M140 120V160H100V140"
                                stroke="white"
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                        </svg>
                        <h2 className="text-lg font-bold text-gray-800 tracking-tight">
                            네이버카페 - YooA World
                        </h2>
                    </a>

                    <div className="flex-1 overflow-y-auto p-6 rounded-b-3xl">
                        <div className="space-y-3">
                            {cafePosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white/80 rounded-xl p-4 hover:bg-white hover:shadow-md transition-all cursor-pointer border border-gray-100"
                                >
                                    <h3 className="font-medium text-gray-800 mb-2 line-clamp-1 leading-relaxed">
                                        {post.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-sm text-gray-500 font-light">
                                        <div className="flex gap-3">
                                            <span>{post.author}</span>
                                            <span>{post.date}</span>
                                        </div>
                                        <span className="text-blue-500 font-medium">
                                            💬 {post.comments}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </MagicBento>
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* 📜 스크롤 공간 (실제 스크롤을 위한 높이) */}
            {/* ============================================ */}
            <div className="relative z-0 pointer-events-none">
                {/* 첫 번째 화면: YooA World */}
                <div className="h-screen" />
                
                {/* 두 번째 화면: 대시보드 */}
                <div className="h-screen" />
                
                {/* 세 번째 화면: YooA's Room */}
                <div className="h-screen" />
            </div>

            {/* Footer - 맨 아래 */}
            <div 
                className="fixed bottom-0 left-0 right-0 z-30 pointer-events-auto"
                style={{
                    opacity: scrollProgress > 0.75 ? (scrollProgress - 0.75) * 4 : 0,
                    transform: `translateY(${scrollProgress > 0.75 ? 0 : 100}%)`,
                    transition: 'opacity 0.3s, transform 0.3s',
                }}
            >
                <Footer />
            </div>
        </div>
    );
}
