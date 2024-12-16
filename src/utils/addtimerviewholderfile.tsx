// import { useContext, useState } from 'react';
// import styled from 'styled-components';
// import TimerContext from '../components/contex/TimerContext';
// import Countdown from '../components/timers/Countdown';
// import Stopwatch from '../components/timers/Stopwatch';
// import Tabata from '../components/timers/Tabata';
// import XY from '../components/timers/XY';
// import WorkoutShareControls from '../utils/WorkoutShare';
// import {
//     formatTotalTime,
//     workoutControls,
//     addTimer,
//     Timer
// } from '../utils/helpers';

// const Container = styled.div`
//   padding: 20px;
//   max-width: 800px;
//   margin: 0 auto;
//   color: black;
//   background-color: white;
// `;

// const TimerQueue = styled.div`
//   margin-top: 20px;
//   padding: 20px;
//   background-color: #f5f5f5;
//   border-radius: 8px;
// `;

// const TotalTimeDisplay = styled.div`
//   margin: 10px 0;
//   padding: 10px;
//   background-color: #e8f5e9;
//   border-radius: 4px;
//   font-size: 1.1rem;
//   color: #2e7d32;
//   display: flex;
//   align-items: center;
//   gap: 8px;

//   span {
//     font-weight: bold;
//   }
// `;

// interface QueueItemProps {
//     $isActive: boolean;
// }

// const QueueItem = styled.div<QueueItemProps>`
//   padding: 15px;
//   margin: 10px 0;
//   background-color: ${props => (props.$isActive ? '#e0f7fa' : 'white')};
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;

// const ControlButton = styled.button`
//   padding: 8px 16px;
//   margin: 0 5px;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-weight: bold;

//   &.start {
//     background-color: #4caf50;
//     color: white;
//   }

//   &.reset {
//     background-color: #ff9800;
//     color: white;
//   }

//   &.forward {
//     background-color: #2196f3;
//     color: white;
//   }

//   &:hover {
//     opacity: 0.9;
//   }
// `;

// const ConfigSection = styled.div`
//   margin: 20px 0;
//   display: flex;
//   flex-direction: column;
//   gap: 10px;
// `;

// const InputGroup = styled.div`
//   display: flex;
//   gap: 10px;
//   align-items: center;
//   margin-bottom: 10px;

//   label {
//     display: flex;
//     gap: 8px;
//     align-items: center;
//     background-color: white;
//   }

//   input, select {
//     padding: 5px;
//     border: 1px solid #ddd;
//     border-radius: 4px;
//     color: white;
//   }
// `;

// const AddButton = styled.button`
//   padding: 10px 20px;
//   background-color: #4caf50;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-weight: bold;
//   margin-top: 10px;

//   &:hover {
//     background-color: #45a049;
//   }
// `;

// interface CountdownProps {
//     initialTime: number;
//     onComplete?: () => void;
// }

// interface StopwatchProps {
//     onComplete?: () => void;
// }

// interface XYProps {
//     rounds?: number;
//     timePerRound?: number;
//     onComplete?: () => void;
// }

// interface TabataProps {
//     rounds?: number;
//     workTime?: number;
//     restTime?: number;
//     onComplete?: () => void;
// }

// const AddTimerHomeView: React.FC = () => {
//     const { state, dispatch } = useContext(TimerContext);
//     const [type, setType] = useState<string>('stopwatch');
//     const [duration, setDuration] = useState<number>(30);
//     const [workTime, setWorkTime] = useState<number>(20);
//     const [restTime, setRestTime] = useState<number>(10);
//     const [rounds, setRounds] = useState<number>(8);
//     const [activeTimerIndex, setActiveTimerIndex] = useState<number | null>(null);
//     const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);

//     const handleAddTimer = () => {
//         addTimer({
//             type,
//             duration,
//             rounds,
//             workTime,
//             restTime
//         }, dispatch);
//     };

