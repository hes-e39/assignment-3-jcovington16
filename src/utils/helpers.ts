import type { Dispatch, SetStateAction } from 'react';

export interface Timer {
    id: number;
    type: 'stopwatch' | 'countdown' | 'xy' | 'tabata';
    duration: number;
    state: 'not running' | 'running' | 'completed';
    description?: string;
    config?: {
        rounds?: number;
        workTime?: number;
        restTime?: number;
        timePerRound?: number;
    };
}

interface TimerParams {
    type: string;
    duration?: number;
    rounds?: number;
    workTime?: number;
    restTime?: number;
}

export interface WorkoutControls {
    activeTimerIndex: number | null;
    isWorkoutRunning: boolean;
    timers: Timer[];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    dispatch: (action: any) => void;
    setActiveTimerIndex: (index: number | null) => void;
    setIsWorkoutRunning: (isRunning: boolean) => void;
}

// Time formatting helpers
export const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const formatTotalTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
};

// Timer creation helper
export const createTimer = ({ type, duration = 0, rounds = 1, workTime = 20, restTime = 10 }: TimerParams): Timer => {
    switch (type) {
        case 'countdown':
            return {
                id: Date.now(),
                type: 'countdown',
                duration: Number(duration),
                state: 'not running',
            };

        case 'stopwatch':
            return {
                id: Date.now(),
                type: 'stopwatch',
                duration: 0,
                state: 'not running',
            };

        case 'xy':
            return {
                id: Date.now(),
                type: 'xy',
                duration: duration * rounds,
                state: 'not running',
                config: {
                    rounds,
                    timePerRound: duration,
                },
            };

        case 'tabata':
            return {
                id: Date.now(),
                type: 'tabata',
                duration: rounds * (workTime + restTime),
                state: 'not running',
                config: {
                    rounds,
                    workTime,
                    restTime,
                },
            };

        default:
            throw new Error(`Unsupported timer type: ${type}`);
    }
};

// Workout control helpers
export const workoutControls = {
    startWorkout: ({ isWorkoutRunning, timers, dispatch, setActiveTimerIndex, setIsWorkoutRunning }: WorkoutControls) => {
        if (!isWorkoutRunning && timers.length > 0) {
            setActiveTimerIndex(0);
            setIsWorkoutRunning(true);
            dispatch({ type: 'START_TIMER', payload: 0 });
        } else {
            setIsWorkoutRunning(false);
        }
        dispatch({ type: 'PAUSE_RESUME_WORKOUT' });
    },

    resetWorkout: ({ setActiveTimerIndex, setIsWorkoutRunning, dispatch }: WorkoutControls) => {
        setActiveTimerIndex(null);
        setIsWorkoutRunning(false);
        dispatch({ type: 'RESET_WORKOUT' });
    },

    fastForward: ({ activeTimerIndex, timers, setActiveTimerIndex, setIsWorkoutRunning, dispatch }: WorkoutControls) => {
        if (activeTimerIndex !== null) {
            const nextIndex = activeTimerIndex + 1;
            if (nextIndex < timers.length) {
                setActiveTimerIndex(nextIndex);
                dispatch({ type: 'FAST_FORWARD' });
            } else {
                setActiveTimerIndex(null);
                setIsWorkoutRunning(false);
            }
        }
    },

    removeTimer: ({ index, activeTimerIndex, dispatch, setActiveTimerIndex, setIsWorkoutRunning }: WorkoutControls & { index: number; activeTimerIndex: number | null }) => {
        dispatch({ type: 'REMOVE_TIMER', payload: index });

        if (activeTimerIndex === null || activeTimerIndex === -1) {
            // Handle no active timer case
            return;
        }

        if (index === activeTimerIndex) {
            setActiveTimerIndex(null);
            setIsWorkoutRunning(false);
        } else if (index < activeTimerIndex) {
            // Adjust activeTimerIndex if a preceding timer is removed
            const newActiveTimerIndex = activeTimerIndex - 1;
            setActiveTimerIndex(newActiveTimerIndex);
        }
    },
};

export const addTimer = (
    {
        type,
        duration,
        rounds,
        workTime,
        restTime,
        timePerRound,
    }: {
        type: 'stopwatch' | 'countdown' | 'xy' | 'tabata';
        duration: number;
        rounds?: number;
        workTime?: number;
        restTime?: number;
        timePerRound?: number;
    },
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    dispatch: React.Dispatch<any>,
) => {
    const newTimer: Timer = {
        id: Date.now(), // Ensure unique ID
        type,
        duration,
        state: 'not running',
        config: rounds
            ? {
                  rounds,
                  workTime,
                  restTime,
                  timePerRound,
              }
            : undefined,
    };

    dispatch({ type: 'ADD_TIMER', payload: newTimer });
};

// Local storage helpers
export const toggleTimerActiveState = (remainingTime: number, isActive: boolean, setIsActive: Dispatch<SetStateAction<boolean>>) => {
    if (remainingTime > 0) {
        setIsActive(!isActive);
    }
};

export const TIMER_CONFIG_KEY = 'workout_timer_config';
export const TIMER_STATE_KEY = 'workout_timer_state';

export interface StoredTimerConfig {
    timers: Timer[];
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

export const setupUnloadHandler = (getCurrentConfig: () => StoredTimerConfig, getCurrentState: () => StoredTimerState): void => {
    window.addEventListener('beforeunload', () => {
        if (getCurrentState().isRunning) {
            saveTimerConfig(getCurrentConfig());
            saveTimerState(getCurrentState());
        }
    });
};
