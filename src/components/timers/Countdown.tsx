import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatTime } from '../../utils/helpers';
import TimerContext from '../contex/TimerContext';
import HomeButton from '../generic/HomeButton';
import Input from '../generic/Input';
import Panel from '../generic/Panel';
import ResetButton from '../generic/ResetButton';
import Button from '../generic/StartButton';

const TimeDisplay = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const SetNewTimeButton = styled(Button)`
  background-color: #007bff;
  &:hover {
    background-color: #0056b3;
  }
`;

interface CountdownProps {
    initialTime?: number;
    onComplete?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ initialTime, onComplete }) => {
    const { state, dispatch } = useContext(TimerContext);
    const [time, setTime] = useState(initialTime || 0);
    const [remainingTime, setRemainingTime] = useState(initialTime || 0);
    const [isTimeSet, setIsTimeSet] = useState(!!initialTime);
    const [isActive, setIsActive] = useState(false);

    // Load initial state from context if available
    useEffect(() => {
        if (initialTime && initialTime > 0) {
            setTime(initialTime);
            setRemainingTime(initialTime);
            setIsTimeSet(true);
        } else if (state.currentProgress && state.activeTimerIndex !== null) {
            // Restore from saved state
            setTime(state.timers[state.activeTimerIndex].duration);
            setRemainingTime(state.currentProgress.remainingTime);
            setIsActive(state.isRunning);
            setIsTimeSet(true);
        }
    }, [initialTime, state.currentProgress, state.activeTimerIndex, state.isRunning, state.timers]);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;

        if (isActive && remainingTime > 0) {
            interval = setInterval(() => {
                setRemainingTime(prev => {
                    const newTime = prev - 1;

                    // Update progress in context
                    dispatch({
                        type: 'UPDATE_PROGRESS',
                        payload: {
                            remainingTime: newTime,
                        },
                    });

                    if (newTime <= 0) {
                        setIsActive(false);
                        if (onComplete) {
                            onComplete();
                        }
                    }

                    return newTime;
                });
            }, 1000);
        } else if (remainingTime <= 0) {
            setIsActive(false);
            clearInterval(interval);
            if (onComplete) {
                onComplete();
            }
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isActive, remainingTime, onComplete, dispatch]);

    // Handle start/pause
    const handleStart = () => {
        if (remainingTime > 0) {
            const newIsActive = !isActive;
            setIsActive(newIsActive);

            if (!initialTime) {
                // Only dispatch if this is a standalone timer (not part of a workout)
                dispatch({
                    type: newIsActive ? 'START_TIMER' : 'PAUSE_RESUME_WORKOUT',
                    payload: state.activeTimerIndex || 0,
                });
            }
        }
    };

    // Handle reset
    const handleResetTime = () => {
        setIsActive(false);
        setRemainingTime(time);

        if (!initialTime) {
            // Only dispatch if this is a standalone timer
            dispatch({ type: 'RESET_WORKOUT' });
        }
    };

    // Handle setting new time
    const handleSetNewTime = () => {
        setIsActive(false);
        setIsTimeSet(false);
        setRemainingTime(0);

        if (!initialTime) {
            dispatch({ type: 'RESET_WORKOUT' });
        }
    };

    // Handle time input
    const handleTime = (hours: number, minutes: number, seconds: number) => {
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        setTime(totalSeconds);
        setRemainingTime(totalSeconds);
        setIsTimeSet(true);

        if (!initialTime) {
            // Only create a new timer if this is standalone
            dispatch({
                type: 'ADD_TIMER',
                payload: {
                    id: Date.now(),
                    type: 'countdown',
                    duration: totalSeconds,
                    state: 'not running',
                },
            });
        }
    };

    return (
        <Panel title="Countdown Timer">
            {!initialTime && <HomeButton />}
            {isTimeSet ? (
                <>
                    <TimeDisplay>{formatTime(remainingTime)}</TimeDisplay>
                    <Button onClick={handleStart}>{isActive ? 'Pause' : 'Start'}</Button>
                    <ResetButton onClick={handleResetTime}>Reset</ResetButton>
                    {!initialTime && <SetNewTimeButton onClick={handleSetNewTime}>New Time</SetNewTimeButton>}
                </>
            ) : (
                <Input onChange={handleTime} label="Set Countdown Time" />
            )}
        </Panel>
    );
};

export default Countdown;
