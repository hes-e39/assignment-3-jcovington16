import { useState } from 'react';
import styled from 'styled-components';
import Button from './StartButton';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const Dropdown = styled.select`
  margin: 5px;
  padding: 5px;
  font-size: 1.2rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  color: black;
  background-color: white;
`;

const RoundTimeInput = ({
    onSetTime,
    label,
}: {
    onSetTime: (hours: number, minutes: number, seconds: number, rounds: number) => void;
    label: string;
}) => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [rounds, setRounds] = useState(1);

    const handleSetTime = () => {
        onSetTime(hours, minutes, seconds, rounds);
    };

    return (
        <InputContainer>
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
            <label>{label}</label>
            <div>
                <Dropdown value={hours} onChange={e => setHours(Number(e.target.value))}>
                    {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                            {i} hrs
                        </option>
                    ))}
                </Dropdown>
                <Dropdown value={minutes} onChange={e => setMinutes(Number(e.target.value))}>
                    {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>
                            {i} min
                        </option>
                    ))}
                </Dropdown>
                <Dropdown value={seconds} onChange={e => setSeconds(Number(e.target.value))}>
                    {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>
                            {i} sec
                        </option>
                    ))}
                </Dropdown>
                <Dropdown value={rounds} onChange={e => setRounds(Number(e.target.value))}>
                    {Array.from({ length: 20 }, (_, i) => (
                        <option key={i} value={i + 1}>
                            {i + 1} rounds
                        </option>
                    ))}
                </Dropdown>
            </div>
            <Button onClick={handleSetTime}>Set Round Time</Button>
        </InputContainer>
    );
};

export default RoundTimeInput;
