import { create } from 'zustand';
import {
    createPresentation,
    createShareSlug,
    createSlide,
    type Presentation,
    type Slide,
    type SlideTransform,
} from '../../types/presentation';
import {
    loadWorkspaceSnapshot,
    saveWorkspaceSnapshot,
} from '../../lib/storage/presentationStorage';

type PresentationStore = {
    presentations: Presentation[];
    activePresentationId: string;
    selectedSlideId: string;
    createPresentation: (title?: string) => string;
    deletePresentation: (presentationId: string) => void;
    openPresentation: (presentationId: string) => void;
    updatePresentationMeta: (
        presentationId: string,
        changes: Partial<Pick<Presentation, 'title' | 'author' | 'description' | 'theme'>>,
    ) => void;
    addSlide: (presentationId: string) => void;
    duplicateSlide: (presentationId: string, slideId: string) => void;
    deleteSlide: (presentationId: string, slideId: string) => void;
    reorderSlide: (presentationId: string, slideId: string, direction: -1 | 1) => void;
    selectSlide: (slideId: string) => void;
    updateSlide: (presentationId: string, slideId: string, changes: Partial<Slide>) => void;
    updateSlideTransform: (
        presentationId: string,
        slideId: string,
        changes: Partial<SlideTransform>,
    ) => void;
    publishPresentation: (presentationId: string) => string;
    findPresentationByShareSlug: (shareSlug: string) => Presentation | undefined;
};

const stampPresentation = (presentation: Presentation): Presentation => ({
    ...presentation,
    updatedAt: new Date().toISOString(),
});

const getInitialState = () => {
    const snapshot = loadWorkspaceSnapshot();
    if (snapshot?.presentations.length) {
        const firstPresentation =
            snapshot.presentations.find(
                (presentation) => presentation.id === snapshot.activePresentationId,
            ) ?? snapshot.presentations[0];

        return {
            presentations: snapshot.presentations,
            activePresentationId: firstPresentation.id,
            selectedSlideId: firstPresentation.slides[0]?.id ?? createSlide(0).id,
        };
    }

    const seeded = createPresentation('Product Storyboard');
    return {
        presentations: [seeded],
        activePresentationId: seeded.id,
        selectedSlideId: seeded.slides[0].id,
    };
};

const persistState = (
    presentations: Presentation[],
    activePresentationId: string,
) => {
    saveWorkspaceSnapshot({
        presentations,
        activePresentationId,
    });
};

const patchPresentation = (
    presentations: Presentation[],
    presentationId: string,
    updater: (presentation: Presentation) => Presentation,
) =>
    presentations.map((presentation) =>
        presentation.id === presentationId ? stampPresentation(updater(presentation)) : presentation,
    );

