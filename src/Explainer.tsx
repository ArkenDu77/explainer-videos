import React, { useLayoutEffect } from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";
import { HEIGHT, WIDTH, applyPose } from "./camera";
import { Subtitles } from "./Subtitles";
import { Annotations } from "./Annotations";
import type { CameraPose, SceneDef, Timing } from "./types";

export type ExplainerProps = {
  name: string;
  timing: Timing | null;
};

const CameraRig: React.FC<{ pose: CameraPose }> = ({ pose }) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  useLayoutEffect(() => {
    applyPose(camera, pose);
  }, [camera, pose]);
  return null;
};

export const makeExplainer = (scene: SceneDef): React.FC<ExplainerProps> => {
  const Explainer: React.FC<ExplainerProps> = ({ name, timing }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const t = frame / fps;
    const pose = scene.camera(t);
    const words = timing?.words ?? [];
    const { World } = scene;

    return (
      <AbsoluteFill style={{ backgroundColor: scene.background ?? "#0b1e2d" }}>
        <ThreeCanvas width={WIDTH} height={HEIGHT}>
          <CameraRig pose={pose} />
          <World t={t} />
        </ThreeCanvas>
        <Annotations annotations={scene.annotations ?? []} words={words} camera={scene.camera} />
        <Subtitles words={words} />
        {timing ? <Audio src={staticFile(`voice/${name}/voice.mp3`)} /> : null}
      </AbsoluteFill>
    );
  };
  return Explainer;
};
