import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePresentationStore } from "../editor/usePresentationStore";

export const HomePage = () => {
  const navigate = useNavigate();
  const presentations = usePresentationStore((state) => state.presentations);
  const createPresentation = usePresentationStore(
    (state) => state.createPresentation,
  );
  const deletePresentation = usePresentationStore(
    (state) => state.deletePresentation,
  );
  const openPresentation = usePresentationStore(
    (state) => state.openPresentation,
  );
  const [title, setTitle] = useState("Pitch Deck");

  const handleCreate = () => {
    const presentationId = createPresentation(title.trim() || undefined);
    navigate(`/editor/${presentationId}`);
  };

  return (
    <main className="page-shell">
      <section className="hero-panel">
        <p className="eyebrow">ReactImpress</p>
        <h1>
          Build slide decks visually and publish them as impress.js
          presentations.
        </h1>
        <p className="hero-copy">
          This scaffold includes local deck storage, a spatial editor canvas,
          live preview, read-only published routes, and HTML or JSON export.
        </p>
        <div className="hero-actions">
          <input
            className="text-input hero-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="New presentation title"
          />
          <button className="primary-button" onClick={handleCreate}>
            Create deck
          </button>
        </div>
      </section>

      <section className="library-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Workspace</p>
            <h2>Your presentations</h2>
          </div>
          <span className="chip">{presentations.length} decks</span>
        </div>

        <div className="deck-grid">
          {presentations.map((presentation) => (
            <article className="deck-card" key={presentation.id}>
              <div className="deck-card-top">
                <p className="deck-theme">{presentation.theme}</p>
                <span
                  className={`status-pill ${presentation.published ? "published" : ""}`}
                >
                  {presentation.published ? "Published" : "Draft"}
                </span>
              </div>

              <div>
                <h3>{presentation.title}</h3>
                <p>{presentation.description}</p>
              </div>

              <dl className="deck-meta">
                <div>
                  <dt>Slides</dt>
                  <dd>{presentation.slides.length}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{new Date(presentation.updatedAt).toLocaleString()}</dd>
                </div>
              </dl>

              <div className="deck-card-actions">
                <button
                  className="primary-button"
                  onClick={() => {
                    openPresentation(presentation.id);
                    navigate(`/editor/${presentation.id}`);
                  }}
                >
                  Open editor
                </button>
                <button
                  className="secondary-button"
                  onClick={() => navigate(`/preview/${presentation.id}`)}
                >
                  Preview
                </button>
                <button
                  className="ghost-button"
                  onClick={() => deletePresentation(presentation.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