//     const workoutControlProps = {
//         activeTimerIndex,
//         isWorkoutRunning,
//         timers: state.timers,
//         dispatch,
//         setActiveTimerIndex,
//         setIsWorkoutRunning
//     };

//     const startWorkout = () => {
//         if (!isWorkoutRunning && state.timers.length > 0) {
//             setActiveTimerIndex(0);
//             setIsWorkoutRunning(true);
//             dispatch({ type: 'START_TIMER', payload: 0 });
//         } else {
//             setIsWorkoutRunning(false);
//         }
//         dispatch({ type: 'PAUSE_RESUME_WORKOUT' });
//     };

//     const resetWorkout = () => {
//         setActiveTimerIndex(null);
//         setIsWorkoutRunning(false);
//         dispatch({ type: 'RESET_WORKOUT' });
//     };

//     const fastForward = () => {
//         if (activeTimerIndex !== null) {
//             const nextIndex = activeTimerIndex + 1;
//             if (nextIndex < state.timers.length) {
//                 setActiveTimerIndex(nextIndex);
//                 dispatch({ type: 'FAST_FORWARD' });
//             } else {
//                 setActiveTimerIndex(null);
//                 setIsWorkoutRunning(false);
//             }
//         }
//     };

//     const removeTimer = (index: number) => {
//         dispatch({ type: 'REMOVE_TIMER', payload: index });
//         if (index === activeTimerIndex) {
//             setActiveTimerIndex(null);
//             setIsWorkoutRunning(false);
//         }
//     };

//     const renderActiveTimer = () => {
//         if (activeTimerIndex === null || !state.timers[activeTimerIndex]) return null;

//         const timer = state.timers[activeTimerIndex];

//         switch (timer.type) {
//             case 'countdown': {
//                 const CountdownTimer = Countdown as React.FC<CountdownProps>;
//                 return (
//                     <div>
//                         <CountdownTimer
//                             key={timer.id}
//                             initialTime={Number(timer.duration)}
//                             onComplete={() => {
//                                 if (activeTimerIndex < state.timers.length - 1) {
//                                     fastForward();
//                                 }
//                             }}
//                         />
//                     </div>
//                 );
//             }

//             case 'stopwatch': {
//                 const StopwatchTimer = Stopwatch as React.FC<StopwatchProps>;
//                 return (
//                     <StopwatchTimer
//                         key={timer.id}
//                         onComplete={() => {
//                             if (activeTimerIndex < state.timers.length - 1) {
//                                 fastForward();
//                             }
//                         }}
//                     />
//                 );
//             }

//             case 'xy': {
//                 const XYTimer = XY as React.FC<XYProps>;
//                 return (
//                     <XYTimer
//                         key={timer.id}
//                         rounds={timer.config?.rounds}
//                         timePerRound={timer.config?.timePerRound}
//                         onComplete={() => {
//                             if (activeTimerIndex < state.timers.length - 1) {
//                                 fastForward();
//                             }
//                         }}
//                     />
//                 );
//             }

//             case 'tabata': {
//                 const TabataTimer = Tabata as React.FC<TabataProps>;
//                 return (
//                     <TabataTimer
//                         key={timer.id}
//                         rounds={timer.config?.rounds}
//                         workTime={timer.config?.workTime}
//                         restTime={timer.config?.restTime}
//                         onComplete={() => {
//                             if (activeTimerIndex < state.timers.length - 1) {
//                                 fastForward();
//                             }
//                         }}
//                     />
//                 );
//             }

//             default:
//                 return null;
//         }
//     };

//     return (
//         <Container>
//             <h1>Add a Timer</h1>

//             <WorkoutShareControls />

//             <ConfigSection>
//                 <InputGroup>
//                     <label>
//                         Timer Type:
//                         <select value={type} onChange={e => setType(e.target.value)}>
//                             <option value="stopwatch">Stopwatch</option>
//                             <option value="countdown">Countdown</option>
//                             <option value="xy">XY Timer</option>
//                             <option value="tabata">Tabata</option>
//                         </select>
//                     </label>
//                 </InputGroup>

