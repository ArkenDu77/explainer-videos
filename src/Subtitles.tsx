import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { fontFamily } from "./font";
import type { Word } from "./types";

const WORDS_PER_PAGE = 3;
const ACTIVE_COLOR = "#FFD400";

/** Découpe les mots en "pages" de quelques mots ; coupe aussi sur les pauses longues. */
const paginate = (words: Word[]) => {
  const pages: Word[][] = [];
  let current: Word[] = [];
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const pause = prev ? w.start - prev.end > 0.35 : false;
    if (current.length >= WORDS_PER_PAGE || (pause && current.length > 0)) {
      pages.push(current);
      current = [];
    }
    current.push(w);
  });
  if (current.length) pages.push(current);
  return pages;
};

export const Subtitles: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const pages = React.useMemo(() => paginate(words), [words]);

  const page = pages.find((p, i) => {
    const next = pages[i + 1];
    return t >= p[0].start && (!next || t < next[0].start) && t < p[p.length - 1].end + 0.8;
  });
  if (!page) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1250,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 24px",
        fontFamily,
        fontWeight: 900,
        fontSize: 92,
        lineHeight: 1.15,
        textTransform: "uppercase",
        textAlign: "center",
      }}
    >
      {page.map((w, i) => {
        const active = t >= w.start && t < w.end + 0.05;
        return (
          <span
            key={`${w.start}-${i}`}
            style={{
              color: active ? ACTIVE_COLOR : "white",
              transform: active ? "scale(1.08)" : "scale(1)",
              WebkitTextStroke: "10px black",
              paintOrder: "stroke fill",
              textShadow: "0 8px 24px rgba(0,0,0,0.6)",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
