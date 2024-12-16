import { createContext, useEffect, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { Timer } from '../../utils/helpers';

const TIMER_STATE_KEY = 'workout_timer_state';
const TIMERS_KEY = 'workout_timers';
const WRITE_DELAY = 1000; // 1 second delay for localStorage writes
const WORKOUT_HISTORY_KEY = 'workout_history';

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
    workoutHistory: WorkoutHistory[];
}

interface WorkoutHistory {
    id: number;
    date: string;
    timers: Timer[];
    totalTime: number;
    completed: boolean;
}

interface TimerContextType {
    state: TimerState;
    dispatch: Dispatch<TimerAction>;
}

type TimerAction =
    | { type: 'ADD_TIMER'; payload: Timer }
    | { type: 'REMOVE_TIMER'; payload: number }
    | { type: 'EDIT_TIMER'; payload: { index: number; timer: Timer } }
    | { type: 'START_TIMER'; payload: number }
    | { type: 'COMPLETE_TIMER'; payload: number }
    | { type: 'RESET_WORKOUT' }
    | { type: 'FAST_FORWARD' }
    | { type: 'PAUSE_RESUME_WORKOUT' }
    | { type: 'UPDATE_PROGRESS'; payload: { remainingTime: number; currentRound?: number; isWorkPhase?: boolean } }
    | { type: 'LOAD_TIMERS'; payload: Timer[] }
    | { type: 'REORDER_TIMERS'; payload: { timers: Timer[]; newActiveIndex: number | null } }
    | { type: 'COMPLETE_WORKOUT' }
    | { type: 'LOAD_WORKOUT_HISTORY'; payload: WorkoutHistory[] };

let saveTimeout: NodeJS.Timeout;

const saveToLocalStorage = (state: TimerState) => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        // Save timers separately
        localStorage.setItem(TIMERS_KEY, JSON.stringify(state.timers));

        localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(state.workoutHistory));

        // Save runtime state if there's an active timer
        if (state.activeTimerIndex !== null) {
            localStorage.setItem(
                TIMER_STATE_KEY,
                JSON.stringify({
                    activeTimerIndex: state.activeTimerIndex,
                    isRunning: state.isRunning,
                    currentProgress: state.currentProgress,
                }),
            );
        }
    }, WRITE_DELAY);
};

const loadFromLocalStorage = (): { timers: Timer[]; savedState: Partial<TimerState>; workoutHistory: WorkoutHistory[] } => {
    const timers = localStorage.getItem(TIMERS_KEY);
    const savedState = localStorage.getItem(TIMER_STATE_KEY);
    const workoutHistory = localStorage.getItem(WORKOUT_HISTORY_KEY);

    return {
        timers: timers ? JSON.parse(timers) : [],
        savedState: savedState ? JSON.parse(savedState) : {},
        workoutHistory: workoutHistory ? JSON.parse(workoutHistory) : [],
    };
};

