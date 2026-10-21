import { PerspectiveCamera } from "three";
import type { CameraPose } from "./types";

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
const DEFAULT_FOV = 50;

/** Applique une pose à une caméra three.js (utilisé pour le rendu ET la projection des annotations). */
export const applyPose = (camera: PerspectiveCamera, pose: CameraPose) => {
  camera.fov = pose.fov ?? DEFAULT_FOV;
  camera.aspect = WIDTH / HEIGHT;
  camera.near = 0.1;
  camera.far = 1000;
  camera.up.set(...(pose.up ?? [0, 1, 0]));
  camera.position.set(...pose.position);
  camera.lookAt(...pose.target);
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
};

const projector = new PerspectiveCamera();

/** Position écran (px) d'un point 3D pour une pose donnée. */
export const projectToScreen = (pose: CameraPose, point: [number, number, number]) => {
  applyPose(projector, pose);
  const v = projector.position.clone().set(...point).project(projector);
  return {
    x: ((v.x + 1) / 2) * WIDTH,
    y: ((1 - v.y) / 2) * HEIGHT,
    visible: v.z > -1 && v.z < 1,
  };
};
