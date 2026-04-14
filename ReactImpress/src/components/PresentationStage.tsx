import type { Presentation } from "../types/presentation";

type PresentationStageProps = {
  presentation: Presentation;
  rootId: string;
};

export const PresentationStage = ({
  presentation,
  rootId,
}: PresentationStageProps) => (
  <div id={rootId}>
    {presentation.slides.map((slide) => (
      <div
        key={slide.id}
        id={slide.id}
        className="step slide"
        data-x={slide.transform.x}
        data-y={slide.transform.y}
        data-z={slide.transform.z}
        data-rotate={slide.transform.rotate}
        data-rotate-x={slide.transform.rotateX}
        data-rotate-y={slide.transform.rotateY}
        data-scale={slide.transform.scale}
        style={{ background: slide.background, color: "#162530", padding: 48 }}
      >
        <div className="stage-slide-inner">
          <p className="stage-kicker">{presentation.title}</p>
          <h2 className="stage-title">{slide.title}</h2>
          <div className="stage-body">{slide.content}</div>
        </div>
      </div>
    ))}
  </div>
);