//                 {type === 'countdown' && (
//                     <InputGroup>
//                         <label>
//                             Duration (seconds):
//                             <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={1} />
//                         </label>
//                     </InputGroup>
//                 )}

//                 {type === 'xy' && (
//                     <InputGroup>
//                         <label>
//                             Round Duration (seconds):
//                             <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} min={1} />
//                         </label>
//                         <label>
//                             Number of Rounds:
//                             <input type="number" value={rounds} onChange={e => setRounds(Number(e.target.value))} min={1} />
//                         </label>
//                     </InputGroup>
//                 )}

//                 {type === 'tabata' && (
//                     <>
//                         <InputGroup>
//                             <label>
//                                 Work Time (seconds):
//                                 <input type="number" value={workTime} onChange={e => setWorkTime(Number(e.target.value))} min={1} />
//                             </label>
//                             <label>
//                                 Rest Time (seconds):
//                                 <input type="number" value={restTime} onChange={e => setRestTime(Number(e.target.value))} min={1} />
//                             </label>
//                         </InputGroup>
//                         <InputGroup>
//                             <label>
//                                 Rounds:
//                                 <input type="number" value={rounds} onChange={e => setRounds(Number(e.target.value))} min={1} />
//                             </label>
//                         </InputGroup>
//                     </>
//                 )}

//                 <AddButton onClick={handleAddTimer}>Add Timer</AddButton>
//             </ConfigSection>

//             <TimerQueue>
//                 <h2>Workout Queue ({state.timers.length} timers)</h2>
//                 <TotalTimeDisplay>
//                     Total Workout Time: <span>{formatTotalTime(state.totalTime)}</span>
//                 </TotalTimeDisplay>
//                 <div>
//                     <ControlButton className="start" onClick={startWorkout}>
//                         {isWorkoutRunning ? 'Pause' : 'Start Workout'}
//                     </ControlButton>
//                     <ControlButton className="reset" onClick={resetWorkout}>
//                         Reset
//                     </ControlButton>
//                     <ControlButton className="forward" onClick={fastForward}>
//                         Skip Timer
//                     </ControlButton>
//                 </div>

//                 {state.timers.map((timer, index) => (
//                     <QueueItem key={timer.id} $isActive={index === activeTimerIndex}>
//                         <div>
//                             {timer.type} - {formatTotalTime(timer.duration)}
//                             {timer.config && ` - ${timer.config.rounds} rounds`}
//                         </div>
//                         <button onClick={() => removeTimer(index)}>Remove</button>
//                     </QueueItem>
//                 ))}

//                 {activeTimerIndex !== null && renderActiveTimer()}
//             </TimerQueue>
//         </Container>
//     );
// };

// export default AddTimerHomeView;

// import { DragDropContext, Draggable, type DropResult, Droppable } from 'react-beautiful-dnd';
// import styled from 'styled-components';
// import type { Timer } from '../utils/helpers';
// import { formatTotalTime } from '../utils/helpers';

// interface TimerQueueProps {
//     activeTimerIndex: number | null;
//     onRemoveTimer: (index: number) => void;
//     updateUrl?: (timers: Timer[]) => void;
//     timers: Timer[];
//     onTimersReorder: (newTimers: Timer[], newActiveIndex: number | null) => void;
// }

// interface QueueItemProps {
//     $isActive: boolean;
//     $isDragging: boolean;
// }

// const QueueContainer = styled.div`
//   margin-top: 20px;
//   background-color: #f5f5f5;
//   border-radius: 8px;
// `;

// const DroppableArea = styled.div`
//   padding: 20px;
//   min-height: 100px;
// `;

