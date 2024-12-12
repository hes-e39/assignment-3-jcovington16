import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatTime } from '../../utils/helpers';
import TimerContext from '../contex/TimerContext';
import HomeButton from '../generic/HomeButton';
import Panel from '../generic/Panel';
import ResetButton from '../generic/ResetButton';
import Button from '../generic/StartButton';
import RoundTimeInput from '../generic/XYInput';

const TimeDisplay = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

const RoundDisplay = styled.div`
  font-size: 1.5rem;
  margin-top: 10px;
`;

interface XYProps {
    rounds?: number;
    timePerRound?: number;
    onComplete?: () => void;
}

const XY: React.FC<XYProps> = ({ rounds: initialRounds, timePerRound: initialTimePerRound, onComplete }) => {
    const { state, dispatch } = useContext(TimerContext);
    const [roundTime, setRoundTime] = useState(initialTimePerRound || 0);
    const [totalRounds, setTotalRounds] = useState(initialRounds || 0);
    const [remainingTime, setRemainingTime] = useState(initialTimePerRound || 0);
    const [currentRound, setCurrentRound] = useState(1);
    const [isActive, setIsActive] = useState(false);
    const [isTimeSet, setIsTimeSet] = useState(!!initialRounds && !!initialTimePerRound);

    // Load initial or persisted state
    useEffect(() => {
        if (initialRounds && initialTimePerRound) {
            setRoundTime(initialTimePerRound);
            setTotalRounds(initialRounds);
            setRemainingTime(initialTimePerRound);
            setIsTimeSet(true);
        } else if (state.currentProgress && state.activeTimerIndex !== null) {
            const timer = state.timers[state.activeTimerIndex];
            if (timer.type === 'xy' && timer.config) {
                setRoundTime(timer.config.timePerRound || 0);
                setTotalRounds(timer.config.rounds || 0);
                setRemainingTime(state.currentProgress.remainingTime);
                setCurrentRound(state.currentProgress.currentRound || 1);
                setIsActive(state.isRunning);
                setIsTimeSet(true);
            }
        }
    }, [initialRounds, initialTimePerRound, state.currentProgress, state.activeTimerIndex, state.isRunning, state.timers]);

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
                            currentRound: currentRound,
                        },
                    });

                    return newTime;
                });
            }, 1000);
        } else if (isActive && remainingTime === 0) {
            if (currentRound < totalRounds) {
                setCurrentRound(prev => prev + 1);
                setRemainingTime(roundTime);
            } else {
                setIsActive(false);
                if (onComplete) {
                    onComplete();
                }
            }
        }

        return () => clearInterval(interval);
    }, [isActive, remainingTime, currentRound, totalRounds, roundTime, dispatch, onComplete]);

    const handleStart = () => {
        if (remainingTime > 0) {
            const newIsActive = !isActive;
            setIsActive(newIsActive);

            if (!initialTimePerRound) {
                // Only dispatch if this is a standalone timer
                dispatch({
                    type: newIsActive ? 'START_TIMER' : 'PAUSE_RESUME_WORKOUT',
                    payload: state.activeTimerIndex || 0,
                });
            }
        }
    };

    const handleReset = () => {
        setIsActive(false);
        setRemainingTime(roundTime);
        setCurrentRound(1);

        if (!initialTimePerRound) {
            dispatch({ type: 'RESET_WORKOUT' });
        }
    };

    const handleTimeChange = (hours: number, minutes: number, seconds: number, rounds: number) => {
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        setRoundTime(totalSeconds);
        setRemainingTime(totalSeconds);
        setTotalRounds(rounds);
        setCurrentRound(1);
        setIsTimeSet(true);

        if (!initialTimePerRound) {
            // Only create new timer if standalone
            dispatch({
                type: 'ADD_TIMER',
                payload: {
                    id: Date.now(),
                    type: 'xy',
                    duration: totalSeconds * rounds,
                    state: 'not running',
                    config: {
                        timePerRound: totalSeconds,
                        rounds: rounds,
                    },
                },
            });
        }
    };

    return (
        <Panel title="XY Timer">
            {!initialTimePerRound && <HomeButton />}
            {isTimeSet ? (
                <>
                    <TimeDisplay>{formatTime(remainingTime)}</TimeDisplay>
                    <RoundDisplay>
                        Round {currentRound} of {totalRounds}
                    </RoundDisplay>
                    <Button onClick={handleStart}>{isActive ? 'Pause' : 'Start'}</Button>
                    <ResetButton onClick={handleReset}>Reset</ResetButton>
                </>
            ) : (
                <RoundTimeInput onSetTime={handleTimeChange} label="Set Time Per Round and Rounds" />
            )}
        </Panel>
    );
};

export default XY;
