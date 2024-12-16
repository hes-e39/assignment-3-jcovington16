import { useState } from 'react';
import styled from 'styled-components';
import Button from './StartButton';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  color: #2c3e50;
`;

const Dropdown = styled.select`
  margin: 5px;
  padding: 5px;
  font-size: 1.2rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  color: #2c3e50;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }

  option {
    background-color: white;
    color: #2c3e50;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin: 10px 0;
`;

const Label = styled.label`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #2c3e50;
`;

const RoundTimeInput = ({
    onSetTime,
    label,
}: {
    onSetTime: (workMinutes: number, workSeconds: number, restMinutes: number, restSeconds: number, rounds: number) => void;
    label: string;
}) => {
    const [workMinutes, setWorkMinutes] = useState(0);
    const [workSeconds, setWorkSeconds] = useState(20); // Default 20 seconds work
    const [restMinutes, setRestMinutes] = useState(0);
    const [restSeconds, setRestSeconds] = useState(10); // Default 10 seconds rest
    const [rounds, setRounds] = useState(8); // Default 8 rounds

    const handleSetTime = () => {
        onSetTime(workMinutes, workSeconds, restMinutes, restSeconds, rounds);
    };

    return (
        <InputContainer>
            <Label>{label}</Label>
            <InputGroup>
                <Dropdown value={workMinutes} onChange={e => setWorkMinutes(Number(e.target.value))}>
                    {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>
                            {i} Work min
                        </option>
                    ))}
                </Dropdown>
                <Dropdown value={workSeconds} onChange={e => setWorkSeconds(Number(e.target.value))}>
                    {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>
                            {i} Work sec
                        </option>
                    ))}
                </Dropdown>
                <Dropdown value={restMinutes} onChange={e => setRestMinutes(Number(e.target.value))}>
                    {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>
                            {i} Rest min
                        </option>
                    ))}
                </Dropdown>
                <Dropdown value={restSeconds} onChange={e => setRestSeconds(Number(e.target.value))}>
                    {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i}>
                            {i} Rest sec
                        </option>
                    ))}
                </Dropdown>
                <Dropdown value={rounds} onChange={e => setRounds(Number(e.target.value))}>
                    {Array.from({ length: 100 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                            {num} Rounds
                        </option>
                    ))}
                </Dropdown>
            </InputGroup>
            <Button onClick={handleSetTime}>Set Timer</Button>
        </InputContainer>
    );
};

export default RoundTimeInput;
