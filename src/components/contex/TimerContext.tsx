// import { createContext, useEffect, useReducer } from 'react';
// import type { Dispatch, ReactNode } from 'react';

// const TIMER_CONFIG_KEY = 'workout_timer_config';
// const TIMER_STATE_KEY = 'workout_timer_state';

// interface Timer {
//     id: number;
//     type: string;
//     duration: number;
//     state: 'not running' | 'running' | 'completed';
//     config?: {
//         rounds?: number;
//         workTime?: number;
//         restTime?: number;
//         timePerRound?: number;
//     };
// }

// interface TimerState {
//     timers: Timer[];
//     activeTimerIndex: number | null;
//     isRunning: boolean;
//     totalTime: number;
//     currentProgress?: {
//         remainingTime: number;
//         currentRound?: number;
//         isWorkPhase?: boolean;
//     };
// }

// type TimerAction =
//     | { type: 'ADD_TIMER'; payload: Timer }
//     | { type: 'REMOVE_TIMER'; payload: number }
//     | { type: 'START_TIMER'; payload: number }
//     | { type: 'COMPLETE_TIMER'; payload: number }
//     | { type: 'RESET_WORKOUT' }
//     | { type: 'FAST_FORWARD' }
//     | { type: 'PAUSE_RESUME_WORKOUT' }
//     | { type: 'UPDATE_PROGRESS'; payload: {
//         newActiveIndex: number | null;
//         timers: Timer[]; remainingTime: number; currentRound?: number; isWorkPhase?: boolean
// } }
//     | { type: 'REORDER_TIMERS'; payload: { timers: Timer[]; newActiveIndex: number | null;}};

// interface TimerContextType {
//     state: TimerState;
//     dispatch: Dispatch<TimerAction>;
// }

// function saveTimerConfig(timers: Timer[]) {
//     localStorage.setItem(TIMER_CONFIG_KEY, JSON.stringify({ timers }));
// }

// function saveTimerState(state: Pick<TimerState, 'activeTimerIndex' | 'isRunning' | 'currentProgress'>) {
//     localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
// }

// function loadTimerConfig(): Timer[] {
//     const stored = localStorage.getItem(TIMER_CONFIG_KEY);
//     return stored ? JSON.parse(stored).timers : [];
// }

// function loadTimerState(): Partial<TimerState> | null {
//     const stored = localStorage.getItem(TIMER_STATE_KEY);
//     return stored ? JSON.parse(stored) : null;
// }

// function getTimerStateInProgression(index: number, activeIndex: number | null, newIndex: number): Timer['state'] {
//     if (index === activeIndex) return 'completed';
//     if (index === newIndex) return 'running';
//     return 'not running';
// }

// const loadInitialState = (): TimerState => {
//     const savedTimers = loadTimerConfig();
//     const savedState = loadTimerState();

//     const initialState: TimerState = {
//         timers: savedTimers,
//         activeTimerIndex: savedState?.activeTimerIndex ?? null,
//         isRunning: savedState?.isRunning ?? false,
//         totalTime: savedTimers.reduce((sum, timer) => sum + timer.duration, 0),
//         currentProgress: savedState?.currentProgress,
//     };

//     // If we have an active timer, make sure its state is correct
//     if (initialState.activeTimerIndex !== null) {
//         initialState.timers = initialState.timers.map((timer, index) => ({
//             ...timer,
//             state: index === initialState.activeTimerIndex ? (initialState.isRunning ? 'running' : 'not running') : 'not running',
//         }));
//     }

//     return initialState;
// };

// function timerReducer(state: TimerState, action: TimerAction): TimerState {
//     let newState: TimerState;

//     switch (action.type) {
//         case 'ADD_TIMER':
//             newState = {
//                 ...state,
//                 timers: [...state.timers, action.payload],
//                 totalTime: state.totalTime + action.payload.duration,
//             };
//             break;

//         case 'REMOVE_TIMER':
//             newState = {
//                 ...state,
//                 timers: state.timers.filter((_, idx) => idx !== action.payload),
//                 totalTime: state.timers.reduce((sum, timer, idx) => (idx !== action.payload ? sum + timer.duration : sum), 0),
//                 activeTimerIndex: state.activeTimerIndex === action.payload ? null : state.activeTimerIndex,
//                 isRunning: state.activeTimerIndex === action.payload ? false : state.isRunning,
//             };
//             break;

//         case 'START_TIMER':
//             newState = {
//                 ...state,
//                 timers: state.timers.map((timer, idx) => ({
//                     ...timer,
//                     state: idx === action.payload ? 'running' : timer.state,
//                 })),
//                 activeTimerIndex: action.payload,
//                 isRunning: true,
//             };
//             break;

//         case 'COMPLETE_TIMER': {
//             const nextIndex = action.payload + 1 < state.timers.length ? action.payload + 1 : null;
//             newState = {
//                 ...state,
//                 timers: state.timers.map((timer, idx) => ({
//                     ...timer,
//                     state: idx === action.payload ? 'completed' : timer.state,
//                 })),
//                 activeTimerIndex: nextIndex,
//                 isRunning: nextIndex !== null,
//                 currentProgress:
//                     nextIndex !== null
//                         ? {
//                               remainingTime: state.timers[nextIndex].duration,
//                               currentRound: 1,
//                               isWorkPhase: true,
//                           }
//                         : undefined,
//             };
//             break;
//         }

