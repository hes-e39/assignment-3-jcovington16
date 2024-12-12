// Add helpers here. This is usually code that is just JS and not React code. Example: write a function that
// calculates number of minutes when passed in seconds. Things of this nature that you don't want to copy/paste
// everywhere.

import type { Dispatch, SetStateAction } from 'react';

// Format time to HH:MM:SS
export const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const toggleTimerActiveState = (remainingTime: number, isActive: boolean, setIsActive: Dispatch<SetStateAction<boolean>>) => {
    if (remainingTime > 0) {
        setIsActive(!isActive);
    }
};

// storage-helpers.ts
const TIMER_CONFIG_KEY = 'workout_timer_config';
const TIMER_STATE_KEY = 'workout_timer_state';

export interface StoredTimerConfig {
    timers: Array<{
        id: number;
        type: string;
        duration: number;
        config?: {
            rounds?: number;
            workTime?: number;
            restTime?: number;
            timePerRound?: number;
        };
    }>;
}

export interface StoredTimerState {
    activeTimerIndex: number | null;
    isRunning: boolean;
    currentProgress: {
        remainingTime: number;
        currentRound?: number;
        isWorkPhase?: boolean;
    };
}

export const saveTimerConfig = (config: StoredTimerConfig): void => {
    localStorage.setItem(TIMER_CONFIG_KEY, JSON.stringify(config));
};

export const loadTimerConfig = (): StoredTimerConfig | null => {
    const stored = localStorage.getItem(TIMER_CONFIG_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const saveTimerState = (state: StoredTimerState): void => {
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
};

export const loadTimerState = (): StoredTimerState | null => {
    const stored = localStorage.getItem(TIMER_STATE_KEY);
    return stored ? JSON.parse(stored) : null;
};

export const clearStoredState = (): void => {
    localStorage.removeItem(TIMER_CONFIG_KEY);
    localStorage.removeItem(TIMER_STATE_KEY);
};

// Helper to handle page unload
export const setupUnloadHandler = (getCurrentConfig: () => StoredTimerConfig, getCurrentState: () => StoredTimerState): void => {
    window.addEventListener('beforeunload', () => {
        if (getCurrentState().isRunning) {
            saveTimerConfig(getCurrentConfig());
            saveTimerState(getCurrentState());
        }
    });
};