function timerReducer(state: TimerState, action: TimerAction): TimerState {
    let newState: TimerState;

    switch (action.type) {
        case 'LOAD_TIMERS':
            newState = {
                ...state,
                timers: action.payload,
                totalTime: action.payload.reduce((sum, timer) => sum + timer.duration, 0),
            };
            break;

        case 'ADD_TIMER':
            newState = {
                ...state,
                timers: [...state.timers, action.payload],
                totalTime: state.totalTime + action.payload.duration,
            };
            break;

        case 'EDIT_TIMER': {
            const newTimers = [...state.timers];
            newTimers[action.payload.index] = action.payload.timer;
            newState = {
                ...state,
                timers: newTimers,
                totalTime: newTimers.reduce((sum, timer) => sum + timer.duration, 0),
            };
            break;
        }

        case 'REMOVE_TIMER': {
            const newTimers = state.timers.filter((_, idx) => idx !== action.payload);
            const newActiveTimerIndex =
                state.activeTimerIndex === null
                    ? null
                    : state.activeTimerIndex === action.payload
                      ? null
                      : state.activeTimerIndex > action.payload
                        ? state.activeTimerIndex - 1
                        : state.activeTimerIndex;

            newState = {
                ...state,
                timers: newTimers,
                totalTime: newTimers.reduce((sum, timer) => sum + timer.duration, 0),
                activeTimerIndex: newActiveTimerIndex,
                isRunning: newActiveTimerIndex === null ? false : state.isRunning,
            };
            break;
        }

        case 'REORDER_TIMERS': {
            const { timers, newActiveIndex } = action.payload;
            newState = {
                ...state,
                timers,
                activeTimerIndex: newActiveIndex,
                totalTime: timers.reduce((sum, timer) => sum + timer.duration, 0),
            };
            break;
        }

        case 'START_TIMER':
            newState = {
                ...state,
                timers: state.timers.map((timer, idx) => ({
                    ...timer,
                    state: idx === action.payload ? 'running' : timer.state,
                })),
                activeTimerIndex: action.payload,
                isRunning: true,
                currentProgress: {
                    remainingTime: state.timers[action.payload].duration,
                    currentRound: 1,
                    isWorkPhase: true,
                },
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
            localStorage.removeItem(TIMER_STATE_KEY);
            break;

        case 'PAUSE_RESUME_WORKOUT':
            newState = {
                ...state,
                isRunning: !state.isRunning,
                timers: state.timers.map((timer, idx) => ({
                    ...timer,
                    state: idx === state.activeTimerIndex ? (!state.isRunning ? 'running' : 'not running') : timer.state,
                })),
            };
            break;

        case 'FAST_FORWARD': {
            if (state.activeTimerIndex === null) return state;
            const nextIndex = state.activeTimerIndex + 1;

            newState = {
                ...state,
                activeTimerIndex: nextIndex < state.timers.length ? nextIndex : null,
                isRunning: nextIndex < state.timers.length,
                timers: state.timers.map((timer, idx) => ({
                    ...timer,
                    state: idx === state.activeTimerIndex ? 'completed' : idx === nextIndex ? 'running' : timer.state,
                })),
                currentProgress:
                    nextIndex < state.timers.length
                        ? {
                              remainingTime: state.timers[nextIndex].duration,
                              currentRound: 1,
                              isWorkPhase: true,
                          }
                        : undefined,
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

        case 'COMPLETE_WORKOUT': {
            // Only add to history if there are timers and they're all completed
            if (state.timers.length === 0) return state;

            const allTimersCompleted = state.timers.every(timer => timer.state === 'completed');
            if (!allTimersCompleted) return state;

            const newWorkout: WorkoutHistory = {
                id: Date.now(),
                date: new Date().toISOString(),
                timers: state.timers,
                totalTime: state.totalTime,
                completed: true,
            };

            const newHistory = [...state.workoutHistory, newWorkout];

            // Save workout history to localStorage
            localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(newHistory));

            newState = {
                ...state,
                workoutHistory: newHistory,
                activeTimerIndex: null,
                isRunning: false,
                currentProgress: undefined,
                timers: state.timers.map(timer => ({
                    ...timer,
                    state: 'not running',
                })),
            };
            break;
        }

        case 'LOAD_WORKOUT_HISTORY':
            newState = {
                ...state,
                workoutHistory: action.payload,
            };
            break;

        default:
            return state;
    }

    // Save state to localStorage for specific actions
    if (
        [
            'ADD_TIMER',
            'REMOVE_TIMER',
            'EDIT_TIMER',
            'REORDER_TIMERS',
            'START_TIMER',
            'COMPLETE_TIMER',
            'PAUSE_RESUME_WORKOUT',
            'UPDATE_PROGRESS',
            'COMPLETE_WORKOUT', // Add this
        ].includes(action.type)
    ) {
        saveToLocalStorage(newState);
    }

    return newState;
}

const initialState: TimerState = {
    timers: [],
    activeTimerIndex: null,
    isRunning: false,
    totalTime: 0,
    workoutHistory: [],
};

const TimerContext = createContext<TimerContextType>({
    state: initialState,
    dispatch: () => undefined,
});

export const TimerProvider = ({ children }: { children: ReactNode }) => {
    const { timers, savedState, workoutHistory } = loadFromLocalStorage();

    const [state, dispatch] = useReducer(timerReducer, {
        ...initialState,
        timers,
        workoutHistory,
        ...savedState,
    });

    // Load timers on mount?
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (timers.length > 0) {
            dispatch({ type: 'LOAD_TIMERS', payload: timers });
        }
        if (workoutHistory.length > 0) {
            dispatch({ type: 'LOAD_WORKOUT_HISTORY', payload: workoutHistory });
        }
    }, []);

    return <TimerContext.Provider value={{ state, dispatch }}>{children}</TimerContext.Provider>;
};

export default TimerContext;
export type { TimerState, TimerContextType, TimerAction };
