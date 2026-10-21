import React from "react";
import type { SceneDef } from "../../src/types";

const DURATION = 20; // secondes (approx. durée de la voix)

const ease = (x: number) => 0.5 - Math.cos(Math.PI * Math.min(Math.max(x, 0), 1)) / 2;

const World: React.FC<{ t: number }> = ({ t }) => {
  // Rides concentriques qui s'élargissent (déterministe : dépend uniquement de t)
  const ripples = [0, 1.3, 2.6].map((phase) => ((t + phase) % 4) / 4);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 30, 10]} intensity={1.6} />

      {/* Rive / herbe */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#3f7d3a" />
      </mesh>

      {/* Sable autour du lac */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]}>
        <circleGeometry args={[13.5, 64]} />
        <meshStandardMaterial color="#d8c48f" />
      </mesh>

      {/* Plan d'eau */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[12, 64]} />
        <meshStandardMaterial color="#1f6fb2" roughness={0.15} metalness={0.3} />
      </mesh>

      {/* Rides */}
      {ripples.map((p, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[2, 0.02, 1]}>
          <ringGeometry args={[0.5 + p * 5, 0.65 + p * 5, 64]} />
          <meshBasicMaterial color="#cfe8ff" transparent opacity={0.6 * (1 - p)} />
        </mesh>
      ))}

      {/* Quelques rochers / arbres pour sentir la descente */}
      {[
        [-9, 9],
        [10, -8],
        [-14, -6],
        [15, 7],
        [3, 15],
        [-4, -15],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.2, z]}>
          <coneGeometry args={[1.2, 2.6, 8]} />
          <meshStandardMaterial color="#1e4d22" />
        </mesh>
      ))}
    </>
  );
};

export const scene: SceneDef = {
  background: "#8ec9ff",
  World,
  // Vue du dessus, la caméra descend lentement de 45 m à 16 m
  camera: (t) => {
    const k = ease(t / DURATION);
    return {
      position: [0, 45 - 29 * k, 0.001],
      target: [0, 0, 0],
      up: [0, 0, -1],
      fov: 50,
    };
  },
  annotations: [
    {
      word: "surface",
      label: "Surface de l'eau",
      target: [2, 0, 1],
      offset: [-120, -380],
      duration: 4.5,
    },
  ],
};
