import type React from "react";

export type Vec3 = [number, number, number];

export type CameraPose = {
  position: Vec3;
  target: Vec3;
  fov?: number;
  /** Vecteur "haut" de la caméra (utile pour une vue parfaitement verticale). */
  up?: Vec3;
};

export type Annotation = {
  /** Mot du script qui déclenche l'étiquette (insensible à la casse/accents/ponctuation). */
  word: string;
  /** Si le mot apparaît plusieurs fois : laquelle (1 = première). */
  occurrence?: number;
  label: string;
  /** Point 3D visé par le trait. */
  target: Vec3;
  /** Décalage de l'étiquette par rapport au point, en pixels. */
  offset?: [number, number];
  /** Durée d'affichage en secondes. */
  duration?: number;
};

export type SceneDef = {
  /** Pose de la caméra en fonction du temps (secondes). Doit être déterministe. */
  camera: (t: number) => CameraPose;
  /** Contenu 3D (reçoit le temps en secondes). */
  World: React.FC<{ t: number }>;
  annotations?: Annotation[];
  background?: string;
};

export type Word = { text: string; start: number; end: number };

export type Timing = { words: Word[]; durationInSeconds: number };
