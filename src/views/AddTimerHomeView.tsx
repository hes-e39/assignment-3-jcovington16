import { useContext, useState } from 'react';
import styled from 'styled-components';
import TimerContext from '../components/contex/TimerContext';
import Countdown from '../components/timers/Countdown';
import Stopwatch from '../components/timers/Stopwatch';
import Tabata from '../components/timers/Tabata';
import XY from '../components/timers/XY';

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  color: #2c3e50;
`;

const TimerQueue = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #2c3e50;
`;

const TotalTimeDisplay = styled.div`
  margin: 10px 0;
  padding: 10px;
  background-color: #e8f5e9;
  border-radius: 4px;
  font-size: 1.1rem;
  color: #2e7d32;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-weight: bold;
  }
`;

interface QueueItemProps {
    $isActive: boolean;
}

const QueueItem = styled.div<QueueItemProps>`
  padding: 15px;
  margin: 10px 0;
  background-color: ${props => (props.$isActive ? '#e0f7fa' : 'white')};
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ControlButton = styled.button`
  padding: 8px 16px;
  margin: 0 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &.start {
    background-color: #4caf50;
    color: white;
  }
  
  &.reset {
    background-color: #ff9800;
    color: white;
  }
  
  &.forward {
    background-color: #2196f3;
    color: white;
  }
  
  &:hover {
    opacity: 0.9;
  }
`;

const ConfigSection = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;

  label {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  input, select {
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;

  &:hover {
    background-color: #45a049;
  }
`;

interface CountdownProps {
    initialTime: number;
    onComplete?: () => void;
}

interface StopwatchProps {
    onComplete?: () => void;
}

interface XYProps {
    rounds?: number;
    timePerRound?: number;
    onComplete?: () => void;
}

interface TabataProps {
    rounds?: number;
    workTime?: number;
    restTime?: number;
    onComplete?: () => void;
}

const formatTotalTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
};

