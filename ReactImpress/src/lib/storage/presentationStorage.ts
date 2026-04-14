import type { WorkspaceSnapshot } from '../../types/presentation';

const STORAGE_KEY = 'react-impress-workspace';

export const loadWorkspaceSnapshot = (): WorkspaceSnapshot | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as WorkspaceSnapshot;
    } catch {
        return null;
    }
};

export const saveWorkspaceSnapshot = (snapshot: WorkspaceSnapshot) => {
    if (typeof window === 'undefined') {
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
};