import styled from 'styled-components';
import Button from './StartButton';

export const Container = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    color: black;
    background-color: white;
`;

export const TimerQueue = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

export const TotalTimeDisplay = styled.div`
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

export const QueueItem = styled.div<QueueItemProps>`
  padding: 15px;
  margin: 10px 0;
  background-color: ${props => (props.$isActive ? '#e0f7fa' : 'white')};
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ControlButton = styled.button`
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

export const InputGroup = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;

    label {
        display: flex;
        gap: 8px;
        align-items: center;
        background-color: white;
    }

    input, select {
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        color: black;
    }
`;

export const AddButton = styled(Button)`
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

export const DescriptionInput = styled.textarea`
    width: 100%;
    padding: 8px;
    margin: 8px 0;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    min-height: 60px;
`;

export const ConfigSection = styled.div`
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const WorkoutControls = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;

    button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s;

        &:first-child {
            background-color: #2196f3;
            color: white;

            &:hover {
                background-color: #1976d2;
            }
        }

        &:not(:first-child) {
            background-color: #f5f5f5;
            color: #333;

            &:hover {
                background-color: #e0e0e0;
            }
        }
    }
`;

export const ActiveTimerContainer = styled.div`
    margin: 20px 0;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;
