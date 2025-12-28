"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";

// Animated gradient sphere with depth
function GradientSphere({ position, scale, color1, color2 }) {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.15;
        meshRef.current.rotation.y = time * 0.1;
        meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.3;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <sphereGeometry args={[1, 64, 64]} />
                <MeshDistortMaterial
                    color={color1}
                    attach="material"
                    distort={0.3}
                    speed={1.5}
                    roughness={0}
                    metalness={0.1}
                    transparent
                    opacity={0.4}
                />
            </mesh>
        </Float>
    );
}

// Floating gradient planes for depth
function GradientPlane({ position, rotation, color }) {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.z = rotation[2] + Math.sin(time * 0.3) * 0.1;
        meshRef.current.material.opacity = 0.15 + Math.sin(time * 0.5) * 0.05;
    });

    return (
        <mesh ref={meshRef} position={position} rotation={rotation}>
            <planeGeometry args={[10, 10, 32, 32]} />
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0.15}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}

// Ambient particles with wave motion
function WaveParticles() {
    const particlesRef = useRef();
    const count = 100;

    const positions = useMemo(() => {
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return positions;
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        particlesRef.current.rotation.y = time * 0.03;

        // Wave motion
        const positions = particlesRef.current.geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3 + 1] += Math.sin(time + i) * 0.002;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.08}
                color="#ffb6c1"
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}

export default function ThreeBackground() {
    return (
        <div className="fixed inset-0 -z-10">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 60 }}
                style={{ background: "linear-gradient(to bottom, #fff5f7, #ffe9f0)" }}
            >
                {/* Lighting for depth */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
                <directionalLight position={[-5, -5, -5]} intensity={0.4} color="#ffb6c1" />
                <pointLight position={[0, 0, 3]} intensity={0.5} color="#ffc0cb" />

                {/* Multiple gradient spheres for depth */}
                <GradientSphere position={[-3, 0, -2]} scale={1.5} color1="#ffb6c1" color2="#ffc0cb" />
                <GradientSphere position={[3, 1, -3]} scale={1.2} color1="#ffc0cb" color2="#ffd4e5" />
                <GradientSphere position={[0, -2, -4]} scale={1.8} color1="#ffd4e5" color2="#ffe9f0" />

                {/* Floating gradient planes */}
                <GradientPlane position={[0, 0, -5]} rotation={[0, 0, 0]} color="#ffb6c1" />
                <GradientPlane position={[2, 2, -6]} rotation={[0.5, 0.3, 0]} color="#ffc0cb" />
                <GradientPlane position={[-2, -2, -7]} rotation={[-0.3, 0.5, 0]} color="#ffd4e5" />

                {/* Ambient particles */}
                <WaveParticles />
            </Canvas>
        </div>
    );
}
