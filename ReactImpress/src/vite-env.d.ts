/// <reference types="vite/client" />

declare global {
    interface Window {
        impress?: (rootId?: string) => {
            init: () => void;
            goto?: (step: string | HTMLElement | number) => void;
            next?: () => void;
            prev?: () => void;
        };
    }
}

export { };