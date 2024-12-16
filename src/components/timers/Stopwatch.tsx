import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatTime } from '../../utils/helpers';
import HomeButton from '../generic/HomeButton';
import Panel from '../generic/Panel';
import ResetButton from '../generic/ResetButton';
import Button from '../generic/StartButton';

const TimeDisplay = styled.div`
    font-size: 3rem;
    margin-bottom: 20px;
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

interface StopwatchProps {
    isRunning?: boolean;
    remainingTime?: number;
    onComplete?: () => void;
    description?: string;
    duration?: number;
}

const Stopwatch: React.FC<StopwatchProps> = ({ isRunning: externalIsRunning, remainingTime: externalTime, description, duration = 0, onComplete }) => {
    const [time, setTime] = useState(externalTime ?? 0);
    const [isActive, setIsActive] = useState(false);

    // Handle external running state
    useEffect(() => {
        if (externalIsRunning !== undefined) {
            setIsActive(externalIsRunning);
        }
    }, [externalIsRunning]);

    // Handle external time
    useEffect(() => {
        if (externalTime !== undefined) {
            setTime(externalTime);
        }
    }, [externalTime]);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        const isTimerRunning = externalIsRunning ?? isActive;

        if (isTimerRunning) {
            interval = setInterval(() => {
                setTime(prevTime => {
                    const newTime = prevTime + 1;
                    if (duration > 0 && newTime >= duration) {
                        if (onComplete) onComplete();
                        if (externalIsRunning === undefined) setIsActive(false);
                        return duration;
                    }
                    return newTime;
                });
            }, 1000); // Changed to 1000ms (1 second)
        }

        return () => clearInterval(interval);
    }, [isActive, externalIsRunning, duration, onComplete]);

    const handleStart = () => {
        if (externalIsRunning === undefined) {
            setIsActive(!isActive);
        }
    };

    const handleReset = () => {
        if (externalIsRunning === undefined) {
            setIsActive(false);
            setTime(0);
        }
    };

    return (
        <Panel title="Stopwatch">
            {!duration && <HomeButton />}
            <TimeDisplay>{formatTime(time)}</TimeDisplay>
            {description && <Description>{description}</Description>}
            <Button onClick={handleStart}>{(externalIsRunning ?? isActive) ? 'Pause' : 'Start'}</Button>
            <ResetButton onClick={handleReset}>Reset</ResetButton>
        </Panel>
    );
};

export default Stopwatch;
