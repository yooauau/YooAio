"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import dynamic from "next/dynamic";
import MagicBento from "../components/MagicBento";
import Footer from "../components/Footer";
import ClickSpark from "../components/ClickSpark";
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
    const [hoveredExpandBtn, setHoveredExpandBtn] = useState(null);
    const [isCheeseHovered, setIsCheeseHovered] = useState(false);
    const [flyingCheeses, setFlyingCheeses] = useState([]);
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
        // 총 3개 화면 - 마지막 화면까지 스크롤 가능하도록 전체 높이 계산
        const maxScroll = windowHeight * 2; // 3개 화면 중 2개 화면 분량 스크롤 (300vh - 100vh viewport)
        const progress = Math.min(scrollTop / maxScroll, 1);
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
        const verticalPadding = 40;  // 상하 여백
        const padding = 16;

        // 컨테이너가 90vw이므로 90% 기준으로 계산
        const containerWidth = (dimensions.width * 0.9) - padding * 2;
        const availableHeight = dimensions.height - verticalPadding * 2;  // 상하 여백 제외

        const cardWidth = (containerWidth - gap) / 2;
        const cardHeight = (availableHeight - gap) / 2;

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
                height: availableHeight - 160,
            };
        }

        if (hasExpanded) {
            const otherPlatforms = platforms.filter(p => p !== expandedPlatform);
            const collapsedIndex = otherPlatforms.findIndex(p => p === platformId);
            const collapsedWidth = (containerWidth - gap * 2) / 3;

            const collapsedTop = isExpandedFromTopRow
                ? availableHeight - 140
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

    // 숫자 포맷팅 (1000 -> 1K) - useEffect 전에 정의
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

    // 더미 유튜브 데이터 (API 실패 시 폴백)
    const dummyYoutubeData = {
        channelStats: {
            subscribers: "12.3K",
            totalViews: "1.2M",
            videoCount: "156",
            channelName: "유아 YooA",
            channelThumbnail: "/profile.jpg",
        },
        longform: [
            { id: "1", title: "일상 브이로그 - 오키나와 여행", thumbnail: "/okinawa.jpg", views: "15.2K", likes: "1.2K", url: "https://www.youtube.com/@yooauau_official", isShorts: false },
            { id: "2", title: "롯데월드 하루 종일 놀기", thumbnail: "/lotte.jpg", views: "23.1K", likes: "2.1K", url: "https://www.youtube.com/@yooauau_official", isShorts: false },
            { id: "3", title: "한복 입고 경복궁 나들이", thumbnail: "/hanbok.jpg", views: "18.7K", likes: "1.8K", url: "https://www.youtube.com/@yooauau_official", isShorts: false },
            { id: "4", title: "공원에서 피크닉", thumbnail: "/park.jpg", views: "12.4K", likes: "980", url: "https://www.youtube.com/@yooauau_official", isShorts: false },
        ],
        shorts: [
            { id: "s1", title: "오늘의 먹방 #shorts", thumbnail: "/lotteeat.jpg", views: "45.2K", likes: "3.2K", url: "https://www.youtube.com/@yooauau_official", isShorts: true },
            { id: "s2", title: "셀카 타임 #shorts", thumbnail: "/lotteface.jpg", views: "38.1K", likes: "2.8K", url: "https://www.youtube.com/@yooauau_official", isShorts: true },
            { id: "s3", title: "오키나와 바다 #shorts", thumbnail: "/okinawa2.jpg", views: "52.3K", likes: "4.1K", url: "https://www.youtube.com/@yooauau_official", isShorts: true },
            { id: "s4", title: "계란 요리 #shorts", thumbnail: "/egg.jpg", views: "28.9K", likes: "2.1K", url: "https://www.youtube.com/@yooauau_official", isShorts: true },
            { id: "s5", title: "한복 셀카 #shorts", thumbnail: "/hanbokface.jpg", views: "61.2K", likes: "5.3K", url: "https://www.youtube.com/@yooauau_official", isShorts: true },
            { id: "s6", title: "아트워크 #shorts", thumbnail: "/art.jpg", views: "33.7K", likes: "2.9K", url: "https://www.youtube.com/@yooauau_official", isShorts: true },
        ]
    };

    // YouTube API 호출
    useEffect(() => {
        const fetchYouTubeData = async () => {
            const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
            const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

            console.log("YouTube API 호출 시작");
            console.log("API_KEY 존재:", !!API_KEY);
            console.log("CHANNEL_ID:", CHANNEL_ID);

            // API 키가 없으면 더미 데이터 사용
            if (!API_KEY || !CHANNEL_ID) {
                console.log("YouTube API 키 없음 - 더미 데이터 사용");
                setChannelStats(dummyYoutubeData.channelStats);
                setYoutubeLongform(dummyYoutubeData.longform);
                setYoutubeShorts(dummyYoutubeData.shorts);
                setYoutubeVideos(dummyYoutubeData.longform.slice(0, 3));
                setLoading(false);
                return;
            }

            try {
                // 채널 정보 가져오기
                console.log("채널 정보 요청 중...");
                const channelResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`
                );
                const channelData = await channelResponse.json();
                console.log("채널 응답:", channelData);

                // API 에러 체크
                if (channelData.error) {
                    console.error("채널 API 에러:", channelData.error);
                    throw new Error(channelData.error.message);
                }

                if (channelData.items && channelData.items.length > 0) {
                    const stats = channelData.items[0].statistics;
                    const snippet = channelData.items[0].snippet;
                    console.log("채널 정보:", snippet.title, "구독자:", stats.subscriberCount);
                    setChannelStats({
                        subscribers: formatNumber(stats.subscriberCount),
                        totalViews: formatNumber(stats.viewCount),
                        videoCount: stats.videoCount,
                        channelName: snippet.title,
                        channelThumbnail: snippet.thumbnails.default.url,
                    });
                }

                // 최신 영상 가져오기
                console.log("영상 목록 요청 중...");
                const videosResponse = await fetch(
                    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=20&type=video`
                );
                const videosData = await videosResponse.json();
                console.log("영상 응답:", videosData);

                // API 에러 체크
                if (videosData.error) {
                    console.error("영상 API 에러:", videosData.error);
                    throw new Error(videosData.error.message);
                }

                if (videosData.items && videosData.items.length > 0) {
                    console.log("영상 개수:", videosData.items.length);

                    // 영상 상세 정보 가져오기 (조회수, 좋아요, duration)
                    const videoIds = videosData.items
                        .map((item) => item.id.videoId)
                        .join(",");

                    console.log("영상 상세 정보 요청 중...");
                    const statsResponse = await fetch(
                        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
                    );
                    const statsData = await statsResponse.json();
                    console.log("영상 상세 응답:", statsData);

                    // duration을 초로 변환하는 함수
                    const parseDuration = (duration) => {
                        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                        if (!match) return 0;
                        const hours = parseInt(match[1] || 0);
                        const minutes = parseInt(match[2] || 0);
                        const seconds = parseInt(match[3] || 0);
                        return hours * 3600 + minutes * 60 + seconds;
                    };

                    const allVideos = videosData.items.map((item) => {
                        const statsItem = statsData.items?.find(s => s.id === item.id.videoId);
                        const duration = statsItem?.contentDetails?.duration || 'PT0S';
                        const durationSeconds = parseDuration(duration);
                        const isShorts = durationSeconds <= 60 || item.snippet.title.toLowerCase().includes('#shorts');

                        return {
                            id: item.id.videoId,
                            title: item.snippet.title,
                            thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
                            thumbnailHigh: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
                            views: formatNumber(statsItem?.statistics?.viewCount || 0),
                            likes: formatNumber(statsItem?.statistics?.likeCount || 0),
                            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                            isShorts: isShorts,
                            durationSeconds: durationSeconds,
                        };
                    });

                    console.log("처리된 영상:", allVideos.length);

                    // 숏츠와 롱폼 분리
                    const shorts = allVideos.filter(v => v.isShorts).slice(0, 8);
                    const longform = allVideos.filter(v => !v.isShorts).slice(0, 8);

                    console.log("롱폼:", longform.length, "숏츠:", shorts.length);

                    setYoutubeShorts(shorts);
                    setYoutubeLongform(longform);
                    setYoutubeVideos(allVideos.slice(0, 3));
                    setLoading(false);
                    console.log("YouTube 데이터 로드 완료!");
                } else {
                    console.log("영상이 없음 - 더미 데이터 사용");
                    throw new Error("No videos found");
                }
            } catch (error) {
                console.error("YouTube API 에러:", error);
                // 에러 발생 시 더미 데이터 사용
                setChannelStats(dummyYoutubeData.channelStats);
                setYoutubeLongform(dummyYoutubeData.longform);
                setYoutubeShorts(dummyYoutubeData.shorts);
                setYoutubeVideos(dummyYoutubeData.longform.slice(0, 3));
                setLoading(false);
            }
        };

        fetchYouTubeData();
    }, []);

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
                    className="absolute bottom-52 left-1/2 z-20"
                    style={{
                        transform: `translateX(-50%) translateY(${scrollProgress > 0.65 ? 0 : 50}px)`,
                        opacity: scrollProgress > 0.65 ? Math.min((scrollProgress - 0.65) * 5, 1) : 0,
                        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
                        pointerEvents: scrollProgress > 0.68 ? 'auto' : 'none',
                    }}
                >
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="px-3 py-1.5 rounded-xl"
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
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="none">
                                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-700 tracking-tight text-center leading-tight">YooA's Room</h2>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <svg className="w-3 h-3 text-pink-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                                        </svg>
                                        <p className="text-xs text-gray-500 leading-tight">Drag to explore!</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3 h-3 text-pink-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                        <p className="text-xs text-gray-500 leading-tight">Scroll to zoom in/out</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* 치즈 모양 버튼 */}
                        <motion.button
                            onMouseEnter={() => setIsCheeseHovered(true)}
                            onMouseLeave={() => setIsCheeseHovered(false)}
                            onClick={() => {
                                // 치즈 이모티콘 8개 생성
                                const newCheeses = Array.from({ length: 8 }, (_, i) => ({
                                    id: Date.now() + i,
                                    x: Math.random() * window.innerWidth,
                                    y: window.innerHeight + 50,
                                    rotation: Math.random() * 360,
                                    scale: 0.8 + Math.random() * 0.6,
                                    delay: i * 0.1,
                                }));
                                setFlyingCheeses(prev => [...prev, ...newCheeses]);
                                // 3초 후 제거
                                setTimeout(() => {
                                    setFlyingCheeses(prev => prev.filter(c => !newCheeses.find(nc => nc.id === c.id)));
                                }, 3000);
                            }}
                            style={{
                                background: isCheeseHovered
                                    ? 'rgba(255, 107, 157, 0.25)'
                                    : 'rgba(255, 255, 255, 0.15)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: '50%',
                                padding: '12px',
                                border: isCheeseHovered
                                    ? '2px solid rgba(255, 107, 157, 0.6)'
                                    : '2px solid rgba(255, 255, 255, 0.3)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background 0.3s ease, border 0.3s ease',
                            }}
                            whileHover={{
                                scale: 1.15,
                                y: -5,
                            }}
                            whileTap={{
                                scale: 0.9,
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
                            {/* 치즈 이모티콘 */}
                            <span style={{ fontSize: '24px', transition: 'transform 0.3s ease' }}>
                                🧀
                            </span>
                        </motion.button>
                    </div>

                    {/* 날아다니는 치즈 이모티콘들 */}
                    {flyingCheeses.map((cheese) => (
                        <motion.div
                            key={cheese.id}
                            initial={{
                                x: cheese.x,
                                y: cheese.y,
                                rotate: cheese.rotation,
                                scale: 0,
                                opacity: 0,
                            }}
                            animate={{
                                y: -100,
                                rotate: cheese.rotation + 360,
                                scale: cheese.scale,
                                opacity: [0, 1, 1, 0],
                            }}
                            transition={{
                                duration: 2.5,
                                delay: cheese.delay,
                                ease: "easeOut",
                            }}
                            style={{
                                position: 'fixed',
                                fontSize: '40px',
                                pointerEvents: 'none',
                                zIndex: 9999,
                            }}
                        >
                            🧀
                        </motion.div>
                    ))}
                </div>

                {/* 좌우 비네팅 그림자 효과 - 65%~100% 구간에서 3D 모델에 집중 (핑크색) */}
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        pointerEvents: 'none',
                        zIndex: 15,
                        opacity: scrollProgress >= 0.65
                            ? Math.min((scrollProgress - 0.65) / 0.08, 1)
                            : 0,
                        background: 'linear-gradient(90deg, rgba(196,69,105,0.5) 0%, rgba(255,107,157,0.3) 12%, transparent 18%, transparent 82%, rgba(255,107,157,0.3) 88%, rgba(196,69,105,0.5) 100%)',
                        transition: 'opacity 0.3s ease-out',
                    }}
                />

                {/* 클릭 스파크 영역 - 스크롤 60%~100%, 좌우 15%~85% */}
                {scrollProgress >= 0.60 && (
                    <ClickSpark
                        sparkColor="#ff6b9d"
                        sparkSize={8}
                        sparkRadius={25}
                        sparkCount={12}
                        duration={500}
                        enabled={true}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: '15%',
                            width: '70%',
                            height: '100%',
                            zIndex: 16,
                            pointerEvents: 'none',
                        }}
                    />
                )}
            </div>

            {/* ============================================ */}
            {/* 🎨 초기화면 왼쪽 상단 비네팅 - 0%~13% */}
            {/* ============================================ */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '50%',
                    height: '50%',
                    pointerEvents: 'none',
                    zIndex: 15,
                    opacity: scrollProgress <= 0.13
                        ? 1 - (scrollProgress / 0.13)
                        : 0,
                    background: 'radial-gradient(ellipse at top left, rgba(196,69,105,0.4) 0%, rgba(255,107,157,0.2) 30%, transparent 70%)',
                    transition: 'opacity 0.3s ease-out',
                }}
            />

            {/* ============================================ */}
            {/* 🌟 첫 화면 - YooA World 타이틀 (정중앙) */}
            {/* ============================================ */}
            <div
                className="fixed z-20 pointer-events-none"
                style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) translateY(${-scrollProgress * 200}px) scale(${1 - scrollProgress * 0.5})`,
                    opacity: scrollProgress < 0.18 ? 1 - scrollProgress * 5.5 : 0,
                    transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <h1
                        style={{
                            fontSize: 'clamp(4rem, 12vw, 10rem)',
                            fontWeight: 'bold',
                            letterSpacing: '-0.02em',
                            background: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #ff6b9d 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            filter: 'drop-shadow(0 0 40px rgba(255, 107, 157, 0.3))',
                            margin: 0,
                            padding: 0,
                            lineHeight: 1.1,
                        }}
                    >
                        YooA World
                    </h1>
                    <div
                        style={{
                            marginTop: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '1.25rem',
                            color: '#9ca3af',
                            fontWeight: 300,
                        }}
                    >
                        <span>Scroll down to find me!</span>
                        <svg
                            style={{ width: '20px', height: '20px' }}
                            className="animate-bounce"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* ============================================ */}
            {/* 🎯 왼쪽 상단 미니 헤더 (MagicBento 스타일) */}
            {/* ============================================ */}
            <motion.div
                className="fixed z-30"
                style={{
                    left: '16px',
                    top: '16px',
                }}
                initial={{ x: -100, opacity: 0 }}
                animate={{
                    x: scrollProgress >= 0.09 && scrollProgress <= 0.65 ? 0 : -100,
                    opacity: scrollProgress >= 0.09 && scrollProgress <= 0.65
                        ? (scrollProgress < 0.17
                            ? (scrollProgress - 0.09) / 0.08
                            : scrollProgress > 0.58
                                ? 1 - (scrollProgress - 0.58) / 0.07
                                : 1)
                        : 0,
                }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
                {/* MagicBento 스타일 글로우 보더 */}
                <div
                    style={{
                        position: 'relative',
                        borderRadius: '9999px',
                        padding: '1px',
                        background: 'linear-gradient(135deg, rgba(255, 180, 180, 0.5), rgba(255, 200, 180, 0.3))',
                    }}
                >
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{
                            background: 'rgba(255, 255, 255, 0.92)',
                            backdropFilter: 'blur(12px)',
                            pointerEvents: scrollProgress >= 0.11 && scrollProgress <= 0.63 ? 'auto' : 'none',
                        }}
                    >
                        {/* 프로필 이미지 */}
                        <div
                            className="flex-shrink-0 rounded-full overflow-hidden"
                            style={{ width: '26px', height: '26px' }}
                        >
                            <img
                                src="/profile.jpg"
                                alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </div>

                        {/* 이름 + 구독자 */}
                        <span className="text-sm text-gray-700 whitespace-nowrap font-medium">
                            유아 <span className="text-gray-400">YooA</span>
                        </span>

                        <span className="text-xs text-gray-400">
                            총 팔로워 39.0k
                        </span>
                    </div>
                </div>
            </motion.div>

            {/* ============================================ */}
            {/* 📊 Dashboard Content - ScrollStack 애니메이션 */}
            {/* ============================================ */}
            <div
                className="fixed"
                style={{
                    top: 0,
                    left: '50%',
                    width: '90vw',
                    height: '100%',
                    zIndex: 10,
                    background: 'linear-gradient(135deg, rgba(255, 245, 245, 0.9) 0%, rgba(255, 228, 215, 0.7) 50%, rgba(255, 240, 245, 0.8) 100%)',
                    borderRadius: '0 0 32px 32px',
                    // 15%~70% 스크롤 구간에서 동작 + 가운데 정렬 (translateX + translateY 합침)
                    transform: `translateX(-50%) translateY(${
                        scrollProgress < 0.15
                            ? 100  // 15% 미만: 화면 아래 대기
                            : scrollProgress > 0.70
                                ? -100  // 70% 이상: 화면 위로 완전히 사라짐
                                : scrollProgress < 0.30
                                    ? (1 - (scrollProgress - 0.15) / 0.15) * 100  // 15~30%: 올라옴
                                    : scrollProgress > 0.58
                                        ? -((scrollProgress - 0.58) / 0.12) * 100  // 58~70%: 위로 사라짐
                                        : 0  // 30~58%: 화면에 고정
                    }vh)`,
                    opacity: scrollProgress < 0.15
                        ? 0
                        : scrollProgress < 0.28
                            ? (scrollProgress - 0.15) / 0.13
                            : scrollProgress > 0.58
                                ? 1 - (scrollProgress - 0.58) / 0.12
                                : 1,
                    pointerEvents: (scrollProgress > 0.25 && scrollProgress < 0.65) ? 'auto' : 'none',
                    transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
                }}
            >
                <div
                    className="h-full"
                    style={{
                        width: '100%',
                        padding: '40px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div className="relative h-full" style={{ width: '100%' }}>
                        {/* YouTube Section */}
                        <MagicBento
                            className="group"
                            isExpanded={expandedPlatform === 'youtube'}
                            isCollapsed={expandedPlatform && expandedPlatform !== 'youtube'}
                            style={getCardStyle(0, 'youtube')}
                        >
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '24px' }}>
                    {/* 헤더 영역 - position: relative로 버튼 배치 */}
                    <div style={{
                        background: 'linear-gradient(135deg, #fff5f5 0%, #ffe4e6 100%)',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        borderRadius: '24px 24px 0 0',
                        position: 'relative',
                    }}>
                        {/* Expand/Collapse Button - 헤더 우측 상단 */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleExpand('youtube');
                            }}
                            onMouseEnter={() => setHoveredExpandBtn('youtube')}
                            onMouseLeave={() => setHoveredExpandBtn(null)}
                            className="cursor-pointer flex items-center justify-center z-20"
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: hoveredExpandBtn === 'youtube' ? '#ff6b9d' : '#9ca3af',
                                transition: 'color 0.2s ease',
                            }}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                style={{
                                    transform: expandedPlatform === 'youtube' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                }}
                            >
                                <path
                                    d="M6 9L12 15L18 9"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <a
                            href="https://www.youtube.com/@yooauau_official"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                textDecoration: 'none',
                                flex: 1,
                            }}
                        >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {channelStats.channelThumbnail ? (
                                <img
                                    src={channelStats.channelThumbnail}
                                    alt={channelStats.channelName}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        border: '2px solid #fecaca',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <div style={{
                                    background: 'white',
                                    padding: '10px',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#FF0000">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                    </svg>
                                </div>
                            )}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                    <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                                        {channelStats.channelName || 'YouTube'}
                                    </h2>
                                    <span style={{ fontSize: '13px', color: '#6b7280' }}>구독자 {channelStats.subscribers}명</span>
                                </div>
                            </div>
                            {/* 구독 버튼 */}
                            <a
                                href="https://www.youtube.com/@yooauau_official?sub_confirmation=1"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    color: 'white',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
                                    boxShadow: '0 2px 8px rgba(255, 100, 100, 0.3)',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                }}
                            >
                                <svg style={{ width: '12px', height: '12px' }} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                                </svg>
                                구독
                            </a>
                        </div>
                    </a>
                    </div>

                    <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px', borderRadius: '0 0 24px 24px' }}>
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <div style={{ color: '#9ca3af' }}>로딩 중...</div>
                            </div>
                        ) : expandedPlatform === 'youtube' ? (
                            /* 펼쳐진 상태: 왼쪽 롱폼 + 오른쪽 숏츠 (50:50) */
                            <div style={{ display: 'flex', gap: '12px', height: '100%' }}>
                                {/* 왼쪽: 롱폼 영상 (50%) */}
                                <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Play style={{ width: '16px', height: '16px', color: '#ef4444' }} />
                                        동영상
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {youtubeLongform.length > 0 ? youtubeLongform.map((video) => (
                                            <a
                                                key={video.id}
                                                href={video.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    background: 'rgba(255,255,255,0.8)',
                                                    borderRadius: '14px',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    gap: '12px',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                    textDecoration: 'none',
                                                    minHeight: '120px',
                                                }}
                                            >
                                                <div style={{ position: 'relative', width: '210px', flexShrink: 0 }}>
                                                    <img
                                                        src={video.thumbnailHigh || video.thumbnail}
                                                        alt={video.title}
                                                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '14px 0 0 14px' }}
                                                    />
                                                </div>
                                                <div style={{ padding: '10px 12px 10px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <h3 style={{ fontWeight: '600', color: '#1f2937', fontSize: '17px', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                        {video.title}
                                                    </h3>
                                                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px', color: '#6b7280' }}>
                                                        <span>👁️ {video.views}</span>
                                                        <span>❤️ {video.likes}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        )) : (
                                            <div style={{ color: '#9ca3af', fontSize: '14px' }}>롱폼 영상이 없습니다</div>
                                        )}
                                    </div>
                                </div>

                                {/* 구분선 */}
                                <div style={{ width: '1px', background: 'rgba(200,200,200,0.3)', flexShrink: 0 }} />

                                {/* 오른쪽: 숏츠 (50%) */}
                                <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingLeft: '8px' }}>
                                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <svg style={{ width: '16px', height: '16px', color: '#ef4444' }} viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                                        </svg>
                                        Shorts
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                        {youtubeShorts.length > 0 ? youtubeShorts.map((video) => (
                                            <a
                                                key={video.id}
                                                href={video.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <div style={{ position: 'relative', aspectRatio: '9/16', borderRadius: '8px', overflow: 'hidden', background: '#f3f4f6' }}>
                                                    <img
                                                        src={video.thumbnailHigh || video.thumbnail}
                                                        alt={video.title}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '8px' }}>
                                                        <p style={{ color: 'white', fontSize: '10px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                            {video.title.replace(/#shorts|#Shorts|#SHORT/gi, '').trim()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </a>
                                        )) : (
                                            <div style={{ gridColumn: 'span 4', color: '#9ca3af', fontSize: '14px' }}>숏츠가 없습니다</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* 접힌 상태: 왼쪽 롱폼 + 오른쪽 숏츠 (50:50) */
                            <div style={{ display: 'flex', gap: '12px', height: '100%' }}>
                                {/* 왼쪽: 롱폼 영상 (50%) */}
                                <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {(youtubeLongform.length > 0 ? youtubeLongform.slice(0, 4) : youtubeVideos.length > 0 ? youtubeVideos.slice(0, 4) : dummyYoutubeData.longform.slice(0, 4)).map((video) => (
                                            <a
                                                key={video.id}
                                                href={video.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    background: 'rgba(255,255,255,0.8)',
                                                    borderRadius: '14px',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    gap: '12px',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                    textDecoration: 'none',
                                                    minHeight: '120px',
                                                }}
                                            >
                                                <div style={{ position: 'relative', width: '210px', flexShrink: 0 }}>
                                                    <img
                                                        src={video.thumbnailHigh || video.thumbnail}
                                                        alt={video.title}
                                                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '14px 0 0 14px' }}
                                                    />
                                                </div>
                                                <div style={{ padding: '10px 12px 10px 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                                    <h3 style={{ fontWeight: '600', color: '#1f2937', fontSize: '17px', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                        {video.title}
                                                    </h3>
                                                    <div style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#6b7280' }}>
                                                        <span>👁️ {video.views}</span>
                                                        <span>❤️ {video.likes}</span>
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                {/* 구분선 */}
                                <div style={{ width: '1px', background: 'rgba(200,200,200,0.3)', flexShrink: 0 }} />

                                {/* 오른쪽: 숏츠 (50%) */}
                                <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', paddingLeft: '8px' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                        {(youtubeShorts.length > 0 ? youtubeShorts.slice(0, 6) : dummyYoutubeData.shorts.slice(0, 6)).map((video) => (
                                            <a
                                                key={video.id}
                                                href={video.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    position: 'relative',
                                                    aspectRatio: '9/16',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <img
                                                    src={video.thumbnailHigh || video.thumbnail}
                                                    alt={video.title}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    left: 0,
                                                    right: 0,
                                                    padding: '6px',
                                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                                }}>
                                                    <p style={{ fontSize: '10px', color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                                                        {video.title}
                                                    </p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
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
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '24px' }}>
                    {/* 헤더 영역 */}
                    <div style={{
                        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        borderRadius: '24px 24px 0 0',
                        position: 'relative',
                    }}>
                        {/* Expand/Collapse Button - 헤더 우측 상단 */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleExpand('instagram');
                            }}
                            onMouseEnter={() => setHoveredExpandBtn('instagram')}
                            onMouseLeave={() => setHoveredExpandBtn(null)}
                            className="cursor-pointer flex items-center justify-center z-20"
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: hoveredExpandBtn === 'instagram' ? '#ff6b9d' : '#9ca3af',
                                transition: 'color 0.2s ease',
                            }}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                style={{
                                    transform: expandedPlatform === 'instagram' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                }}
                            >
                                <path
                                    d="M6 9L12 15L18 9"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <a
                            href="https://www.instagram.com/yooauau/"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                textDecoration: 'none',
                            }}
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="url(#ig-grad)">
                                <defs>
                                    <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#FED576"/>
                                        <stop offset="25%" stopColor="#F47133"/>
                                        <stop offset="50%" stopColor="#BC3081"/>
                                        <stop offset="100%" stopColor="#4C63D2"/>
                                    </linearGradient>
                                </defs>
                                <rect width="24" height="24" rx="6" fill="url(#ig-grad)"/>
                                <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5" fill="none"/>
                                <circle cx="17" cy="7" r="1.5" fill="white"/>
                            </svg>
                            <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                                @yooauau
                            </h2>
                        </a>
                    </div>

                    <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '16px', borderRadius: '0 0 24px 24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {instagramPosts.map((post) => (
                                <div
                                    key={post.id}
                                    style={{
                                        position: 'relative',
                                        aspectRatio: '1',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img
                                        src={post.image}
                                        alt="Instagram post"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
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
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '24px' }}>
                    {/* 헤더 영역 */}
                    <div style={{
                        background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        borderRadius: '24px 24px 0 0',
                        position: 'relative',
                    }}>
                        {/* Expand/Collapse Button - 헤더 우측 상단 */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleExpand('chzzk');
                            }}
                            onMouseEnter={() => setHoveredExpandBtn('chzzk')}
                            onMouseLeave={() => setHoveredExpandBtn(null)}
                            className="cursor-pointer flex items-center justify-center z-20"
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: hoveredExpandBtn === 'chzzk' ? '#ff6b9d' : '#9ca3af',
                                transition: 'color 0.2s ease',
                            }}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                style={{
                                    transform: expandedPlatform === 'chzzk' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                }}
                            >
                                <path
                                    d="M6 9L12 15L18 9"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <a
                            href="https://chzzk.naver.com/0c21abb4cc94b8d1de5b2bdaf9a69aa9"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                textDecoration: 'none',
                            }}
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                <rect width="24" height="24" rx="12" fill="#00E396"/>
                                <path d="M6 12l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                                    치지직
                                </h2>
                                <span style={{ fontSize: '14px', color: '#6b7280' }}>{chatMessages.length} 메시지</span>
                            </div>
                        </a>
                    </div>

                    <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px', borderRadius: '0 0 24px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {chatMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    style={{
                                        background: 'rgba(255,255,255,0.8)',
                                        borderRadius: '12px',
                                        padding: '12px',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #34d399, #14b8a6)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            color: 'white',
                                            flexShrink: 0,
                                        }}>
                                            {msg.user[0]}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <span style={{ fontWeight: '500', fontSize: '13px', color: '#1f2937' }}>{msg.user}</span>
                                                <span style={{ fontSize: '11px', color: '#9ca3af' }}>{msg.time}</span>
                                            </div>
                                            <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>{msg.message}</p>
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
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '24px' }}>
                    {/* 헤더 영역 */}
                    <div style={{
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        borderRadius: '24px 24px 0 0',
                        position: 'relative',
                    }}>
                        {/* Expand/Collapse Button - 헤더 우측 상단 */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleExpand('naver');
                            }}
                            onMouseEnter={() => setHoveredExpandBtn('naver')}
                            onMouseLeave={() => setHoveredExpandBtn(null)}
                            className="cursor-pointer flex items-center justify-center z-20"
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                padding: '8px',
                                background: 'transparent',
                                border: 'none',
                                color: hoveredExpandBtn === 'naver' ? '#ff6b9d' : '#9ca3af',
                                transition: 'color 0.2s ease',
                            }}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                style={{
                                    transform: expandedPlatform === 'naver' ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease',
                                }}
                            >
                                <path
                                    d="M6 9L12 15L18 9"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <a
                            href="https://cafe.naver.com/yooauau"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                textDecoration: 'none',
                            }}
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                <rect width="24" height="24" rx="12" fill="#00C73C"/>
                                <text x="12" y="16" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">N</text>
                            </svg>
                            <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                                네이버 카페
                            </h2>
                        </a>
                    </div>

                    <div className="hide-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px', borderRadius: '0 0 24px 24px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {cafePosts.map((post) => (
                                <div
                                    key={post.id}
                                    style={{
                                        background: 'rgba(255,255,255,0.8)',
                                        borderRadius: '12px',
                                        padding: '14px',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <h3 style={{
                                        fontWeight: '500',
                                        fontSize: '14px',
                                        color: '#1f2937',
                                        margin: '0 0 8px 0',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {post.title}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280' }}>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <span>{post.author}</span>
                                            <span>{post.date}</span>
                                        </div>
                                        <span style={{ color: '#3b82f6', fontWeight: '500' }}>
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

            {/* 스크롤 공간 (실제 스크롤을 위한 높이) */}
            <div style={{ position: 'relative', zIndex: 0, pointerEvents: 'none' }}>
                <div style={{ height: '100vh' }} />
                <div style={{ height: '100vh' }} />
                <div style={{ height: '100vh' }} />
            </div>

            {/* Footer - 스크롤 70% 이후 나타남 */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    opacity: scrollProgress > 0.70 ? Math.min((scrollProgress - 0.70) * 3.33, 1) : 0,
                    transform: `translateY(${scrollProgress > 0.70 ? 0 : 100}%)`,
                    transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
                    pointerEvents: scrollProgress > 0.70 ? 'auto' : 'none',
                }}
            >
                <Footer />
            </div>
        </div>
    );
}
