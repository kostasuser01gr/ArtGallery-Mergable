import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { getTimelineState } from "../../lib/animation/engine";
import manifest from "../../public/assets/manifest.json";

const sourcePath = (file: string) => staticFile(file.startsWith("/") ? file.slice(1) : `assets/${file}`);

export const ConstructionSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const progress = frame / Math.max(1, durationInFrames - 1);
  const timeline = getTimelineState(progress);

  const bloom = interpolate(timeline.bloom, [0, 0.3], [0, 18]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(14,44,63,0.5), transparent 30%), #020307",
      }}
    >
      {manifest.sources.slice(0, 8).map((source, index) => {
        const delay = index * 4;
        const reveal = spring({
          frame: frame - delay,
          fps,
          config: {
            damping: 16,
            stiffness: 70,
            mass: 0.9,
          },
        });

        const scale = interpolate(reveal, [0, 1], [0.82, 1]);
        const opacity = interpolate(reveal, [0, 1], [0, 0.9]);
        const x = Math.sin(index * 1.6 + progress * 6) * 90;
        const y = Math.cos(index * 1.2 + progress * 5) * 50;

        return (
          <AbsoluteFill
            key={source.file}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Img
              src={sourcePath(source.file)}
              style={{
                width: "68%",
                height: "auto",
                transform: `translate(${x}px, ${y}px) scale(${scale})`,
                opacity,
                borderRadius: 28,
                boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              }}
            />
          </AbsoluteFill>
        );
      })}

      <Sequence from={Math.floor(durationInFrames * 0.72)}>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          <Img
            src={sourcePath(manifest.finalComposite)}
            style={{
              width: "74%",
              borderRadius: 30,
              filter: `brightness(${1 + bloom / 90}) saturate(1.08) blur(${bloom / 12}px)`,
              boxShadow: "0 24px 70px rgba(0,0,0,0.5)",
            }}
          />
        </AbsoluteFill>
      </Sequence>

      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
