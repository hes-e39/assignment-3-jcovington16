import { createContext, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';

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
}

type TimerAction =
    | { type: 'ADD_TIMER'; payload: Timer }
    | { type: 'REMOVE_TIMER'; payload: number }
    | { type: 'START_TIMER'; payload: number }
    | { type: 'COMPLETE_TIMER'; payload: number }
    | { type: 'RESET_WORKOUT' }
    | { type: 'FAST_FORWARD' }
    | { type: 'PAUSE_RESUME_WORKOUT' }
    | { type: 'UPDATE_TOTAL_TIME' };

interface TimerContextType {
    state: TimerState;
    dispatch: Dispatch<TimerAction>;
}

const initialState: TimerState = {
    timers: [],
    activeTimerIndex: null,
    isRunning: false,
    totalTime: 0,
};

function getTimerStateInProgression(index: number, activeIndex: number | null, newIndex: number): Timer['state'] {
    if (index === activeIndex) return 'completed';
    if (index === newIndex) return 'running';
    return 'not running';
}

function timerReducer(state: TimerState, action: TimerAction): TimerState {
    switch (action.type) {
        case 'ADD_TIMER':
            return {
                ...state,
                timers: [...state.timers, action.payload],
                totalTime: state.totalTime + action.payload.duration,
            };

        case 'REMOVE_TIMER':
            return {
                ...state,
                timers: state.timers.filter((_, idx) => idx !== action.payload),
                totalTime: state.timers.reduce((sum, timer, idx) => (idx !== action.payload ? sum + timer.duration : sum), 0),
            };

        case 'START_TIMER':
            return {
                ...state,
                timers: state.timers.map((timer, idx) => ({
                    ...timer,
                    state: idx === action.payload ? 'running' : timer.state,
                })),
                activeTimerIndex: action.payload,
                isRunning: true,
            };

        case 'COMPLETE_TIMER': {
            const nextIndex = action.payload + 1 < state.timers.length ? action.payload + 1 : null;
            return {
                ...state,
                timers: state.timers.map((timer, idx) => ({
                    ...timer,
                    state: idx === action.payload ? 'completed' : timer.state,
                })),
                activeTimerIndex: nextIndex,
                isRunning: nextIndex !== null,
            };
        }

        case 'RESET_WORKOUT':
            return {
                ...state,
                timers: state.timers.map(timer => ({
                    ...timer,
                    state: 'not running',
                })),
                activeTimerIndex: null,
                isRunning: false,
            };

        case 'FAST_FORWARD': {
            if (state.activeTimerIndex === null) return state;
            const newIndex = state.activeTimerIndex + 1;

            return {
                ...state,
                activeTimerIndex: newIndex < state.timers.length ? newIndex : null,
                isRunning: newIndex < state.timers.length,
                timers: state.timers.map((timer, idx) => ({
                    ...timer,
                    state: getTimerStateInProgression(idx, state.activeTimerIndex, newIndex),
                })),
            };
        }

        case 'PAUSE_RESUME_WORKOUT': {
            const isRunning = !state.isRunning;
            return {
                ...state,
                isRunning,
                timers: state.timers.map((timer, idx) => ({
                    ...timer,
                    state: idx === state.activeTimerIndex ? (isRunning ? 'running' : 'not running') : timer.state,
                })),
            };
        }

        default:
            return state;
    }
}

const TimerContext = createContext<TimerContextType>({
    state: initialState,
    dispatch: () => undefined,
});

export const TimerProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(timerReducer, initialState);

    return <TimerContext.Provider value={{ state, dispatch }}>{children}</TimerContext.Provider>;
};

export default TimerContext;
