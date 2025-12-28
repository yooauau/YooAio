"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function YooAModelViewer({ 
    modelPath = "/models/YooAwebb.glb",
    width = "100%", 
    height = "500px",
    autoRotate = true,
    transparent = true,
}) {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const modelRef = useRef(null);
    const frameRef = useRef(null);
    const popupRef = useRef(null);
    const controlsRef = useRef(null);
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());
    const isHoveringPopupRef = useRef(false);
    const glowMaterialRef = useRef(null);
    const tailGlowMaterialRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        scene.background = null;
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
        camera.position.set(10, 8, 15);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 2, 0);
        controls.minDistance = 5;
        controls.maxDistance = 30;
        controls.enablePan = false;
        controlsRef.current = controls;

        // Lights
        scene.add(new THREE.AmbientLight(0xffffff, 1.2));

        const mainLight = new THREE.DirectionalLight(0xffffff, 2);
        mainLight.position.set(10, 20, 10);
        mainLight.castShadow = true;
        scene.add(mainLight);

        const fillLight = new THREE.DirectionalLight(0xffeedd, 0.8);
        fillLight.position.set(-10, 10, -10);
        scene.add(fillLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(0, 10, -15);
        scene.add(backLight);

        // Shadow plane
        const shadowPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(30, 30),
            new THREE.ShadowMaterial({ opacity: 0.15 })
        );
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -0.5;
        shadowPlane.receiveShadow = true;
        scene.add(shadowPlane);

        // ============================================
        // 🎬 YouTube 3D Popup - 말풍선 스타일
        // ============================================
        const createYouTubePopup = () => {
            const popupGroup = new THREE.Group();
            
            const textureLoader = new THREE.TextureLoader();
            const thumbnailUrl = '/thumb.jpg';
            
            textureLoader.load(thumbnailUrl, (texture) => {
                texture.colorSpace = THREE.SRGBColorSpace;
                
                const frameWidth = 2.4;
                const frameHeight = 1.5;
                
                // ============================================
                // ✨ 빛나는 외곽 글로우 (가장 바깥) - 호버 시 더 밝아짐
                // ============================================
                const glowGeometry = new THREE.PlaneGeometry(frameWidth + 0.4, frameHeight + 0.4);
                const glowMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.3,
                    side: THREE.DoubleSide
                });
                const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                glow.position.z = -0.03;
                glow.name = 'glow';
                glowMaterialRef.current = glowMaterial;
                popupGroup.add(glow);
                
                // 추가 글로우 레이어 (더 넓게)
                const outerGlowGeometry = new THREE.PlaneGeometry(frameWidth + 0.7, frameHeight + 0.7);
                const outerGlowMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xff6b9d,
                    transparent: true,
                    opacity: 0,
                    side: THREE.DoubleSide
                });
                const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
                outerGlow.position.z = -0.04;
                outerGlow.name = 'outerGlow';
                popupGroup.add(outerGlow);
                
                // ============================================
                // 🔲 흰색 테두리 프레임
                // ============================================
                const borderGeometry = new THREE.PlaneGeometry(frameWidth + 0.15, frameHeight + 0.15);
                const borderMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xffffff,
                    side: THREE.FrontSide
                });
                const border = new THREE.Mesh(borderGeometry, borderMaterial);
                border.position.z = 0.01;
                border.name = 'border';
                popupGroup.add(border);
                
                // ============================================
                // 🖼️ 썸네일 이미지
                // ============================================
                const screenGeometry = new THREE.PlaneGeometry(frameWidth, frameHeight);
                const screenMaterial = new THREE.MeshBasicMaterial({ 
                    map: texture,
                    side: THREE.FrontSide
                });
                const screen = new THREE.Mesh(screenGeometry, screenMaterial);
                screen.position.z = 0.02;
                popupGroup.add(screen);
                
                // ============================================
                // 💬 말풍선 꼬리 (삼각형)
                // ============================================
                const tailShape = new THREE.Shape();
                tailShape.moveTo(0, 0);
                tailShape.lineTo(-0.25, -0.4);
                tailShape.lineTo(0.25, 0);
                tailShape.lineTo(0, 0);
                
                const tailGeometry = new THREE.ShapeGeometry(tailShape);
                const tailMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xffffff,
                    side: THREE.DoubleSide
                });
                const tail = new THREE.Mesh(tailGeometry, tailMaterial);
                tail.position.set(-0.6, -frameHeight/2 - 0.05, 0.01);
                popupGroup.add(tail);
                
                // 꼬리 글로우
                const tailGlowShape = new THREE.Shape();
                tailGlowShape.moveTo(0, 0.05);
                tailGlowShape.lineTo(-0.35, -0.5);
                tailGlowShape.lineTo(0.35, 0.05);
                tailGlowShape.lineTo(0, 0.05);
                
                const tailGlowGeometry = new THREE.ShapeGeometry(tailGlowShape);
                const tailGlowMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.2,
                    side: THREE.DoubleSide
                });
                const tailGlow = new THREE.Mesh(tailGlowGeometry, tailGlowMaterial);
                tailGlow.position.set(-0.6, -frameHeight/2 - 0.05, -0.01);
                tailGlow.name = 'tailGlow';
                tailGlowMaterialRef.current = tailGlowMaterial;
                popupGroup.add(tailGlow);
                
                // ============================================
                // 👆 클릭 아이콘 (우측 상단)
                // ============================================
                const clickBgGeometry = new THREE.CircleGeometry(0.18, 32);
                const clickBgMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xff6b9d,
                    transparent: true,
                    opacity: 0.95
                });
                const clickBg = new THREE.Mesh(clickBgGeometry, clickBgMaterial);
                clickBg.position.set(frameWidth/2 + 0.05, frameHeight/2 + 0.05, 0.03);
                popupGroup.add(clickBg);
                
                // 손가락 아이콘
                const fingerGeometry = new THREE.PlaneGeometry(0.06, 0.14);
                const fingerMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const finger = new THREE.Mesh(fingerGeometry, fingerMaterial);
                finger.position.set(frameWidth/2 + 0.05, frameHeight/2 + 0.07, 0.04);
                popupGroup.add(finger);
                
                const fingerTipGeometry = new THREE.CircleGeometry(0.03, 16);
                const fingerTip = new THREE.Mesh(fingerTipGeometry, fingerMaterial);
                fingerTip.position.set(frameWidth/2 + 0.05, frameHeight/2 + 0.15, 0.04);
                popupGroup.add(fingerTip);
                
                // 클릭 링 애니메이션
                const ringGeometry = new THREE.RingGeometry(0.2, 0.24, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.6,
                    side: THREE.DoubleSide
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.position.set(frameWidth/2 + 0.05, frameHeight/2 + 0.05, 0.025);
                ring.name = 'clickRing';
                popupGroup.add(ring);
            });
            
            // 팝업 위치 - 오른쪽 모서리 바깥쪽
            popupGroup.position.set(6, 5, 4);
            popupGroup.rotation.y = -Math.PI * 0.15;
            
            popupGroup.name = 'youtubePopup';
            popupGroup.userData = { 
                url: 'https://youtu.be/pVPPeKc-Xjo?si=kTKJmFOU642avGSw',
                isClickable: true
            };
            
            popupRef.current = popupGroup;
            scene.add(popupGroup);
        };

        // Load Model
        const loader = new GLTFLoader();
        loader.load(
            modelPath,
            (gltf) => {
                const model = gltf.scene;
                modelRef.current = model;

                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 6 / maxDim;
                model.scale.setScalar(scale);

                model.position.set(
                    -center.x * scale,
                    -box.min.y * scale,
                    -center.z * scale
                );

                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });

                scene.add(model);
                createYouTubePopup();

                const dist = maxDim * scale * 1.8;
                camera.position.set(dist * 0.8, dist * 0.6, dist);
                controls.target.set(0, size.y * scale * 0.3, 0);
                controls.update();
            },
            undefined,
            (error) => {
                console.error("모델 로드 실패:", error);
            }
        );

        // ============================================
        // 🖱️ 좌우 15% 영역 체크 함수
        // ============================================
        const isInScrollZone = (clientX) => {
            const rect = renderer.domElement.getBoundingClientRect();
            const relativeX = clientX - rect.left;
            const zoneWidth = rect.width * 0.15; // 15%
            return relativeX < zoneWidth || relativeX > rect.width - zoneWidth;
        };

        // 마우스 다운 - 좌우 10% 영역에서는 컨트롤 비활성화
        const handleMouseDown = (event) => {
            if (isInScrollZone(event.clientX)) {
                controls.enabled = false;
            } else {
                controls.enabled = true;
            }
        };

        // 터치 시작 - 좌우 10% 영역에서는 컨트롤 비활성화
        const handleTouchStart = (event) => {
            if (event.touches.length > 0) {
                if (isInScrollZone(event.touches[0].clientX)) {
                    controls.enabled = false;
                } else {
                    controls.enabled = true;
                }
            }
        };

        // 마우스/터치 종료 시 컨트롤 다시 활성화
        const handleMouseUp = () => {
            controls.enabled = true;
        };

        // 클릭 이벤트
        const handleClick = (event) => {
            // 좌우 10% 영역에서는 클릭 무시
            if (isInScrollZone(event.clientX)) return;
            
            const rect = renderer.domElement.getBoundingClientRect();
            mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycasterRef.current.setFromCamera(mouseRef.current, camera);
            
            if (popupRef.current) {
                const intersects = raycasterRef.current.intersectObject(popupRef.current, true);
                if (intersects.length > 0) {
                    window.open('https://youtu.be/pVPPeKc-Xjo?si=kTKJmFOU642avGSw', '_blank');
                }
            }
        };

        // 커서 변경 + 호버 글로우 효과
        const handleMouseMove = (event) => {
            const rect = renderer.domElement.getBoundingClientRect();
            
            // 좌우 10% 영역 표시
            if (isInScrollZone(event.clientX)) {
                renderer.domElement.style.cursor = 'default';
                controls.enabled = false;
            } else {
                controls.enabled = true;
            }
            
            mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycasterRef.current.setFromCamera(mouseRef.current, camera);
            
            if (popupRef.current) {
                const intersects = raycasterRef.current.intersectObject(popupRef.current, true);
                
                if (intersects.length > 0 && !isInScrollZone(event.clientX)) {
                    renderer.domElement.style.cursor = 'pointer';
                    isHoveringPopupRef.current = true;
                } else if (!isInScrollZone(event.clientX)) {
                    renderer.domElement.style.cursor = 'grab';
                    isHoveringPopupRef.current = false;
                }
            }
        };

        renderer.domElement.addEventListener('click', handleClick);
        renderer.domElement.addEventListener('mousemove', handleMouseMove);
        renderer.domElement.addEventListener('mousedown', handleMouseDown);
        renderer.domElement.addEventListener('mouseup', handleMouseUp);
        renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
        renderer.domElement.addEventListener('touchend', handleMouseUp);

        // Animation
        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);

            if (modelRef.current && autoRotate) {
                modelRef.current.rotation.y += 0.003;
            }
            
            if (popupRef.current && modelRef.current && autoRotate) {
                // 말풍선이 방 오른쪽 바깥에서 같이 회전
                popupRef.current.rotation.y = modelRef.current.rotation.y - Math.PI * 0.15 + Math.sin(Date.now() * 0.0005) * 0.05;
            }
            
            if (popupRef.current) {
                // 둥둥 떠다니기
                popupRef.current.position.y = 5 + Math.sin(Date.now() * 0.001) * 0.12;
                
                // 기본 글로우 펄스
                const glow = popupRef.current.getObjectByName('glow');
                const outerGlow = popupRef.current.getObjectByName('outerGlow');
                const tailGlow = popupRef.current.getObjectByName('tailGlow');
                
                const basePulse = (Math.sin(Date.now() * 0.002) + 1) / 2;
                
                // 호버 시 글로우 효과
                if (isHoveringPopupRef.current) {
                    // 호버 시 - 밝게 빛남
                    if (glow) {
                        glow.material.opacity = 0.7 + basePulse * 0.3;
                        glow.material.color.setHex(0xffffff);
                        glow.scale.setScalar(1.1 + basePulse * 0.05);
                    }
                    if (outerGlow) {
                        outerGlow.material.opacity = 0.4 + basePulse * 0.2;
                        outerGlow.scale.setScalar(1.15 + basePulse * 0.05);
                    }
                    if (tailGlow) {
                        tailGlow.material.opacity = 0.5 + basePulse * 0.3;
                    }
                } else {
                    // 기본 상태
                    if (glow) {
                        glow.material.opacity = 0.25 + basePulse * 0.15;
                        glow.scale.setScalar(1 + basePulse * 0.02);
                    }
                    if (outerGlow) {
                        outerGlow.material.opacity = 0;
                    }
                    if (tailGlow) {
                        tailGlow.material.opacity = 0.15 + basePulse * 0.1;
                    }
                }
                
                // 클릭 링 애니메이션
                const ring = popupRef.current.getObjectByName('clickRing');
                if (ring) {
                    const ringPulse = (Math.sin(Date.now() * 0.003) + 1) / 2;
                    ring.scale.setScalar(1 + ringPulse * 0.3);
                    ring.material.opacity = 0.3 + ringPulse * 0.4;
                }
            }

            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resize
        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
        };
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            renderer.domElement.removeEventListener('click', handleClick);
            renderer.domElement.removeEventListener('mousemove', handleMouseMove);
            renderer.domElement.removeEventListener('mousedown', handleMouseDown);
            renderer.domElement.removeEventListener('mouseup', handleMouseUp);
            renderer.domElement.removeEventListener('touchstart', handleTouchStart);
            renderer.domElement.removeEventListener('touchend', handleMouseUp);
            cancelAnimationFrame(frameRef.current);
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, [modelPath, autoRotate]);

    return (
        <div
            ref={containerRef}
            style={{
                width,
                height,
                overflow: "visible",
                position: "relative",
            }}
        >
            {/* 좌우 10% 스크롤 영역 표시 (선택사항 - 디버그용) */}
            {/* <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '10%',
                height: '100%',
                background: 'rgba(255,0,0,0.1)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                right: 0,
                top: 0,
                width: '10%',
                height: '100%',
                background: 'rgba(255,0,0,0.1)',
                pointerEvents: 'none',
            }} /> */}
        </div>
    );
}
