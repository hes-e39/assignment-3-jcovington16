import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatTime } from '../../utils/helpers';
import HomeButton from '../generic/HomeButton';
import Panel from '../generic/Panel';
import ResetButton from '../generic/ResetButton';
import { SetNewTimeButton } from '../generic/SetNewTimeButton';
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
    rounds: number;
    timePerRound: number;
    currentRound?: number;
    remainingTime?: number;
    isRunning?: boolean;
    onComplete?: () => void;
    description?: string;
}

const XY: React.FC<XYProps> = ({
    rounds: initialRounds,
    timePerRound: initialTimePerRound,
    currentRound: externalCurrentRound,
    remainingTime: externalRemainingTime,
    isRunning = false,
    onComplete,
}) => {
    const [roundTime, setRoundTime] = useState(initialTimePerRound || 0);
    const [totalRounds, setTotalRounds] = useState(initialRounds || 0);
    const [remainingTime, setRemainingTime] = useState(externalRemainingTime ?? (initialTimePerRound || 0));
    const [currentRound, setCurrentRound] = useState(externalCurrentRound ?? 1);
    const [isTimeSet, setIsTimeSet] = useState(!!initialRounds && !!initialTimePerRound);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (initialRounds && initialTimePerRound) {
            setRoundTime(initialTimePerRound);
            setTotalRounds(initialRounds);
            if (!externalRemainingTime) {
                setRemainingTime(initialTimePerRound);
            }
            setIsTimeSet(true);
        }
    }, [initialRounds, initialTimePerRound, externalRemainingTime]);

    useEffect(() => {
        if (externalRemainingTime !== undefined) {
            setRemainingTime(externalRemainingTime);
        }
        if (externalCurrentRound !== undefined) {
            setCurrentRound(externalCurrentRound);
        }
    }, [externalRemainingTime, externalCurrentRound]);

    // useEffect(() => {
    //     let interval: NodeJS.Timeout | undefined;

    //     const isTimerRunning = isRunning || isActive;

    //     if (isTimerRunning && remainingTime > 0) {
    //         interval = setInterval(() => setRemainingTime(prev => prev - 1), 1000);
    //     } else if (isTimerRunning && remainingTime === 0) {
    //         if (currentRound < totalRounds) {
    //             setCurrentRound(prev => prev + 1);
    //             setRemainingTime(roundTime);
    //         } else {
    //             setIsActive(false);
    //             if (onComplete) onComplete();
    //         }
    //     }
    //     return () => clearInterval(interval);
    // }, [isRunning, isActive, remainingTime, currentRound, totalRounds, roundTime, onComplete]);
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        const isTimerRunning = isRunning || isActive;
    
        if (isTimerRunning && remainingTime > 0) {
            interval = setInterval(() => setRemainingTime(prev => prev - 1), 1000);
        } else if (isTimerRunning && remainingTime === 0) {
            setTimeout(() => {
                if (currentRound < totalRounds) {
                    setCurrentRound(prev => prev + 1);
                    setRemainingTime(roundTime);
                } else {
                    setIsActive(false);
                    if (onComplete) onComplete();
                }
            }, 0);  // Defer state update
        }
    
        return () => clearInterval(interval);
    }, [isRunning, isActive, remainingTime, currentRound, totalRounds, roundTime, onComplete]);
    

    const handleStart = () => {
        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setRemainingTime(roundTime);
        setCurrentRound(1);
    };

    const handleTimeChange = (hours: number, minutes: number, seconds: number, rounds: number) => {
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        setRoundTime(totalSeconds);
        setRemainingTime(totalSeconds);
        setTotalRounds(rounds);
        setIsTimeSet(true);
    };

    const handleSetNewTime = () => {
        setIsActive(false);
        setIsTimeSet(false);
        setRemainingTime(0);
    };

    return (
        <Panel title="XY Timer">
            {!initialRounds && <HomeButton />}
            {isTimeSet ? (
                <>
                    <TimeDisplay>{formatTime(remainingTime)}</TimeDisplay>
                    <RoundDisplay>
                        Round {currentRound} of {totalRounds}
                    </RoundDisplay>
                    <Button onClick={handleStart}>{isActive || isRunning ? 'Pause' : 'Start'}</Button>
                    <ResetButton onClick={handleReset}>Reset</ResetButton>
                    <SetNewTimeButton onClick={handleSetNewTime}>New Time</SetNewTimeButton>
                </>
            ) : (
                <RoundTimeInput onSetTime={handleTimeChange} label="Set Time Per Round and Rounds" />
            )}
        </Panel>
    );
};

export default XY;
