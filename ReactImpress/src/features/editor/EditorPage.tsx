import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  downloadPresentationHtml,
  downloadPresentationJson,
} from "../../lib/export/exportPresentation";
import type { Slide, SlideTransform } from "../../types/presentation";
import { usePresentationStore } from "./usePresentationStore";

const CANVAS_SCALE = 0.12;
const CANVAS_WIDTH = 1800;
const CANVAS_HEIGHT = 1000;

type DragState = {
  slideId: string;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
} | null;

const numberFields: Array<keyof SlideTransform> = [
  "x",
  "y",
  "z",
  "rotate",
  "rotateX",
  "rotateY",
  "scale",
];

const parseNumericValue = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const EditorPage = () => {
  const { presentationId } = useParams();
  const navigate = useNavigate();
  const presentations = usePresentationStore((state) => state.presentations);
  const openPresentation = usePresentationStore(
    (state) => state.openPresentation,
  );
  const updatePresentationMeta = usePresentationStore(
    (state) => state.updatePresentationMeta,
  );
  const addSlide = usePresentationStore((state) => state.addSlide);
  const duplicateSlide = usePresentationStore((state) => state.duplicateSlide);
  const deleteSlide = usePresentationStore((state) => state.deleteSlide);
  const reorderSlide = usePresentationStore((state) => state.reorderSlide);
  const selectSlide = usePresentationStore((state) => state.selectSlide);
  const updateSlide = usePresentationStore((state) => state.updateSlide);
  const updateSlideTransform = usePresentationStore(
    (state) => state.updateSlideTransform,
  );
  const publishPresentation = usePresentationStore(
    (state) => state.publishPresentation,
  );
  const selectedSlideId = usePresentationStore(
    (state) => state.selectedSlideId,
  );

  const presentation = useMemo(
    () => presentations.find((entry) => entry.id === presentationId),
    [presentationId, presentations],
  );
  const selectedSlide = presentation?.slides.find(
    (slide) => slide.id === selectedSlideId,
  );
  const [dragState, setDragState] = useState<DragState>(null);
  const [publishLink, setPublishLink] = useState("");

  useEffect(() => {
    if (presentationId) {
      openPresentation(presentationId);
    }
  }, [openPresentation, presentationId]);

  useEffect(() => {
    if (!dragState || !presentation) {
      return undefined;
    }

    const handleMove = (event: MouseEvent) => {
      const deltaX = Math.round(
        (event.clientX - dragState.startClientX) / CANVAS_SCALE,
      );
      const deltaY = Math.round(
        (event.clientY - dragState.startClientY) / CANVAS_SCALE,
      );

      updateSlideTransform(presentation.id, dragState.slideId, {
        x: dragState.startX + deltaX,
        y: dragState.startY + deltaY,
      });
    };

    const handleUp = () => setDragState(null);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragState, presentation, updateSlideTransform]);

  if (!presentation) {
    return (
      <main className="state-screen">
        <h1>Presentation not found</h1>
        <Link className="primary-button" to="/">
          Return home
        </Link>
      </main>
    );
  }

  const handlePublish = () => {
    const shareSlug = publishPresentation(presentation.id);
    setPublishLink(`${window.location.origin}/published/${shareSlug}`);
  };

  return (
    <main className="editor-page">
      <header className="editor-toolbar">
        <div>
          <p className="eyebrow">Editor</p>
          <input
            className="title-input"
            value={presentation.title}
            onChange={(event) =>
              updatePresentationMeta(presentation.id, {
                title: event.target.value,
              })
            }
          />
        </div>

        <div className="toolbar-actions">
          <button
            className="secondary-button"
            onClick={() => addSlide(presentation.id)}
          >
            Add slide
          </button>
          <button
            className="secondary-button"
            onClick={() =>
              selectedSlide && duplicateSlide(presentation.id, selectedSlide.id)
            }
            disabled={!selectedSlide}
          >
            Duplicate slide
          </button>
          <button
            className="ghost-button"
            onClick={() =>
              selectedSlide && deleteSlide(presentation.id, selectedSlide.id)
            }
            disabled={!selectedSlide || presentation.slides.length === 1}
          >
            Delete slide
          </button>
          <button
            className="ghost-button"
            onClick={() => downloadPresentationJson(presentation)}
          >
            Export JSON
          </button>
          <button
            className="secondary-button"
            onClick={() => downloadPresentationHtml(presentation)}
          >
            Export HTML
          </button>
          <button className="primary-button" onClick={handlePublish}>
            Publish
          </button>
          <button
            className="primary-button"
            onClick={() => navigate(`/preview/${presentation.id}`)}
          >
            Preview
          </button>
        </div>
      </header>

      {publishLink ? (
        <div className="publish-banner">Published at {publishLink}</div>
      ) : null}

      <section className="editor-layout">
        <aside className="sidebar-panel">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Slides</p>
              <h2>{presentation.slides.length} items</h2>
            </div>
          </div>

          <div className="slide-list">
            {presentation.slides.map((slide, index) => (
              <button
                key={slide.id}
                className={`slide-list-item ${selectedSlide?.id === slide.id ? "active" : ""}`}
                onClick={() => selectSlide(slide.id)}
              >
                <div className="slide-list-item-top">
                  <strong>{slide.title}</strong>
                  <span>{index + 1}</span>
                </div>
                <p>{slide.content.slice(0, 80) || "Empty slide"}</p>
                <div className="slide-list-actions">
                  <span onClick={(event) => event.stopPropagation()}>
                    <button
                      className="mini-button"
                      onClick={() =>
                        reorderSlide(presentation.id, slide.id, -1)
                      }
                      disabled={index === 0}
                    >
                      Up
                    </button>
                  </span>
                  <span onClick={(event) => event.stopPropagation()}>
                    <button
                      className="mini-button"
                      onClick={() => reorderSlide(presentation.id, slide.id, 1)}
                      disabled={index === presentation.slides.length - 1}
                    >
                      Down
                    </button>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        <section className="canvas-panel">
          <div className="section-heading compact">
            <div>
              <p className="eyebrow">Spatial canvas</p>
              <h2>Drag slides to update impress.js coordinates</h2>
            </div>
            <span className="chip">
              1px = {Math.round(1 / CANVAS_SCALE)} units
            </span>
          </div>

          <div className="canvas-shell">
            <div
              className="canvas-grid"
              style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
            >
              {presentation.slides.map((slide) => {
                const left =
                  CANVAS_WIDTH / 2 + slide.transform.x * CANVAS_SCALE;
                const top =
                  CANVAS_HEIGHT / 2 + slide.transform.y * CANVAS_SCALE;

                return (
                  <div
                    key={slide.id}
                    className={`canvas-slide ${selectedSlide?.id === slide.id ? "selected" : ""}`}
                    style={{
                      left,
                      top,
                      background: slide.background,
                      transform: `translate(-50%, -50%) rotate(${slide.transform.rotate}deg) scale(${slide.transform.scale})`,
                    }}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      selectSlide(slide.id);
                      setDragState({
                        slideId: slide.id,
                        startClientX: event.clientX,
                        startClientY: event.clientY,
                        startX: slide.transform.x,
                        startY: slide.transform.y,
                      });
                    }}
                  >
                    <p className="canvas-slide-kicker">{slide.id.slice(-4)}</p>
                    <h3>{slide.title}</h3>
                    <p>{slide.content.slice(0, 90)}</p>
                    <span className="canvas-slide-coordinates">
                      {slide.transform.x}, {slide.transform.y}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside className="inspector-panel">
          {selectedSlide ? (
            <>
              <div className="section-heading compact">
                <div>
                  <p className="eyebrow">Inspector</p>
                  <h2>{selectedSlide.title}</h2>
                </div>
              </div>

              <label className="field-label">
                Deck author
                <input
                  className="text-input"
                  value={presentation.author}
                  onChange={(event) =>
                    updatePresentationMeta(presentation.id, {
                      author: event.target.value,
                    })
                  }
                />
              </label>

              <label className="field-label">
                Deck description
                <textarea
                  className="text-area"
                  rows={3}
                  value={presentation.description}
                  onChange={(event) =>
                    updatePresentationMeta(presentation.id, {
                      description: event.target.value,
                    })
                  }
                />
              </label>

              <label className="field-label">
                Slide title
                <input
                  className="text-input"
                  value={selectedSlide.title}
                  onChange={(event) =>
                    updateSlide(presentation.id, selectedSlide.id, {
                      title: event.target.value,
                    })
                  }
                />
              </label>

              <label className="field-label">
                Slide content
                <textarea
                  className="text-area"
                  rows={8}
                  value={selectedSlide.content}
                  onChange={(event) =>
                    updateSlide(presentation.id, selectedSlide.id, {
                      content: event.target.value,
                    })
                  }
                />
              </label>

              <label className="field-label">
                Speaker notes
                <textarea
                  className="text-area"
                  rows={4}
                  value={selectedSlide.notes}
                  onChange={(event) =>
                    updateSlide(presentation.id, selectedSlide.id, {
                      notes: event.target.value,
                    })
                  }
                />
              </label>

              <label className="field-label">
                Slide background
                <input
                  className="color-input"
                  type="color"
                  value={selectedSlide.background}
                  onChange={(event) =>
                    updateSlide(presentation.id, selectedSlide.id, {
                      background: event.target.value,
                    })
                  }
                />
              </label>

              <div className="transform-grid">
                {numberFields.map((field) => (
                  <label className="field-label compact" key={field}>
                    {field}
                    <input
                      className="text-input"
                      type="number"
                      step={field === "scale" ? "0.1" : "50"}
                      value={selectedSlide.transform[field]}
                      onChange={(event) =>
                        updateSlideTransform(
                          presentation.id,
                          selectedSlide.id,
                          {
                            [field]: parseNumericValue(
                              event.target.value,
                              selectedSlide.transform[field],
                            ),
                          },
                        )
                      }
                    />
                  </label>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-panel">Select a slide to edit it.</div>
          )}
        </aside>
      </section>
    </main>
  );
};
