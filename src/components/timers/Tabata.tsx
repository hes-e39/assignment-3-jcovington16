import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatTime } from '../../utils/helpers';
import HomeButton from '../generic/HomeButton';
import Panel from '../generic/Panel';
import ResetButton from '../generic/ResetButton';
import RoundTimeInput from '../generic/RoundTimeInput';
import { SetNewTimeButton } from '../generic/SetNewTimeButton';
import Button from '../generic/StartButton';

const TimeDisplay = styled.div`
    font-size: 3rem;
    margin-bottom: 20px;
`;

interface StatusDisplayProps {
    $isWorkPhase: boolean;
}

const StatusDisplay = styled.div<StatusDisplayProps>`
    font-size: 2rem;
    color: ${props => (props.$isWorkPhase ? '#4caf50' : '#ff6b6b')};
    margin-bottom: 10px;
`;

const RoundDisplay = styled.div`
    font-size: 1.5rem;
    margin-top: 10px;
`;

interface TabataProps {
    rounds: number;
    workTime: number;
    restTime: number;
    currentRound?: number;
    remainingTime?: number;
    isRunning?: boolean;
    isWorkPhase?: boolean;
    onComplete?: () => void;
    description?: string;
}

const Tabata: React.FC<TabataProps> = ({
    rounds: initialRounds = 8,
    workTime: initialWorkTime = 20,
    restTime: initialRestTime = 10,
    currentRound: externalCurrentRound,
    remainingTime: externalRemainingTime,
    isRunning = false,
    isWorkPhase: externalIsWorkPhase,
    onComplete,
}) => {
    const [workTime, setWorkTime] = useState(initialWorkTime);
    const [restTime, setRestTime] = useState(initialRestTime);
    const [totalRounds, setTotalRounds] = useState(initialRounds);
    const [remainingTime, setRemainingTime] = useState(externalRemainingTime ?? initialWorkTime);
    const [currentRound, setCurrentRound] = useState(externalCurrentRound ?? 1);
    const [isActive, setIsActive] = useState(false);
    const [isTimeSet, setIsTimeSet] = useState(!!initialRounds);
    const [isWorkPhase, setIsWorkPhase] = useState(externalIsWorkPhase ?? true);

    useEffect(() => {
        if (initialRounds && initialWorkTime && initialRestTime) {
            setWorkTime(initialWorkTime);
            setRestTime(initialRestTime);
            setTotalRounds(initialRounds);
            if (!externalRemainingTime) {
                setRemainingTime(initialWorkTime);
            }
            setIsTimeSet(true);
        }
    }, [initialRounds, initialWorkTime, initialRestTime, externalRemainingTime]);

    useEffect(() => {
        if (externalRemainingTime !== undefined) {
            setRemainingTime(externalRemainingTime);
        }
        if (externalCurrentRound !== undefined) {
            setCurrentRound(externalCurrentRound);
        }
        if (externalIsWorkPhase !== undefined) {
            setIsWorkPhase(externalIsWorkPhase);
        }
    }, [externalRemainingTime, externalCurrentRound, externalIsWorkPhase]);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        const isTimerRunning = isRunning || isActive;

        if (isTimerRunning && remainingTime > 0) {
            interval = setInterval(() => setRemainingTime(prev => prev - 1), 1000);
        } else if (isTimerRunning && remainingTime === 0) {
            if (isWorkPhase) {
                setRemainingTime(restTime);
                setIsWorkPhase(false);
            } else {
                if (currentRound < totalRounds) {
                    setCurrentRound(prev => prev + 1);
                    setRemainingTime(workTime);
                    setIsWorkPhase(true);
                } else {
                    setIsActive(false);
                    if (onComplete) onComplete();
                }
            }
        }
        return () => clearInterval(interval);
    }, [isRunning, isActive, remainingTime, isWorkPhase, currentRound, totalRounds, workTime, restTime, onComplete]);

    const handleStart = () => {
        setIsActive(!isActive);
    };

    const handleReset = () => {
        setIsActive(false);
        setRemainingTime(workTime);
        setCurrentRound(1);
        setIsWorkPhase(true);
    };

    const handleTimeChange = (workMinutes: number, workSeconds: number, restMinutes: number, restSeconds: number, rounds: number) => {
        const totalWorkSeconds = workMinutes * 60 + workSeconds;
        const totalRestSeconds = restMinutes * 60 + restSeconds;
        setWorkTime(totalWorkSeconds);
        setRestTime(totalRestSeconds);
        setTotalRounds(rounds);
        setRemainingTime(totalWorkSeconds);
        setIsTimeSet(true);
    };

    const handleSetNewTime = () => {
        setIsActive(false);
        setIsTimeSet(false);
        setRemainingTime(0);
        setCurrentRound(1);
        setIsWorkPhase(true);
    };

    return (
        <Panel title="Tabata Timer">
            {!initialRounds && <HomeButton />}
            {isTimeSet ? (
                <>
                    <StatusDisplay $isWorkPhase={isWorkPhase}>{isWorkPhase ? 'Work' : 'Rest'}</StatusDisplay>
                    <TimeDisplay>{formatTime(remainingTime)}</TimeDisplay>
                    <RoundDisplay>
                        Round {currentRound} of {totalRounds}
                    </RoundDisplay>
                    <Button onClick={handleStart}>{isActive || isRunning ? 'Pause' : 'Start'}</Button>
                    <ResetButton onClick={handleReset}>Reset</ResetButton>
                    <SetNewTimeButton onClick={handleSetNewTime}>New Time</SetNewTimeButton>
                </>
            ) : (
                <RoundTimeInput onSetTime={handleTimeChange} label="Set Work/Rest Time and Rounds" />
            )}
        </Panel>
    );
};

export default Tabata;
