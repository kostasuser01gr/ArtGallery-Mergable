import React from "react";
import { Composition } from "remotion";
import { defaultAnimationConfig } from "../lib/animation/engine";
import { ConstructionSequence } from "./scenes/ConstructionSequence";
import { ExhibitionLoop } from "./scenes/ExhibitionLoop";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ConstructionSequence"
        component={ConstructionSequence}
        width={1920}
        height={1080}
        fps={defaultAnimationConfig.fps}
        durationInFrames={defaultAnimationConfig.totalFrames}
      />
      <Composition
        id="ExhibitionLoop"
        component={ExhibitionLoop}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={300}
      />
    </>
  );
};
