import { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import TimerContext from '../components/contex/TimerContext';

const ShareContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ShareButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #007bff;
  }
`;

const ShareIcon = styled.svg`
  width: 20px;
  height: 20px;
`;

const Alert = styled.div`
  padding: 12px 20px;
  background-color: #4caf50;
  color: white;
  border-radius: 8px;
  font-size: 1rem;
`;

const WorkoutShareControls = () => {
    const { state, dispatch } = useContext(TimerContext);
    const [searchParams, setSearchParams] = useSearchParams();

    // Load state from URL on mount
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const timerParam = searchParams.get('workout');
        if (timerParam) {
            try {
                const decodedTimers = JSON.parse(atob(timerParam));

                // Validate the structure of decoded timers
                if (Array.isArray(decodedTimers) && decodedTimers.every(timer => timer.id && timer.type && typeof timer.duration === 'number')) {
                    dispatch({ type: 'LOAD_TIMERS', payload: decodedTimers });
                }
            } catch (error) {
                console.error('Failed to load workout from URL:', error);
            }
        }
    }, []);

    const handleSaveToUrl = () => {
        if (state.timers.length === 0) {
            return;
        }

        // Create a simplified version of timers for URL sharing
        const shareableTimers = state.timers.map(timer => ({
            id: timer.id,
            type: timer.type,
            duration: timer.duration,
            config: timer.config,
        }));

        // Encode timers as base64 to make URL-friendly
        const encodedTimers = btoa(JSON.stringify(shareableTimers));
        setSearchParams({ workout: encodedTimers });
    };

    return (
        <ShareContainer>
            <ShareButton onClick={handleSaveToUrl} disabled={state.timers.length === 0}>
                <ShareIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                </ShareIcon>
                Save Workout URL
            </ShareButton>

            {searchParams.has('workout') && <Alert>Workout URL saved! You can now share this URL to load this workout configuration.</Alert>}
        </ShareContainer>
    );
};

export default WorkoutShareControls;
