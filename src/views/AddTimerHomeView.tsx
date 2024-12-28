import { useContext, useState } from 'react';
import TimerQueue from '../components/TimerQueue';
import TimerContext from '../components/contex/TimerContext';
import { ActiveTimerContainer, AddButton, ConfigSection, Container, DescriptionInput, InputGroup, TotalTimeDisplay, WorkoutControls } from '../components/generic/AddTimerHomeViewStyles';
import Countdown from '../components/timers/Countdown';
import Stopwatch from '../components/timers/Stopwatch';
import Tabata from '../components/timers/Tabata';
import XY from '../components/timers/XY';
import WorkoutShareControls from '../utils/WorkoutShare';

// biome-ignore lint/style/useImportType: <explanation>
import { Timer, formatTotalTime } from '../utils/helpers';

const AddTimerHomeView: React.FC = () => {
    const { state, dispatch } = useContext(TimerContext);
    const [type, setType] = useState<'stopwatch' | 'countdown' | 'xy' | 'tabata'>('stopwatch');
    const [duration, setDuration] = useState<number>(30);
    const [workTime] = useState<number>(20);
    const [restTime] = useState<number>(10);
    const [rounds, setRounds] = useState<number>(8);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(30);
    const [workHours, setWorkHours] = useState(0);
    const [workMinutes, setWorkMinutes] = useState(0);
    const [workSeconds, setWorkSeconds] = useState(20);
    const [restHours, setRestHours] = useState(0);
    const [restMinutes, setRestMinutes] = useState(0);
    const [restSeconds, setRestSeconds] = useState(10);
    const [description, setDescription] = useState('');

    const activeTimerIndex = state.activeTimerIndex;
    const isWorkoutRunning = state.isRunning;

    const handleAddTimer = () => {
        let newTimer: Timer;

        switch (type) {
            case 'countdown':
                newTimer = {
                    id: Date.now(),
                    type: 'countdown',
                    duration: Number(duration),
                    state: 'not running',
                    description: description || 'No Description',
                };
                break;

            case 'stopwatch':
                newTimer = {
                    id: Date.now(),
                    type: 'stopwatch',
                    duration: Number(duration),
                    state: 'not running',
                    description: description || 'No description',
                };
            break;

            case 'xy':
                const xyDuration = hours * 3600 + minutes * 60 + seconds;
                newTimer = {
                    id: Date.now(),
                    type: 'xy',
                    duration: xyDuration * rounds,
                    state: 'not running',
                    description: description || '',
                    config: {
                        rounds,
                        timePerRound: xyDuration,
                    },
                };
            break;

            case 'tabata': {
                const totalWorkTime = workHours * 3600 + workMinutes * 60 + workSeconds;
                const totalRestTime = restHours * 3600 + restMinutes * 60 + restSeconds;
                newTimer = {
                    id: Date.now(),
                    type: 'tabata',
                    duration: rounds * (totalWorkTime + totalRestTime),
                    state: 'not running',
                    description: description || '',
                    config: {
                        rounds,
                        workTime: totalWorkTime,
                        restTime: totalRestTime,
                    },
                };
                break;
            }

            default:
                return;
        }

        dispatch({ type: 'ADD_TIMER', payload: newTimer });
    };

    const handleRemoveTimer = (index: number) => {
        dispatch({ type: 'REMOVE_TIMER', payload: index });
    };

    const handleTimersReorder = (newTimers: Timer[], newActiveIndex: number | null) => {
        dispatch({
            type: 'REORDER_TIMERS',
            payload: {
                timers: newTimers,
                newActiveIndex,
            },
        });
    };

    const startWorkout = () => {
        if (!isWorkoutRunning && state.timers.length > 0) {
            if (activeTimerIndex === null) {
                dispatch({ type: 'START_TIMER', payload: 0 });
            }
        }
        dispatch({ type: 'PAUSE_RESUME_WORKOUT' });
    };

    const resetWorkout = () => {
        dispatch({ type: 'RESET_WORKOUT' });
    };

    const fastForward = () => {
        if (activeTimerIndex !== null && activeTimerIndex === state.timers.length - 1) {
            dispatch({ type: 'COMPLETE_WORKOUT' });
        } else {
            dispatch({ type: 'FAST_FORWARD' });
        }
    };

    const handleTimerComplete = () => {
        if (activeTimerIndex !== null) {
            if (activeTimerIndex === state.timers.length - 1) {
                dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
                dispatch({ type: 'COMPLETE_WORKOUT' });
            } else {
                dispatch({ type: 'COMPLETE_TIMER', payload: activeTimerIndex });
            }
        }
    };

    const renderActiveTimer = () => {
        if (activeTimerIndex === null || !state.timers[activeTimerIndex]) return null;
    
        const timer = state.timers[activeTimerIndex];
    
        const commonProps = {
            description: timer.description,
            isRunning: isWorkoutRunning,
            onComplete: handleTimerComplete
        };
    
        switch (timer.type) {
            case 'countdown':
                return (
                    <Countdown
                        {...commonProps}
                        key={timer.id}
                        initialTime={timer.duration}
                        remainingTime={state.currentProgress?.remainingTime}
                    />
                );

            case 'stopwatch':
                return (
                    <Stopwatch
                        {...commonProps}
                        key={timer.id}
                        duration={timer.duration}
                        remainingTime={state.currentProgress?.remainingTime}
                    />
                );
    
            case 'xy':
                return (
                    <XY
                        {...commonProps}
                        key={timer.id}
                        rounds={timer.config?.rounds || 0}
                        timePerRound={timer.config?.timePerRound || 0}
                        currentRound={state.currentProgress?.currentRound}
                        remainingTime={state.currentProgress?.remainingTime}
                    />
                );
    
            case 'tabata':
                return (
                    <Tabata
                        {...commonProps}
                        key={timer.id}
                        rounds={timer.config?.rounds || 0}
                        workTime={timer.config?.workTime || 0}
                        restTime={timer.config?.restTime || 0}
                        currentRound={state.currentProgress?.currentRound}
                        isWorkPhase={state.currentProgress?.isWorkPhase}
                        remainingTime={state.currentProgress?.remainingTime}
                    />
                );
    
            default:
                return null;
        }
    };

    return (
        <Container>
            <h1>Add a Timer</h1>

            <WorkoutShareControls />

            <ConfigSection>
                <InputGroup>
                    <label>
                        Timer Type:
                        <select value={type} onChange={e => setType(e.target.value as 'stopwatch' | 'countdown' | 'xy' | 'tabata')}>
                            <option value="stopwatch">Stopwatch</option>
                            <option value="countdown">Countdown</option>
                            <option value="xy">XY Timer</option>
                            <option value="tabata">Tabata</option>
                        </select>
                    </label>
                </InputGroup>

                <InputGroup>
                    {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                    <label>
                        Description (optional):
                        <DescriptionInput value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what needs to be done (e.g., 50 push ups)" />
                    </label>
                </InputGroup>

                {(type === 'stopwatch' || type === 'countdown') && (
                    <InputGroup>
                        <label>
                            Duration (seconds):
                            <input type="number" value={duration} onChange={e => setDuration(Math.max(1, Number(e.target.value)))} min={1} />
                        </label>
                    </InputGroup>
                )}

                {type === 'xy' && (
                    <>
                        <InputGroup>
                            <label>
                                Hours Per Round:
                                <input type="number" value={hours} onChange={e => setHours(Math.max(0, Number(e.target.value)))} min={0} />
                            </label>
                            <label>
                                Minutes Per Round:
                                <input type="number" value={minutes} onChange={e => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))} min={0} max={59} />
                            </label>
                            <label>
                                Seconds Per Round:
                                <input type="number" value={seconds} onChange={e => setSeconds(Math.max(0, Math.min(59, Number(e.target.value))))} min={0} max={59} />
                            </label>
                        </InputGroup>
                        <InputGroup>
                            <label>
                                Number of Rounds:
                                <input type="number" value={rounds} onChange={e => setRounds(Math.max(1, Number(e.target.value)))} min={1} />
                            </label>
                        </InputGroup>
                    </>
                )}

                {type === 'tabata' && (
                    <>
                        <InputGroup>
                            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                            <label>Work Time</label>
                            <label>
                                Hours:
                                <input type="number" value={workHours} onChange={e => setWorkHours(Math.max(0, Number(e.target.value)))} min={0} />
                            </label>
                            <label>
                                Minutes:
                                <input type="number" value={workMinutes} onChange={e => setWorkMinutes(Math.max(0, Math.min(59, Number(e.target.value))))} min={0} max={59} />
                            </label>
                            <label>
                                Seconds:
                                <input type="number" value={workSeconds} onChange={e => setWorkSeconds(Math.max(0, Math.min(59, Number(e.target.value))))} min={0} max={59} />
                            </label>
                        </InputGroup>
                        <InputGroup>
                            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                            <label>Rest Time</label>
                            <label>
                                Hours:
                                <input type="number" value={restHours} onChange={e => setRestHours(Math.max(0, Number(e.target.value)))} min={0} />
                            </label>
                            <label>
                                Minutes:
                                <input type="number" value={restMinutes} onChange={e => setRestMinutes(Math.max(0, Math.min(59, Number(e.target.value))))} min={0} max={59} />
                            </label>
                            <label>
                                Seconds:
                                <input type="number" value={restSeconds} onChange={e => setRestSeconds(Math.max(0, Math.min(59, Number(e.target.value))))} min={0} max={59} />
                            </label>
                        </InputGroup>
                        <InputGroup>
                            <label>
                                Rounds:
                                <input type="number" value={rounds} onChange={e => setRounds(Math.max(1, Number(e.target.value)))} min={1} />
                            </label>
                        </InputGroup>
                    </>
                )}

                <AddButton onClick={handleAddTimer}>Add Timer</AddButton>
            </ConfigSection>

            {/* Active Timer Display */}
            {activeTimerIndex !== null && <ActiveTimerContainer>{renderActiveTimer()}</ActiveTimerContainer>}

            {/* Timer Queue with Controls */}
            <div className="queue-container">
                <h2>Workout Queue ({state.timers.length} timers)</h2>

                {/* Workout Controls */}
                <WorkoutControls>
                    <button className="start" onClick={startWorkout}>
                        {isWorkoutRunning ? 'Pause' : 'Start Workout'}
                    </button>
                    <button className="reset" onClick={resetWorkout}>
                        Reset
                    </button>
                    <button className="forward" onClick={fastForward}>
                        Skip Timer
                    </button>
                </WorkoutControls>

                <TotalTimeDisplay>
                    Total Workout Time: <span>{formatTotalTime(state.totalTime)}</span>
                </TotalTimeDisplay>

                <TimerQueue timers={state.timers} activeTimerIndex={activeTimerIndex} onRemoveTimer={handleRemoveTimer} onTimersReorder={handleTimersReorder} />
            </div>
        </Container>
    );
};

export default AddTimerHomeView;
