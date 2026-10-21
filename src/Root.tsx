import React from "react";
import { Composition, staticFile } from "remotion";
import { FPS, HEIGHT, WIDTH } from "./camera";
import { makeExplainer, type ExplainerProps } from "./Explainer";
import type { SceneDef, Timing } from "./types";

// Chaque vidéo = videos/<nom>/scene.tsx (export const scene: SceneDef)
const ctx = require.context("../videos", true, /^\.\/[^/]+\/scene\.tsx$/);
const videos = ctx.keys().map((key) => ({
  name: key.split("/")[1],
  scene: (ctx(key) as { scene: SceneDef }).scene,
}));

const loadTiming = async (name: string): Promise<Timing | null> => {
  try {
    const res = await fetch(staticFile(`voice/${name}/timing.json`));
    if (!res.ok) return null;
    return (await res.json()) as Timing;
  } catch {
    return null;
  }
};

export const Root: React.FC = () => (
  <>
    {videos.map(({ name, scene }) => (
      <Composition
        key={name}
        id={name}
        component={makeExplainer(scene)}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={20 * FPS}
        defaultProps={{ name, timing: null }}
        calculateMetadata={async ({ props }) => {
          const timing = await loadTiming(name);
          return {
            props: { ...props, timing },
            durationInFrames: timing ? Math.ceil(timing.durationInSeconds * FPS) : 20 * FPS,
          };
        }}
      />
    ))}
  </>
);
