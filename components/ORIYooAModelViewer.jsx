"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function YooAModelViewer({ 
    modelPath = "/models/YooAwebb.glb",
    width = "100%", 
    height = "500px",
    autoRotate = true,
    transparent = true,  // 배경 투명 옵션
}) {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const modelRef = useRef(null);
    const frameRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // Scene
        const scene = new THREE.Scene();
        // 배경 투명하게!
        scene.background = null;
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 500);
        camera.position.set(10, 8, 15);

        // Renderer - alpha: true로 투명 배경 지원
        const renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true  // 투명 배경!
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        renderer.setClearColor(0x000000, 0); // 완전 투명
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 2, 0);
        controls.minDistance = 5;
        controls.maxDistance = 30;
        controls.enablePan = false; // 이동 비활성화

        // Lights - 더 밝게!
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

        // 바닥 그림자만 (그리드 제거)
        const shadowPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(30, 30),
            new THREE.ShadowMaterial({ opacity: 0.15 })
        );
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -0.5;
        shadowPlane.receiveShadow = true;
        scene.add(shadowPlane);

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

                // 카메라 위치 조정
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

        // Animation
        const animate = () => {
            frameRef.current = requestAnimationFrame(animate);

            if (modelRef.current && autoRotate) {
                modelRef.current.rotation.y += 0.003;
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
            }}
        />
    );
}
