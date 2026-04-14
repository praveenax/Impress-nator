export type SlideTransform = {
    x: number;
    y: number;
    z: number;
    rotate: number;
    rotateX: number;
    rotateY: number;
    scale: number;
};

export type Slide = {
    id: string;
    title: string;
    content: string;
    notes: string;
    background: string;
    transform: SlideTransform;
};

export type Presentation = {
    id: string;
    title: string;
    author: string;
    description: string;
    theme: string;
    slides: Slide[];
    createdAt: string;
    updatedAt: string;
    published: boolean;
    shareSlug?: string;
};

export type WorkspaceSnapshot = {
    presentations: Presentation[];
    activePresentationId?: string;
};

const createId = (prefix: string) =>
    `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

export const createShareSlug = (title: string) => {
    const slugBase = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    return `${slugBase || 'presentation'}-${Math.random().toString(36).slice(2, 8)}`;
};

export const createSlide = (index: number): Slide => ({
    id: createId('slide'),
    title: index === 0 ? 'Welcome' : `Slide ${index + 1}`,
    content:
        index === 0
            ? 'Start editing this deck from the inspector panel and drag slides on the canvas.'
            : 'Add your talking points here.',
    notes: '',
    background: index % 2 === 0 ? '#fff9ef' : '#f3fbff',
    transform: {
        x: 1000 + index * 1200,
        y: index % 2 === 0 ? 1000 : 1800,
        z: 0,
        rotate: index % 2 === 0 ? 0 : 12,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
    },
});

export const createPresentation = (title = 'Untitled Deck'): Presentation => {
    const now = new Date().toISOString();

    return {
        id: createId('presentation'),
        title,
        author: 'Admin',
        description: 'A new ReactImpress deck.',
        theme: 'sunrise-grid',
        slides: [createSlide(0), createSlide(1)],
        createdAt: now,
        updatedAt: now,
        published: false,
    };
};