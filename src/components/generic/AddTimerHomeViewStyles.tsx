import styled from 'styled-components';

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

export const ConfigSection = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Original gap */
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 10px; /* Original gap */
  align-items: center;
  margin-bottom: 10px;

  label {
    display: flex;
    gap: 8px;
    align-items: center;
    font-size: 0.85rem; /* Slightly smaller text size */
    font-weight: bold;
    color: #333;
  }

  input, select {
    padding: 4px 8px; /* Smaller padding for a compact size */
    font-size: 0.85rem; /* Adjust font size to match label */
    border: 1px solid #ccc;
    border-radius: 4px;
    color: white;
    width: 100%; /* Ensure full width in their container */
    max-width: 150px; /* Limit maximum size for smaller inputs */
  }
`;

export const AddButton = styled.button`
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
