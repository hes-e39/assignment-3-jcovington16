import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatTime } from '../../utils/helpers';
import HomeButton from '../generic/HomeButton';
import Panel from '../generic/Panel';
import ResetButton from '../generic/ResetButton';
import RoundTimeInput from '../generic/RoundTimeInput';
import Button from '../generic/StartButton';

const TimeDisplay = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
  color: #2c3e50;
  font-weight: bold;
`;

interface StatusDisplayProps {
    $isWorkPhase: boolean;
}

const StatusDisplay = styled.div<StatusDisplayProps>`
  font-size: 2rem;
  color: ${props => (props.$isWorkPhase ? '#4caf50' : '#ff6b6b')};
  margin-bottom: 10px;
  font-weight: bold;
`;

const RoundDisplay = styled.div`
  font-size: 1.5rem;
  margin-top: 10px;
  color: #2c3e50;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const SettingsButton = styled(Button)`
  background-color: #2196f3;
  &:hover {
    background-color: #1976d2;
  }
`;

interface TabataProps {
    rounds?: number;
    workTime?: number;
    restTime?: number;
    onComplete?: () => void;
}

const Tabata: React.FC<TabataProps> = ({ onComplete }) => {
    const [workTime, setWorkTime] = useState(0);
    const [restTime, setRestTime] = useState(0);
    const [totalRounds, setTotalRounds] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [currentRound, setCurrentRound] = useState(1);
    const [isActive, setIsActive] = useState(false);
    const [isTimeSet, setIsTimeSet] = useState(false);
    const [isWorkPhase, setIsWorkPhase] = useState(true);

    const handleStart = () => {
        if (remainingTime > 0) {
            setIsActive(!isActive);
        }
    };

    const handleReset = () => {
        setIsActive(false);
        setRemainingTime(workTime);
        setCurrentRound(1);
        setIsWorkPhase(true);
    };

    const handleChangeSettings = () => {
        setIsActive(false);
        setIsTimeSet(false);
    };

    const handleTimeChange = (workMinutes: number, workSeconds: number, restMinutes: number, restSeconds: number, rounds: number) => {
        const totalWorkSeconds = workMinutes * 60 + workSeconds;
        const totalRestSeconds = restMinutes * 60 + restSeconds;
        setWorkTime(totalWorkSeconds);
        setRestTime(totalRestSeconds);
        setTotalRounds(rounds);
        setRemainingTime(totalWorkSeconds);
        setCurrentRound(1);
        setIsWorkPhase(true);
        setIsTimeSet(true);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isActive && remainingTime > 0) {
            interval = setInterval(() => setRemainingTime(prev => prev - 1), 1000);
        } else if (isActive && remainingTime === 0) {
            if (isWorkPhase) {
                setIsWorkPhase(false);
                setRemainingTime(restTime);
            } else {
                if (currentRound < totalRounds) {
                    setCurrentRound(prev => prev + 1);
                    setIsWorkPhase(true);
                    setRemainingTime(workTime);
                } else {
                    setIsActive(false);
                    if (onComplete) onComplete();
                }
            }
        }
        return () => clearInterval(interval);
    }, [isActive, remainingTime, isWorkPhase, currentRound, totalRounds, workTime, restTime, onComplete]);

    return (
        <Panel title="Tabata Timer">
            <HomeButton />
            {!isTimeSet ? (
                <RoundTimeInput onSetTime={handleTimeChange} label="Set Work/Rest Time and Rounds" />
            ) : (
                <>
                    <StatusDisplay $isWorkPhase={isWorkPhase}>{isWorkPhase ? 'WORK' : 'REST'}</StatusDisplay>
                    <TimeDisplay>{formatTime(remainingTime)}</TimeDisplay>
                    <RoundDisplay>
                        Round {currentRound} of {totalRounds}
                    </RoundDisplay>
                    <ButtonGroup>
                        <Button onClick={handleStart}>{isActive ? 'Pause' : 'Start'}</Button>
                        <ResetButton onClick={handleReset}>Reset</ResetButton>
                        <SettingsButton onClick={handleChangeSettings}>Change Settings</SettingsButton>
                    </ButtonGroup>
                </>
            )}
        </Panel>
    );
};

export default Tabata;
