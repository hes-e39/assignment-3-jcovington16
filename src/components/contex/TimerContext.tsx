import { createContext, useEffect, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';

const TIMER_CONFIG_KEY = 'workout_timer_config';
const TIMER_STATE_KEY = 'workout_timer_state';

interface Timer {
    id: number;
    type: string;
    duration: number;
    state: 'not running' | 'running' | 'completed';
    config?: {
        rounds?: number;
        workTime?: number;
        restTime?: number;
        timePerRound?: number;
    };
}

interface TimerState {
    timers: Timer[];
    activeTimerIndex: number | null;
    isRunning: boolean;
    totalTime: number;
    currentProgress?: {
        remainingTime: number;
        currentRound?: number;
        isWorkPhase?: boolean;
    };
}

type TimerAction =
    | { type: 'ADD_TIMER'; payload: Timer }
    | { type: 'REMOVE_TIMER'; payload: number }
    | { type: 'START_TIMER'; payload: number }
    | { type: 'COMPLETE_TIMER'; payload: number }
    | { type: 'RESET_WORKOUT' }
    | { type: 'FAST_FORWARD' }
    | { type: 'PAUSE_RESUME_WORKOUT' }
    | { type: 'UPDATE_PROGRESS'; payload: { remainingTime: number; currentRound?: number; isWorkPhase?: boolean } };

interface TimerContextType {
    state: TimerState;
    dispatch: Dispatch<TimerAction>;
}

function saveTimerConfig(timers: Timer[]) {
    localStorage.setItem(TIMER_CONFIG_KEY, JSON.stringify({ timers }));
}

function saveTimerState(state: Pick<TimerState, 'activeTimerIndex' | 'isRunning' | 'currentProgress'>) {
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
}

function loadTimerConfig(): Timer[] {
    const stored = localStorage.getItem(TIMER_CONFIG_KEY);
    return stored ? JSON.parse(stored).timers : [];
}

function loadTimerState(): Partial<TimerState> | null {
    const stored = localStorage.getItem(TIMER_STATE_KEY);
    return stored ? JSON.parse(stored) : null;
}

function getTimerStateInProgression(index: number, activeIndex: number | null, newIndex: number): Timer['state'] {
    if (index === activeIndex) return 'completed';
    if (index === newIndex) return 'running';
    return 'not running';
}

const loadInitialState = (): TimerState => {
    const savedTimers = loadTimerConfig();
    const savedState = loadTimerState();

    const initialState: TimerState = {
        timers: savedTimers,
        activeTimerIndex: savedState?.activeTimerIndex ?? null,
        isRunning: savedState?.isRunning ?? false,
        totalTime: savedTimers.reduce((sum, timer) => sum + timer.duration, 0),
        currentProgress: savedState?.currentProgress,
    };

    // If we have an active timer, make sure its state is correct
    if (initialState.activeTimerIndex !== null) {
        initialState.timers = initialState.timers.map((timer, index) => ({
            ...timer,
            state: index === initialState.activeTimerIndex ? (initialState.isRunning ? 'running' : 'not running') : 'not running',
        }));
    }

    return initialState;
};

function timerReducer(state: TimerState, action: TimerAction): TimerState {
    let newState: TimerState;

    switch (action.type) {
        case 'ADD_TIMER':
            newState = {
                ...state,
                timers: [...state.timers, action.payload],
                totalTime: state.totalTime + action.payload.duration,
            };
            break;

        case 'REMOVE_TIMER':
            newState = {
                ...state,
                timers: state.timers.filter((_, idx) => idx !== action.payload),
                totalTime: state.timers.reduce((sum, timer, idx) => (idx !== action.payload ? sum + timer.duration : sum), 0),
                activeTimerIndex: state.activeTimerIndex === action.payload ? null : state.activeTimerIndex,
                isRunning: state.activeTimerIndex === action.payload ? false : state.isRunning,
            };
            break;

        case 'START_TIMER':
            newState = {
                ...state,
                timers: state.timers.map((timer, idx) => ({
                    ...timer,
                    state: idx === action.payload ? 'running' : timer.state,
                })),
                activeTimerIndex: action.payload,
                isRunning: true,
            };
            break;

        case 'COMPLETE_TIMER': {
            const nextIndex = action.payload + 1 < state.timers.length ? action.payload + 1 : null;
            newState = {
                ...state,
                timers: state.timers.map((timer, idx) => ({
                    ...timer,
                    state: idx === action.payload ? 'completed' : timer.state,
                })),
                activeTimerIndex: nextIndex,
                isRunning: nextIndex !== null,
                currentProgress:
                    nextIndex !== null
                        ? {
                              remainingTime: state.timers[nextIndex].duration,
                              currentRound: 1,
                              isWorkPhase: true,
                          }
                        : undefined,
            };
            break;
        }

        case 'RESET_WORKOUT':
            newState = {
                ...state,
                timers: state.timers.map(timer => ({
                    ...timer,
                    state: 'not running',
                })),
                activeTimerIndex: null,
                isRunning: false,
                currentProgress: undefined,
            };
            // Clear stored state on reset
            localStorage.removeItem(TIMER_STATE_KEY);
            break;

        case 'FAST_FORWARD': {
            if (state.activeTimerIndex === null) return state;
            const newIndex = state.activeTimerIndex + 1;

            newState = {
                ...state,
                activeTimerIndex: newIndex < state.timers.length ? newIndex : null,
                isRunning: newIndex < state.timers.length,
                timers: state.timers.map((timer, idx) => ({
                    ...timer,
                    state: getTimerStateInProgression(idx, state.activeTimerIndex, newIndex),
                })),
                currentProgress:
                    newIndex < state.timers.length
                        ? {
                              remainingTime: state.timers[newIndex].duration,
                              currentRound: 1,
                              isWorkPhase: true,
                          }
                        : undefined,
            };
            break;
        }

        case 'PAUSE_RESUME_WORKOUT': {
            const isRunning = !state.isRunning;
            newState = {
                ...state,
                isRunning,
                timers: state.timers.map((timer, idx) => ({
                    ...timer,
                    state: idx === state.activeTimerIndex ? (isRunning ? 'running' : 'not running') : timer.state,
                })),
            };
            break;
        }

        case 'UPDATE_PROGRESS':
            newState = {
                ...state,
                currentProgress: {
                    ...state.currentProgress,
                    ...action.payload,
                },
            };
            break;

        default:
            return state;
    }

    // Persist state if we have an active timer
    if (newState.activeTimerIndex !== null) {
        saveTimerConfig(newState.timers);
        saveTimerState({
            activeTimerIndex: newState.activeTimerIndex,
            isRunning: newState.isRunning,
            currentProgress: newState.currentProgress,
        });
    }

    return newState;
}

const TimerContext = createContext<TimerContextType>({
    state: loadInitialState(),
    dispatch: () => undefined,
});

export const TimerProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(timerReducer, null, loadInitialState);

    // Set up event listener for page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (state.activeTimerIndex !== null) {
                saveTimerConfig(state.timers);
                saveTimerState({
                    activeTimerIndex: state.activeTimerIndex,
                    isRunning: state.isRunning,
                    currentProgress: state.currentProgress,
                });
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [state]);

    return <TimerContext.Provider value={{ state, dispatch }}>{children}</TimerContext.Provider>;
};

export default TimerContext;
