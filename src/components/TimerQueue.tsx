// import { useContext } from 'react';
// import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
// import styled from 'styled-components';
// import { type Timer, formatTime } from '../utils/helpers';
// import TimerContext from './contex/TimerContext';

// interface QueueItemProps {
//     $isActive: boolean;
//     $isDragging: boolean;
// }

// const QueueItem = styled.div<QueueItemProps>`
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

//   /* Add a subtle transform when dragging */
//   transform: ${props => (props.$isDragging ? 'scale(1.02)' : 'none')};
//   transition: transform 0.2s;

//   /* Grab cursor on hover */
//   &:hover {
//     cursor: grab;
//   }
// `;

// const Controls = styled.div`
//   display: flex;
//   gap: 8px;
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

// interface TimerQueueProps {
//     activeTimerIndex: number | null;
//     onRemoveTimer: (index: number) => void;
//     updateUrl: (timers: Timer[]) => void;
// }

// const TimerQueue = ({ activeTimerIndex, onRemoveTimer, updateUrl }: TimerQueueProps) => {
//     const { state, dispatch } = useContext(TimerContext);

//     // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//     const handleDragEnd = (result: any) => {
//         if (!result.destination) return;

//         const startIndex = result.source.index;
//         const endIndex = result.destination.index;

//         // Don't do anything if dropped in the same place
//         if (startIndex === endIndex) return;

//         // Create new array with reordered timers
//         const newTimers = Array.from(state.timers);
//         const [removed] = newTimers.splice(startIndex, 1);
//         newTimers.splice(endIndex, 0, removed);

//         // Calculate the new active index
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

//         dispatch({
//             type: 'REORDER_TIMERS',
//             payload: {
//                 timers: newTimers,
//                 newActiveIndex,
//             },
//         });

//         // Update URL with new order
//         updateUrl(newTimers);
//     };

//     return (
//         <DragDropContext onDragEnd={handleDragEnd}>
//             <Droppable droppableId="timer-queue">
//                 {provided => (
//                     <div ref={provided.innerRef} {...provided.droppableProps}>
//                         {state.timers.map((timer, index) => (
//                             <Draggable key={timer.id.toString()} draggableId={timer.id.toString()} index={index}>
//                                 {(provided, snapshot) => (
//                                     <QueueItem
//                                         ref={provided.innerRef}
//                                         {...provided.draggableProps}
//                                         {...provided.dragHandleProps}
//                                         $isActive={index === activeTimerIndex}
//                                         $isDragging={snapshot.isDragging}
//                                     >
//                                         <div {...provided.dragHandleProps}>
//                                             h<DragHandle>⋮⋮</DragHandle>
//                                         </div>
//                                         <div>
//                                             {timer.type} - {formatTime(timer.duration)}
//                                             {timer.config && ` - ${timer.config.rounds} rounds`}
//                                         </div>
//                                         <Controls>
//                                             <RemoveButton onClick={() => onRemoveTimer(index)}>Remove</RemoveButton>
//                                         </Controls>
//                                     </QueueItem>
//                                 )}
//                             </Draggable>
//                         ))}
//                         {provided.placeholder}
//                     </div>
//                 )}
//             </Droppable>
//         </DragDropContext>
//     );
// };

// export default TimerQueue;

import type React from 'react';
import { DragDropContext, Draggable, type DropResult, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import type { Timer } from '../utils/helpers';
import { formatTotalTime } from '../utils/helpers';

interface TimerQueueProps {
    activeTimerIndex: number | null;
    onRemoveTimer: (index: number) => void;
    updateUrl?: (timers: Timer[]) => void;
    timers: Timer[];
    onTimersReorder: (newTimers: Timer[], newActiveIndex: number | null) => void;
}

interface QueueItemProps {
    $isActive: boolean;
    $isDragging: boolean;
}

const QueueContainer = styled.div`
  margin-top: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

const DroppableArea = styled.div`
  padding: 20px;
  min-height: 100px;
`;

const DraggableItem = styled.div<QueueItemProps>`
  padding: 15px;
  margin: 10px 0;
  background-color: ${props => {
      if (props.$isDragging) return '#e3f2fd';
      return props.$isActive ? '#e0f7fa' : 'white';
  }};
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  transform: ${props => (props.$isDragging ? 'scale(1.02)' : 'none')};
  transition: transform 0.2s, background-color 0.2s;

  &:hover {
    cursor: grab;
  }
`;

const DragHandle = styled.div`
  padding: 10px;
  margin-right: 8px;
  font-size: 18px;
  color: #757575;
  cursor: grab;

  &:hover {
    color: #424242;
  }

  &:active {
    cursor: grabbing;
  }
`;

const RemoveButton = styled.button`
  padding: 4px 8px;
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #ff1744;
  }
`;

const TimerQueue: React.FC<TimerQueueProps> = ({ activeTimerIndex, onRemoveTimer, updateUrl, timers, onTimersReorder }) => {
    const handleDragEnd = (result: DropResult): void => {
        if (!result.destination) return;

        const startIndex = result.source.index;
        const endIndex = result.destination.index;

        if (startIndex === endIndex) return;

        const newTimers = Array.from(timers);
        const [removed] = newTimers.splice(startIndex, 1);
        newTimers.splice(endIndex, 0, removed);

        let newActiveIndex: number | null = activeTimerIndex;
        if (activeTimerIndex === startIndex) {
            newActiveIndex = endIndex;
        } else if (activeTimerIndex !== null) {
            if (startIndex < activeTimerIndex && endIndex >= activeTimerIndex) {
                newActiveIndex = activeTimerIndex - 1;
            } else if (startIndex > activeTimerIndex && endIndex <= activeTimerIndex) {
                newActiveIndex = activeTimerIndex + 1;
            }
        }

        onTimersReorder(newTimers, newActiveIndex);
        if (updateUrl) updateUrl(newTimers);
    };

    const handleRemoveClick = (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onRemoveTimer(index);
    };

    return (
        <QueueContainer>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="timer-queue-list">
                    {(provided, snapshot) => (
                        <DroppableArea
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                                backgroundColor: snapshot.isDraggingOver ? '#f0f0f0' : 'transparent',
                            }}
                        >
                            {timers.map((timer, index) => (
                                <Draggable key={timer.id.toString()} draggableId={timer.id.toString()} index={index}>
                                    {(provided, snapshot) => (
                                        <DraggableItem ref={provided.innerRef} {...provided.draggableProps} $isActive={index === activeTimerIndex} $isDragging={snapshot.isDragging}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <div {...provided.dragHandleProps}>
                                                    <DragHandle>⋮⋮</DragHandle>
                                                </div>
                                                <div>
                                                    {timer.type} - {formatTotalTime(timer.duration)}
                                                    {timer.config && ` - ${timer.config.rounds} rounds`}
                                                </div>
                                            </div>
                                            <RemoveButton onClick={handleRemoveClick(index)}>Remove</RemoveButton>
                                        </DraggableItem>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </DroppableArea>
                    )}
                </Droppable>
            </DragDropContext>
        </QueueContainer>
    );
};

export default TimerQueue;
