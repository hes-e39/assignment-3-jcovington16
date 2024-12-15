// import type React from 'react';
// import { DragDropContext, Draggable, type DropResult, Droppable } from 'react-beautiful-dnd';
// import type { Timer } from '../utils/helpers';
// import { formatTotalTime } from '../utils/helpers';

// interface TimerQueueProps {
//     timers: Timer[];
//     activeTimerIndex: number | null;
//     onRemoveTimer: (index: number) => void;
//     onTimersReorder: (newTimers: Timer[], newActiveIndex: number | null) => void;
// }

// const grid = 8;

// // biome-ignore lint/suspicious/noExplicitAny: <explanation>
// const getItemStyle = (isDragging: boolean, draggableStyle: any, isActive: boolean) => ({
//     userSelect: 'none',
//     padding: grid * 2,
//     margin: `0 0 ${grid}px 0`,
//     background: isDragging ? 'lightgreen' : isActive ? '#e0f7fa' : 'white',
//     border: '1px solid #ddd',
//     borderRadius: '4px',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     ...draggableStyle,
// });

// const getListStyle = (isDraggingOver: boolean) => ({
//     background: isDraggingOver ? 'lightblue' : '#f5f5f5',
//     padding: grid,
//     borderRadius: '8px',
//     minHeight: '100px',
//     width: '100%', // Added to ensure full width
//     marginTop: '20px',
// });

// const TimerQueue: React.FC<TimerQueueProps> = ({ timers, activeTimerIndex, onRemoveTimer, onTimersReorder }) => {
//     const onDragEnd = (result: DropResult) => {
//         if (!result.destination) {
//             return;
//         }

//         const startIndex = result.source.index;
//         const endIndex = result.destination.index;

//         if (startIndex === endIndex) {
//             return;
//         }

//         const newTimers = Array.from(timers);
//         const [removed] = newTimers.splice(startIndex, 1);
//         newTimers.splice(endIndex, 0, removed);

//         const newActiveIndex =
//             activeTimerIndex === startIndex
//                 ? endIndex
//                 : activeTimerIndex !== null && startIndex < activeTimerIndex && endIndex >= activeTimerIndex
//                   ? activeTimerIndex - 1
//                   : activeTimerIndex !== null && startIndex > activeTimerIndex && endIndex <= activeTimerIndex
//                     ? activeTimerIndex + 1
//                     : activeTimerIndex;

//         onTimersReorder(newTimers, newActiveIndex);
//     };

//     if (!timers.length) {
//         return (
//             <div style={getListStyle(false)}>
//                 <div style={{ textAlign: 'center', color: '#666' }}>Add timers to your workout</div>
//             </div>
//         );
//     }

//     return (
//         <DragDropContext onDragEnd={onDragEnd}>
//             <Droppable droppableId="droppable">
//                 {(provided, snapshot) => (
//                     <div ref={provided.innerRef} {...provided.droppableProps} style={getListStyle(snapshot.isDraggingOver)}>
//                         {timers.map((timer, index) => (
//                             <Draggable key={timer.id.toString()} draggableId={timer.id.toString()} index={index}>
//                                 {(provided, snapshot) => (
//                                     <div ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, index === activeTimerIndex)}>
//                                         <div style={{ display: 'flex', alignItems: 'center' }}>
//                                             <div {...provided.dragHandleProps} style={{ cursor: 'grab', padding: '0 8px' }}>
//                                                 ⋮⋮
//                                             </div>
//                                             <span>
//                                                 {timer.type} - {formatTotalTime(timer.duration)}
//                                                 {timer.config && ` - ${timer.config.rounds} rounds`}
//                                             </span>
//                                         </div>
//                                         <button
//                                             onClick={() => onRemoveTimer(index)}
//                                             style={{
//                                                 padding: '4px 8px',
//                                                 backgroundColor: '#ff5252',
//                                                 color: 'white',
//                                                 border: 'none',
//                                                 borderRadius: '4px',
//                                                 cursor: 'pointer',
//                                             }}
//                                         >
//                                             Remove
//                                         </button>
//                                     </div>
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

import { DragDropContext, Draggable, type DropResult, Droppable } from '@hello-pangea/dnd';
import type React from 'react';
import styled from 'styled-components';
import type { Timer } from '../utils/helpers';
import { formatTotalTime } from '../utils/helpers';

interface TimerQueueProps {
    timers: Timer[];
    activeTimerIndex: number | null;
    onRemoveTimer: (index: number) => void;
    onTimersReorder: (newTimers: Timer[], newActiveIndex: number | null) => void;
}

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

const grid = 8;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const getItemStyle = (isDragging: boolean, draggableStyle: any, isActive: boolean) => ({
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    background: isDragging ? 'lightgreen' : isActive ? '#e0f7fa' : 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : '#f5f5f5',
    padding: grid,
    borderRadius: '8px',
    minHeight: '100px',
    width: '100%',
    marginTop: '20px',
});

const TimerQueue: React.FC<TimerQueueProps> = ({ timers, activeTimerIndex, onRemoveTimer, onTimersReorder }) => {
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const startIndex = result.source.index;
        const endIndex = result.destination.index;

        if (startIndex === endIndex) {
            return;
        }

        const newTimers = Array.from(timers);
        const [removed] = newTimers.splice(startIndex, 1);
        newTimers.splice(endIndex, 0, removed);

        const newActiveIndex =
            activeTimerIndex === startIndex
                ? endIndex
                : activeTimerIndex !== null && startIndex < activeTimerIndex && endIndex >= activeTimerIndex
                  ? activeTimerIndex - 1
                  : activeTimerIndex !== null && startIndex > activeTimerIndex && endIndex <= activeTimerIndex
                    ? activeTimerIndex + 1
                    : activeTimerIndex;

        onTimersReorder(newTimers, newActiveIndex);
    };

    if (!timers.length) {
        return (
            <div style={getListStyle(false)}>
                <div style={{ textAlign: 'center', color: '#666' }}>Add timers to your workout</div>
            </div>
        );
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="timer-queue">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} style={getListStyle(snapshot.isDraggingOver)}>
                        {timers.map((timer, index) => (
                            <Draggable key={timer.id.toString()} draggableId={timer.id.toString()} index={index}>
                                {(provided, snapshot) => (
                                    <div ref={provided.innerRef} {...provided.draggableProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style, index === activeTimerIndex)}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div {...provided.dragHandleProps} style={{ cursor: 'grab', padding: '0 8px' }}>
                                                ⋮⋮
                                            </div>
                                            <span>
                                                {timer.type} - {formatTotalTime(timer.duration)}
                                                {timer.config?.rounds && ` - ${timer.config.rounds} rounds`}
                                            </span>
                                        </div>
                                        <RemoveButton onClick={() => onRemoveTimer(index)}>Remove</RemoveButton>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default TimerQueue;
