import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import impressCss from "../../assets/vendor/impress-demo.css?raw";
import impressSource from "../../assets/vendor/impress.js?raw";
import { PresentationStage } from "../../components/PresentationStage";
import {
  cleanupImpress,
  initImpress,
  type ImpressApi,
} from "../../lib/impress/impress";
import { usePresentationStore } from "../editor/usePresentationStore";

const PREVIEW_ROOT_ID = "impress";

export const PreviewPage = () => {
  const { presentationId } = useParams();
  const impressApiRef = useRef<ImpressApi | null>(null);
  const presentation = usePresentationStore((state) =>
    state.presentations.find((entry) => entry.id === presentationId),
  );

  useEffect(() => {
    if (!presentation) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      impressApiRef.current = initImpress(PREVIEW_ROOT_ID, impressSource) ?? null;
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
        case " ":
        case "PageDown":
          event.preventDefault();
          impressApiRef.current?.next?.();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          event.preventDefault();
          impressApiRef.current?.prev?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      impressApiRef.current = null;
      cleanupImpress();
    };
  }, [presentation]);

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

  return (
    <main className="preview-page">
      <style>{impressCss}</style>
      <header className="preview-toolbar">
        <div>
          <p className="eyebrow">Preview</p>
          <h1>{presentation.title}</h1>
        </div>
        <div className="preview-actions">
          <button
            className="secondary-button"
            onClick={() => impressApiRef.current?.prev?.()}
          >
            Previous
          </button>
          <button
            className="secondary-button"
            onClick={() => impressApiRef.current?.next?.()}
          >
            Next
          </button>
          <Link className="secondary-button" to={`/editor/${presentation.id}`}>
            Back to editor
          </Link>
          <Link className="ghost-button" to="/">
            Home
          </Link>
        </div>
      </header>

      <section className="preview-stage-shell">
        <div className="hint preview-hint">
          <p>Use arrow keys, page keys, or the preview buttons to move through slides.</p>
        </div>
        <PresentationStage
          presentation={presentation}
          rootId={PREVIEW_ROOT_ID}
        />
      </section>
    </main>
  );
};