// const DraggableItem = styled.div<QueueItemProps>`
//   padding: 15px;
//   margin: 10px 0;
//   background-color: ${props => {
//       if (props.$isDragging) return '#e3f2fd';
//       return props.$isActive ? '#e0f7fa' : 'white';
//   }};
//   border: 1px solid #ddd;
//   border-radius: 4px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   user-select: none;
//   transform: ${props => (props.$isDragging ? 'scale(1.02)' : 'none')};
//   transition: transform 0.2s, background-color 0.2s;

//   &:hover {
//     cursor: grab;
//   }
// `;

// const DragHandle = styled.div`
//   padding: 10px;
//   margin-right: 8px;
//   font-size: 18px;
//   color: #757575;
//   cursor: grab;

//   &:hover {
//     color: #424242;
//   }

//   &:active {
//     cursor: grabbing;
//   }
// `;

// const RemoveButton = styled.button`
//   padding: 4px 8px;
//   background-color: #ff5252;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;

//   &:hover {
//     background-color: #ff1744;
//   }
// `;

// const TimerQueue: React.FC<TimerQueueProps> = ({ activeTimerIndex, onRemoveTimer, updateUrl, timers, onTimersReorder }) => {
//     const handleDragEnd = (result: DropResult): void => {
//         if (!result.destination) return;

//         const startIndex = result.source.index;
//         const endIndex = result.destination.index;

//         if (startIndex === endIndex) return;

//         const newTimers = Array.from(timers);
//         const [removed] = newTimers.splice(startIndex, 1);
//         newTimers.splice(endIndex, 0, removed);

//         let newActiveIndex: number | null = activeTimerIndex;
//         if (activeTimerIndex === startIndex) {
//             newActiveIndex = endIndex;
//         } else if (activeTimerIndex !== null) {
//             if (startIndex < activeTimerIndex && endIndex >= activeTimerIndex) {
//                 newActiveIndex = activeTimerIndex - 1;
//             } else if (startIndex > activeTimerIndex && endIndex <= activeTimerIndex) {
//                 newActiveIndex = activeTimerIndex + 1;
//             }
//         }

//         onTimersReorder(newTimers, newActiveIndex);
//         if (updateUrl) updateUrl(newTimers);
//     };

//     const handleRemoveClick = (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
//         event.preventDefault();
//         event.stopPropagation();
//         onRemoveTimer(index);
//     };

//     return (
//         <QueueContainer>
//             <DragDropContext onDragEnd={handleDragEnd}>
//                 <Droppable droppableId="timer-queue-list">
//                     {(provided, snapshot) => (
//                         <DroppableArea
//                             ref={provided.innerRef}
//                             {...provided.droppableProps}
//                             style={{
//                                 backgroundColor: snapshot.isDraggingOver ? '#f0f0f0' : 'transparent',
//                             }}
//                         >
//                             {timers.map((timer, index) => (
//                                 <Draggable key={timer.id.toString()} draggableId={timer.id.toString()} index={index}>
//                                     {(provided, snapshot) => (
//                                         <DraggableItem ref={provided.innerRef} {...provided.draggableProps} $isActive={index === activeTimerIndex} $isDragging={snapshot.isDragging}>
//                                             <div style={{ display: 'flex', alignItems: 'center' }}>
//                                                 <div {...provided.dragHandleProps}>
//                                                     <DragHandle>⋮⋮</DragHandle>
//                                                 </div>
//                                                 <div>
//                                                     {timer.type} - {formatTotalTime(timer.duration)}
//                                                     {timer.config && ` - ${timer.config.rounds} rounds`}
//                                                 </div>
//                                             </div>
//                                             <RemoveButton onClick={handleRemoveClick(index)}>Remove</RemoveButton>
//                                         </DraggableItem>
//                                     )}
//                                 </Draggable>
//                             ))}
//                             {provided.placeholder}
//                         </DroppableArea>
//                     )}
//                 </Droppable>
//             </DragDropContext>
//         </QueueContainer>
//     );
// };

// export default TimerQueue;
