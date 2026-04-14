const SCRIPT_ID = 'react-impress-runtime';

export type ImpressApi = {
    init: () => void;
    goto?: (step: string | HTMLElement | number, duration?: number) => void;
    next?: () => void;
    prev?: () => void;
};

const removeImpressClasses = () => {
    document.body.className = document.body.className
        .split(' ')
        .filter((className) => className && !className.startsWith('impress'))
        .join(' ')
        .trim();
};

export const ensureImpressRuntime = (source: string) => {
    if (document.getElementById(SCRIPT_ID) || window.impress) {
        return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.text = source;
    document.body.appendChild(script);
};

export const initImpress = (rootId: string, source: string) => {
    ensureImpressRuntime(source);
    removeImpressClasses();
    document.body.classList.add('impress-not-supported');
    const api = window.impress?.(rootId) as ImpressApi | undefined;
    api?.init();
    return api;
};

export const cleanupImpress = () => {
    removeImpressClasses();
};