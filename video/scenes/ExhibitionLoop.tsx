import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import manifest from "../../public/assets/manifest.json";

const sourcePath = (file: string) => staticFile(file.startsWith("/") ? file.slice(1) : `assets/${file}`);

export const ExhibitionLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const pulse = interpolate(frame % durationInFrames, [0, durationInFrames], [1.02, 1.08]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        background:
          "conic-gradient(from 80deg at 50% 50%, #020307, #0d2330, #132f3b, #020307)",
      }}
    >
      <Img
        src={sourcePath(manifest.finalComposite)}
        style={{
          width: "82%",
          borderRadius: 32,
          transform: `scale(${pulse})`,
          boxShadow: "0 25px 80px rgba(0,0,0,0.55)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(circle at center, transparent 52%, rgba(0,0,0,0.58) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
