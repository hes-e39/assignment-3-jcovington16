import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatTime, toggleTimerActiveState } from '../../utils/helpers';
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

const Description = styled.div`
    font-size: 1.2rem;
    color: #666;
    margin: 10px 0;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
    font-style: italic;
`;

interface CountdownProps {
    initialTime?: number;
    isRunning?: boolean;
    remainingTime?: number;
    description?: string;
    onComplete?: () => void;
}

const Countdown: React.FC<CountdownProps> = ({ initialTime, isRunning: externalIsRunning, remainingTime: externalRemainingTime, description, onComplete }) => {
    const [time, setTime] = useState(initialTime || 0);
    const [remainingTime, setRemainingTime] = useState(externalRemainingTime ?? initialTime ?? 0);
    const [isTimeSet, setIsTimeSet] = useState(!!initialTime);
    const [isActive, setIsActive] = useState(false);

    // Handle external running state
    useEffect(() => {
        if (externalIsRunning !== undefined) {
            setIsActive(externalIsRunning);
        }
    }, [externalIsRunning]);

    // Handle external remaining time
    useEffect(() => {
        if (externalRemainingTime !== undefined) {
            setRemainingTime(externalRemainingTime);
        }
    }, [externalRemainingTime]);

    // Initialize timer
    useEffect(() => {
        if (initialTime && initialTime > 0) {
            setTime(initialTime);
            if (externalRemainingTime === undefined) {
                setRemainingTime(initialTime);
            }
            setIsTimeSet(true);
        }
    }, [initialTime, externalRemainingTime]);

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        const isTimerRunning = externalIsRunning ?? isActive;

        if (isTimerRunning && remainingTime > 0) {
            interval = setInterval(() => {
                setRemainingTime(prev => {
                    const newTime = prev - 1;
                    if (newTime <= 0) {
                        if (onComplete) onComplete();
                        if (externalIsRunning === undefined) setIsActive(false);
                    }
                    return newTime;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive, externalIsRunning, remainingTime, onComplete]);

    const handleStart = () => {
        if (externalIsRunning === undefined) {
            toggleTimerActiveState(remainingTime, isActive, setIsActive);
        }
    };

    const handleResetTime = () => {
        if (externalIsRunning === undefined) {
            setIsActive(false);
            setRemainingTime(time);
        }
    };

    const handleSetNewTime = () => {
        if (externalIsRunning === undefined) {
            setIsActive(false);
            setIsTimeSet(false);
            setRemainingTime(0);
        }
    };

    const handleTime = (hours: number, minutes: number, seconds: number) => {
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        setTime(totalSeconds);
        setRemainingTime(totalSeconds);
        setIsTimeSet(true);
    };

    return (
        <Panel title="Countdown Timer">
            {!initialTime && <HomeButton />}
            {isTimeSet ? (
                <>
                    <TimeDisplay>{formatTime(remainingTime)}</TimeDisplay>
                    {description && <Description>{description}</Description>}
                    <Button onClick={handleStart}>{(externalIsRunning ?? isActive) ? 'Pause' : 'Start'}</Button>
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