export const usePresentationStore = create<PresentationStore>((set, get) => ({
    ...getInitialState(),

    createPresentation: (title) => {
        const presentation = createPresentation(title);
        set((state) => {
            const presentations = [presentation, ...state.presentations];
            persistState(presentations, presentation.id);
            return {
                presentations,
                activePresentationId: presentation.id,
                selectedSlideId: presentation.slides[0].id,
            };
        });

        return presentation.id;
    },

    deletePresentation: (presentationId) => {
        set((state) => {
            const filtered = state.presentations.filter(
                (presentation) => presentation.id !== presentationId,
            );
            const presentations = filtered.length ? filtered : [createPresentation('Recovered Deck')];
            const activePresentation =
                presentations.find((presentation) => presentation.id === state.activePresentationId) ??
                presentations[0];

            persistState(presentations, activePresentation.id);

            return {
                presentations,
                activePresentationId: activePresentation.id,
                selectedSlideId: activePresentation.slides[0].id,
            };
        });
    },

    openPresentation: (presentationId) => {
        set((state) => {
            const presentation =
                state.presentations.find((entry) => entry.id === presentationId) ?? state.presentations[0];
            persistState(state.presentations, presentation.id);

            return {
                activePresentationId: presentation.id,
                selectedSlideId: presentation.slides[0]?.id ?? state.selectedSlideId,
            };
        });
    },

    updatePresentationMeta: (presentationId, changes) => {
        set((state) => {
            const presentations = patchPresentation(state.presentations, presentationId, (presentation) => ({
                ...presentation,
                ...changes,
            }));
            persistState(presentations, state.activePresentationId);
            return { presentations };
        });
    },

    addSlide: (presentationId) => {
        set((state) => {
            let selectedSlideId = state.selectedSlideId;
            const presentations = patchPresentation(state.presentations, presentationId, (presentation) => {
                const slide = createSlide(presentation.slides.length);
                selectedSlideId = slide.id;
                return {
                    ...presentation,
                    slides: [...presentation.slides, slide],
                };
            });
            persistState(presentations, state.activePresentationId);
            return { presentations, selectedSlideId };
        });
    },

    duplicateSlide: (presentationId, slideId) => {
        set((state) => {
            let selectedSlideId = state.selectedSlideId;
            const presentations = patchPresentation(state.presentations, presentationId, (presentation) => {
                const slideIndex = presentation.slides.findIndex((slide) => slide.id === slideId);
                if (slideIndex < 0) {
                    return presentation;
                }

                const source = presentation.slides[slideIndex];
                const duplicate: Slide = {
                    ...source,
                    id: createSlide(slideIndex + 1).id,
                    title: `${source.title} Copy`,
                    transform: {
                        ...source.transform,
                        x: source.transform.x + 360,
                        y: source.transform.y + 240,
                    },
                };

                selectedSlideId = duplicate.id;

                return {
                    ...presentation,
                    slides: [
                        ...presentation.slides.slice(0, slideIndex + 1),
                        duplicate,
                        ...presentation.slides.slice(slideIndex + 1),
                    ],
                };
            });
            persistState(presentations, state.activePresentationId);
            return { presentations, selectedSlideId };
        });
    },

    deleteSlide: (presentationId, slideId) => {
        set((state) => {
            let selectedSlideId = state.selectedSlideId;
            const presentations = patchPresentation(state.presentations, presentationId, (presentation) => {
                if (presentation.slides.length === 1) {
                    return presentation;
                }

                const slideIndex = presentation.slides.findIndex((slide) => slide.id === slideId);
                const slides = presentation.slides.filter((slide) => slide.id !== slideId);

                if (state.selectedSlideId === slideId) {
                    selectedSlideId = slides[Math.max(0, slideIndex - 1)]?.id ?? slides[0].id;
                }

                return {
                    ...presentation,
                    slides,
                };
            });
            persistState(presentations, state.activePresentationId);
            return { presentations, selectedSlideId };
        });
    },

    reorderSlide: (presentationId, slideId, direction) => {
        set((state) => {
            const presentations = patchPresentation(state.presentations, presentationId, (presentation) => {
                const slideIndex = presentation.slides.findIndex((slide) => slide.id === slideId);
                const targetIndex = slideIndex + direction;

                if (
                    slideIndex < 0 ||
                    targetIndex < 0 ||
                    targetIndex >= presentation.slides.length
                ) {
                    return presentation;
                }

                const slides = [...presentation.slides];
                const [slide] = slides.splice(slideIndex, 1);
                slides.splice(targetIndex, 0, slide);

                return {
                    ...presentation,
                    slides,
                };
            });
            persistState(presentations, state.activePresentationId);
            return { presentations };
        });
    },

    selectSlide: (slideId) => {
        set({ selectedSlideId: slideId });
    },

    updateSlide: (presentationId, slideId, changes) => {
        set((state) => {
            const presentations = patchPresentation(state.presentations, presentationId, (presentation) => ({
                ...presentation,
                slides: presentation.slides.map((slide) =>
                    slide.id === slideId ? { ...slide, ...changes } : slide,
                ),
            }));
            persistState(presentations, state.activePresentationId);
            return { presentations };
        });
    },

    updateSlideTransform: (presentationId, slideId, changes) => {
        set((state) => {
            const presentations = patchPresentation(state.presentations, presentationId, (presentation) => ({
                ...presentation,
                slides: presentation.slides.map((slide) =>
                    slide.id === slideId
                        ? {
                            ...slide,
                            transform: {
                                ...slide.transform,
                                ...changes,
                            },
                        }
                        : slide,
                ),
            }));
            persistState(presentations, state.activePresentationId);
            return { presentations };
        });
    },

    publishPresentation: (presentationId) => {
        let shareSlug = '';
        set((state) => {
            const presentations = patchPresentation(state.presentations, presentationId, (presentation) => {
                shareSlug = presentation.shareSlug ?? createShareSlug(presentation.title);
                return {
                    ...presentation,
                    published: true,
                    shareSlug,
                };
            });
            persistState(presentations, state.activePresentationId);
            return { presentations };
        });

        return shareSlug;
    },

    findPresentationByShareSlug: (shareSlug) =>
        get().presentations.find((presentation) => presentation.shareSlug === shareSlug),
}));