//         case 'RESET_WORKOUT':
//             newState = {
//                 ...state,
//                 timers: state.timers.map(timer => ({
//                     ...timer,
//                     state: 'not running',
//                 })),
//                 activeTimerIndex: null,
//                 isRunning: false,
//                 currentProgress: undefined,
//             };
//             // Clear stored state on reset
//             localStorage.removeItem(TIMER_STATE_KEY);
//             break;

//         case 'FAST_FORWARD': {
//             if (state.activeTimerIndex === null) return state;
//             const newIndex = state.activeTimerIndex + 1;

//             newState = {
//                 ...state,
//                 activeTimerIndex: newIndex < state.timers.length ? newIndex : null,
//                 isRunning: newIndex < state.timers.length,
//                 timers: state.timers.map((timer, idx) => ({
//                     ...timer,
//                     state: getTimerStateInProgression(idx, state.activeTimerIndex, newIndex),
//                 })),
//                 currentProgress:
//                     newIndex < state.timers.length
//                         ? {
//                               remainingTime: state.timers[newIndex].duration,
//                               currentRound: 1,
//                               isWorkPhase: true,
//                           }
//                         : undefined,
//             };
//             break;
//         }

//         case 'PAUSE_RESUME_WORKOUT': {
//             const isRunning = !state.isRunning;
//             newState = {
//                 ...state,
//                 isRunning,
//                 timers: state.timers.map((timer, idx) => ({
//                     ...timer,
//                     state: idx === state.activeTimerIndex ? (isRunning ? 'running' : 'not running') : timer.state,
//                 })),
//             };
//             break;
//         }

//         case 'REORDER_TIMERS':
//             newState = {
//                 ...state,
//                 timers: action.payload.timers,
//                 activeTimerIndex: action.payload.newActiveIndex,
//                 totalTime: action.payload.timers.reduce((sum, timer) => sum + timer.duration, 0)
//             };
//             break;

//         case 'UPDATE_PROGRESS':
//             newState = {
//                 ...state,
//                 timers: action.payload.timers,
//                 activeTimerIndex: action.payload.newActiveIndex,
//                 totalTime: action.payload.timers.reduce((sum, timer) => sum + timer.duration, 0)
//             };
//             break;

//         default:
//             return state;
//     }

//     // Persist state if we have an active timer
//     if (newState.activeTimerIndex !== null) {
//         saveTimerConfig(newState.timers);
//         saveTimerState({
//             activeTimerIndex: newState.activeTimerIndex,
//             isRunning: newState.isRunning,
//             currentProgress: newState.currentProgress,
//         });
//     }

//     return newState;
// }

// const TimerContext = createContext<TimerContextType>({
//     state: loadInitialState(),
//     dispatch: () => undefined,
// });

// export const TimerProvider = ({ children }: { children: ReactNode }) => {
//     const [state, dispatch] = useReducer(timerReducer, null, loadInitialState);

//     // Set up event listener for page unload
//     useEffect(() => {
//         const handleBeforeUnload = () => {
//             if (state.activeTimerIndex !== null) {
//                 saveTimerConfig(state.timers);
//                 saveTimerState({
//                     activeTimerIndex: state.activeTimerIndex,
//                     isRunning: state.isRunning,
//                     currentProgress: state.currentProgress,
//                 });
//             }
//         };

//         window.addEventListener('beforeunload', handleBeforeUnload);
//         return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//     }, [state]);

//     return <TimerContext.Provider value={{ state, dispatch }}>{children}</TimerContext.Provider>;
// };

// export default TimerContext;

import { createContext, useEffect, useReducer } from 'react';
import type { Dispatch, ReactNode } from 'react';

const TIMER_STATE_KEY = 'workout_timer_state';
const WRITE_DELAY = 1000; // 1 second delay for localStorage writes

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
    | { type: 'REORDER_TIMERS'; payload: { timers: Timer[]; newActiveIndex: number | null } };

let saveTimeout: NodeJS.Timeout;
const saveToLocalStorage = (state: TimerState) => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
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

// Load the state from localStorage
const loadFromLocalStorage = (): Partial<TimerState> => {
    const saved = localStorage.getItem(TIMER_STATE_KEY);
    return saved ? JSON.parse(saved) : {};
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
            const newIndex = state.activeTimerIndex + 1;

            newState = {
                ...state,
                activeTimerIndex: newIndex < state.timers.length ? newIndex : null,
                isRunning: newIndex < state.timers.length,
                timers: state.timers.map((timer, idx) => ({
                    ...timer,
                    state: idx === state.activeTimerIndex ? 'completed' : idx === newIndex ? 'running' : timer.state,
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

    // Save state to localStorage
    if (['START_TIMER', 'PAUSE_RESUME_WORKOUT', 'UPDATE_PROGRESS', 'REORDER_TIMERS'].includes(action.type)) {
        saveToLocalStorage(newState);
    }

    return newState;
}

const TimerContext = createContext<TimerContextType>({
    state: {
        timers: [],
        activeTimerIndex: null,
        isRunning: false,
        totalTime: 0,
    },
    dispatch: () => undefined,
});

export const TimerProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(timerReducer, {
        timers: [],
        activeTimerIndex: null,
        isRunning: false,
        totalTime: 0,
    });

    // Load persisted state on mount
    useEffect(() => {
        const savedState = loadFromLocalStorage();
        if (savedState.activeTimerIndex !== undefined) {
            dispatch({
                type: 'UPDATE_PROGRESS',
                payload: savedState.currentProgress || { remainingTime: 0 },
            });
        }
    }, []);

    return <TimerContext.Provider value={{ state, dispatch }}>{children}</TimerContext.Provider>;
};

export default TimerContext;
export type { Timer, TimerState, TimerContextType, TimerAction };
