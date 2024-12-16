import { useContext } from 'react';
import styled from 'styled-components';
import TimerContext from '../components/contex/TimerContext';
import { formatTotalTime } from '../utils/helpers';

const Container = styled.div`
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
`;

const WorkoutCard = styled.div`
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const WorkoutDate = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: #2196f3;
`;

const TimerList = styled.div`
    margin-top: 10px;
`;

const TimerItem = styled.div`
    padding: 10px;
    border-left: 3px solid #4caf50;
    margin: 5px 0;
    background: #f5f5f5;
`;

const TotalTime = styled.div`
    font-size: 1.1rem;
    color: #666;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #eee;
`;

const NoWorkouts = styled.div`
    text-align: center;
    padding: 40px;
    color: #666;
    font-size: 1.2rem;
`;

const WorkoutHistoryView = () => {
    const { state } = useContext(TimerContext);

    if (!state.workoutHistory?.length) {
        return (
            <Container>
                <NoWorkouts>No completed workouts yet!</NoWorkouts>
            </Container>
        );
    }

    return (
        <Container>
            <h1>Workout History</h1>
            {state.workoutHistory.map(workout => (
                <WorkoutCard key={workout.id}>
                    <WorkoutDate>
                        {new Date(workout.date).toLocaleDateString()} {new Date(workout.date).toLocaleTimeString()}
                    </WorkoutDate>
                    <TimerList>
                        {workout.timers.map(timer => (
                            <TimerItem key={timer.id}>
                                <div>
                                    <strong>{timer.type.toUpperCase()}</strong>
                                    {timer.description && <div>Description: {timer.description}</div>}
                                    <div>Duration: {formatTotalTime(timer.duration)}</div>
                                    {timer.config?.rounds && <div>Rounds: {timer.config.rounds}</div>}
                                    {timer.config?.workTime && (
                                        <div>
                                            Work: {formatTotalTime(timer.config.workTime)}, Rest: {formatTotalTime(timer.config.restTime || 0)}
                                        </div>
                                    )}
                                </div>
                            </TimerItem>
                        ))}
                    </TimerList>
                    <TotalTime>Total Workout Time: {formatTotalTime(workout.totalTime)}</TotalTime>
                </WorkoutCard>
            ))}
        </Container>
    );
};

export default WorkoutHistoryView;
