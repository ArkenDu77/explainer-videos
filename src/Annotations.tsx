import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./font";
import { HEIGHT, WIDTH, projectToScreen } from "./camera";
import { wordMatches } from "./normalize";
import type { Annotation, CameraPose, Word } from "./types";

/** Instant (s) où l'annotation se déclenche, ou null si le mot n'est pas trouvé. */
export const triggerTime = (a: Annotation, words: Word[]) => {
  const matches = words.filter((w) => wordMatches(w.text, a.word));
  const hit = matches[(a.occurrence ?? 1) - 1];
  return hit ? hit.start : null;
};

export const Annotations: React.FC<{
  annotations: Annotation[];
  words: Word[];
  camera: (t: number) => CameraPose;
}> = ({ annotations, words, camera }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const pose = camera(t);

  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
      {annotations.map((a, i) => {
        const start = triggerTime(a, words);
        if (start === null) return null;
        const duration = a.duration ?? 4;
        if (t < start || t > start + duration) return null;

        const local = frame - Math.round(start * fps);
        const appear = spring({ frame: local, fps, config: { damping: 14 } });
        const fadeOut = interpolate(t, [start + duration - 0.4, start + duration], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const p = projectToScreen(pose, a.target);
        if (!p.visible) return null;

        const [dx, dy] = a.offset ?? [-220, -320];
        const lx = p.x + dx * appear;
        const ly = p.y + dy * appear;
        const fontSize = 52;
        const padX = 28;
        const boxW = a.label.length * fontSize * 0.62 + padX * 2;
        const boxH = fontSize + 36;

        return (
          <g key={i} opacity={fadeOut}>
            <line x1={p.x} y1={p.y} x2={lx} y2={ly} stroke="white" strokeWidth={6} strokeLinecap="round" />
            <circle cx={p.x} cy={p.y} r={16 * appear} fill="#FFD400" stroke="black" strokeWidth={4} />
            <g transform={`translate(${lx - boxW / 2}, ${ly - boxH}) scale(1)`} opacity={appear}>
              <rect width={boxW} height={boxH} rx={20} fill="white" stroke="black" strokeWidth={5} />
              <text
                x={boxW / 2}
                y={boxH / 2 + fontSize * 0.35}
                textAnchor="middle"
                fontFamily={fontFamily}
                fontWeight={800}
                fontSize={fontSize}
                fill="black"
              >
                {a.label}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
};