const AddTimerHomeView: React.FC = () => {
    const { state, dispatch } = useContext(TimerContext);
    const [type, setType] = useState<string>('stopwatch');
    const [duration, setDuration] = useState<number>(30);
    const [workTime, setWorkTime] = useState<number>(20);
    const [restTime, setRestTime] = useState<number>(10);
    const [rounds, setRounds] = useState<number>(8);
    const [activeTimerIndex, setActiveTimerIndex] = useState<number | null>(null);
    const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);

    const handleAddTimer = () => {
        // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
        let newTimer;

        switch (type) {
            case 'countdown':
                newTimer = {
                    id: Date.now(),
                    type: 'countdown',
                    duration: Number(duration),
                    state: 'not running' as const,
                };
                break;

            case 'stopwatch':
                newTimer = {
                    id: Date.now(),
                    type: 'stopwatch',
                    duration: 0,
                    state: 'not running' as const,
                };
                break;

            case 'xy':
                newTimer = {
                    id: Date.now(),
                    type: 'xy',
                    duration: duration * rounds,
                    state: 'not running' as const,
                    config: {
                        rounds,
                        timePerRound: duration,
                    },
                };
                break;

            case 'tabata':
                newTimer = {
                    id: Date.now(),
                    type: 'tabata',
                    duration: rounds * (workTime + restTime),
                    state: 'not running' as const,
                    config: {
                        rounds,
                        workTime,
                        restTime,
                    },
                };
                break;

            default:
                return;
        }

        dispatch({ type: 'ADD_TIMER', payload: newTimer });
    };

    const startWorkout = () => {
        if (!isWorkoutRunning && state.timers.length > 0) {
            setActiveTimerIndex(0);
            setIsWorkoutRunning(true);
            dispatch({ type: 'START_TIMER', payload: 0 });
        } else {
            setIsWorkoutRunning(false);
        }
        dispatch({ type: 'PAUSE_RESUME_WORKOUT' });
    };

    const resetWorkout = () => {
        setActiveTimerIndex(null);
        setIsWorkoutRunning(false);
        dispatch({ type: 'RESET_WORKOUT' });
    };

    const fastForward = () => {
        if (activeTimerIndex !== null) {
            const nextIndex = activeTimerIndex + 1;
            if (nextIndex < state.timers.length) {
                setActiveTimerIndex(nextIndex);
                dispatch({ type: 'FAST_FORWARD' });
            } else {
                setActiveTimerIndex(null);
                setIsWorkoutRunning(false);
            }
        }
    };

    const removeTimer = (index: number) => {
        dispatch({ type: 'REMOVE_TIMER', payload: index });
        if (index === activeTimerIndex) {
            setActiveTimerIndex(null);
            setIsWorkoutRunning(false);
        }
    };

    const renderActiveTimer = () => {
        if (activeTimerIndex === null || !state.timers[activeTimerIndex]) return null;

        const timer = state.timers[activeTimerIndex];

        switch (timer.type) {
            case 'countdown': {
                const CountdownTimer = Countdown as React.FC<CountdownProps>;
                return (
                    <div>
                        <CountdownTimer
                            key={timer.id}
                            initialTime={Number(timer.duration)}
                            onComplete={() => {
                                if (activeTimerIndex < state.timers.length - 1) {
                                    fastForward();
                                }
                            }}
                        />
                    </div>
                );
            }

            case 'stopwatch': {
                const StopwatchTimer = Stopwatch as React.FC<StopwatchProps>;
                return (
                    <StopwatchTimer
                        key={timer.id}
                        onComplete={() => {
                            if (activeTimerIndex < state.timers.length - 1) {
                                fastForward();
                            }
                        }}
                    />
                );
            }

            case 'xy': {
                const XYTimer = XY as React.FC<XYProps>;
                return (
                    <XYTimer
                        key={timer.id}
                        rounds={timer.config?.rounds}
                        timePerRound={timer.config?.timePerRound}
                        onComplete={() => {
                            if (activeTimerIndex < state.timers.length - 1) {
                                fastForward();
                            }
                        }}
                    />
                );
            }

            case 'tabata': {
                const TabataTimer = Tabata as React.FC<TabataProps>;
                return (
                    <TabataTimer
                        key={timer.id}
                        rounds={timer.config?.rounds}
                        workTime={timer.config?.workTime}
                        restTime={timer.config?.restTime}
                        onComplete={() => {
                            if (activeTimerIndex < state.timers.length - 1) {
                                fastForward();
                            }
                        }}
                    />
                );
            }

            default:
                return null;
        }
    };

    return (
        <Container>
            <h1>Add a Timer</h1>

            <ConfigSection>
                <InputGroup>
                    <label>
                        Timer Type:
                        <select value={type} onChange={e => setType(e.target.value)}>
                            <option value="stopwatch">Stopwatch</option>
                            <option value="countdown">Countdown</option>
                            <option value="xy">XY Timer</option>
                            <option value="tabata">Tabata</option>
                        </select>
                    </label>
                </InputGroup>

                {type === 'countdown' && (
                    <InputGroup>
                        <label>
                            Duration (seconds):
                            <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={1} />
                        </label>
                    </InputGroup>
                )}

                {type === 'xy' && (
                    <InputGroup>
                        <label>
                            Round Duration (seconds):
                            <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={1} />
                        </label>
                        <label>
                            Number of Rounds:
                            <input type="number" value={rounds} onChange={e => setRounds(Number(e.target.value))} min={1} />
                        </label>
                    </InputGroup>
                )}

                {type === 'tabata' && (
                    <>
                        <InputGroup>
                            <label>
                                Work Time (seconds):
                                <input type="number" value={workTime} onChange={e => setWorkTime(Number(e.target.value))} min={1} />
                            </label>
                            <label>
                                Rest Time (seconds):
                                <input type="number" value={restTime} onChange={e => setRestTime(Number(e.target.value))} min={1} />
                            </label>
                        </InputGroup>
                        <InputGroup>
                            <label>
                                Rounds:
                                <input type="number" value={rounds} onChange={e => setRounds(Number(e.target.value))} min={1} />
                            </label>
                        </InputGroup>
                    </>
                )}

                <AddButton onClick={handleAddTimer}>Add Timer</AddButton>
            </ConfigSection>

            <TimerQueue>
                <h2>Workout Queue ({state.timers.length} timers)</h2>
                <TotalTimeDisplay>
                    Total Workout Time: <span>{formatTotalTime(state.totalTime)}</span>
                </TotalTimeDisplay>
                <div>
                    <ControlButton className="start" onClick={startWorkout}>
                        {isWorkoutRunning ? 'Pause' : 'Start Workout'}
                    </ControlButton>
                    <ControlButton className="reset" onClick={resetWorkout}>
                        Reset
                    </ControlButton>
                    <ControlButton className="forward" onClick={fastForward}>
                        Skip Timer
                    </ControlButton>
                </div>

                {state.timers.map((timer, index) => (
                    <QueueItem key={timer.id} $isActive={index === activeTimerIndex}>
                        <div>
                            {timer.type} - {formatTotalTime(timer.duration)}
                            {timer.config && ` - ${timer.config.rounds} rounds`}
                        </div>
                        <button onClick={() => removeTimer(index)}>Remove</button>
                    </QueueItem>
                ))}

                {activeTimerIndex !== null && renderActiveTimer()}
            </TimerQueue>
        </Container>
    );
};

export default AddTimerHomeView;