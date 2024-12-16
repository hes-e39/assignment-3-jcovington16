import styled from 'styled-components';
import DocumentComponent from '../components/documentation/DocumentComponent';
import Loading from '../components/generic/Loading';
import Countdown from '../components/timers/Countdown';
import Stopwatch from '../components/timers/Stopwatch';
import Tabata from '../components/timers/Tabata';
import XY from '../components/timers/XY';

const Container = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 20px;

    > div {
        width: 100%;
        max-width: 1200px;
    }
`;

const Title = styled.div`
    font-size: 2rem;
`;

const Documentation = () => {
    return (
        <Container>
            <div>
                <Title>Documentation</Title>
                <DocumentComponent
                    title="Loading spinner"
                    component={<Loading size="medium" color="#ffa2bf" />}
                    propDocs={[
                        {
                            prop: 'size',
                            description: 'Changes the size of the loading spinner',
                            type: 'string',
                            defaultValue: 'medium',
                        },
                        {
                            prop: 'color',
                            description: 'Specifies the color of the loading spinner',
                            type: 'string',
                            defaultValue: '#ffa2bf',
                        },
                    ]}
                />

                <DocumentComponent
                    title="Countdown Timer"
                    component={<Countdown />}
                    propDocs={[
                        {
                            prop: 'initialTime',
                            description: 'The time (in seconds) from which the countdown starts',
                            type: 'number',
                            defaultValue: '0',
                        },
                        {
                            prop: 'isRunning',
                            description: 'External control for timer running state',
                            type: 'boolean',
                            defaultValue: 'false',
                        },
                        {
                            prop: 'remainingTime',
                            description: 'External control for remaining time',
                            type: 'number',
                            defaultValue: '0',
                        },
                        {
                            prop: 'description',
                            description: 'Description of the timer activity',
                            type: 'string',
                            defaultValue: 'None',
                        },
                        {
                            prop: 'onComplete',
                            description: 'Callback function when the countdown reaches zero',
                            type: 'function',
                            defaultValue: 'null',
                        },
                    ]}
                />

                <DocumentComponent
                    title="Stopwatch Timer"
                    component={<Stopwatch />}
                    propDocs={[
                        {
                            prop: 'isRunning',
                            description: 'External control for timer running state',
                            type: 'boolean',
                            defaultValue: 'false',
                        },
                        {
                            prop: 'remainingTime',
                            description: 'External control for elapsed time',
                            type: 'number',
                            defaultValue: '0',
                        },
                        {
                            prop: 'description',
                            description: 'Description of the timer activity',
                            type: 'string',
                            defaultValue: 'None',
                        },
                        {
                            prop: 'onComplete',
                            description: 'Callback function when stopwatch is stopped',
                            type: 'function',
                            defaultValue: 'null',
                        },
                    ]}
                />

                <DocumentComponent
                    title="XY Timer"
                    component={<XY rounds={0} timePerRound={0} />}
                    propDocs={[
                        {
                            prop: 'rounds',
                            description: 'Total number of rounds',
                            type: 'number',
                            defaultValue: 'Required',
                        },
                        {
                            prop: 'timePerRound',
                            description: 'Duration of each round in seconds',
                            type: 'number',
                            defaultValue: 'Required',
                        },
                        {
                            prop: 'currentRound',
                            description: 'External control for current round number',
                            type: 'number',
                            defaultValue: '1',
                        },
                        {
                            prop: 'isRunning',
                            description: 'External control for timer running state',
                            type: 'boolean',
                            defaultValue: 'false',
                        },
                        {
                            prop: 'remainingTime',
                            description: 'External control for remaining time in current round',
                            type: 'number',
                            defaultValue: '0',
                        },
                        {
                            prop: 'description',
                            description: 'Description of the timer activity',
                            type: 'string',
                            defaultValue: 'None',
                        },
                        {
                            prop: 'onComplete',
                            description: 'Callback function when all rounds are completed',
                            type: 'function',
                            defaultValue: 'null',
                        },
                    ]}
                />

                <DocumentComponent
                    title="Tabata Timer"
                    component={<Tabata rounds={0} workTime={0} restTime={0} />}
                    propDocs={[
                        {
                            prop: 'rounds',
                            description: 'Total number of work/rest cycles',
                            type: 'number',
                            defaultValue: 'Required',
                        },
                        {
                            prop: 'workTime',
                            description: 'Duration of work intervals in seconds',
                            type: 'number',
                            defaultValue: 'Required',
                        },
                        {
                            prop: 'restTime',
                            description: 'Duration of rest intervals in seconds',
                            type: 'number',
                            defaultValue: 'Required',
                        },
                        {
                            prop: 'currentRound',
                            description: 'External control for current round number',
                            type: 'number',
                            defaultValue: '1',
                        },
                        {
                            prop: 'isRunning',
                            description: 'External control for timer running state',
                            type: 'boolean',
                            defaultValue: 'false',
                        },
                        {
                            prop: 'remainingTime',
                            description: 'External control for remaining time in current interval',
                            type: 'number',
                            defaultValue: '0',
                        },
                        {
                            prop: 'isWorkPhase',
                            description: 'External control for work/rest phase',
                            type: 'boolean',
                            defaultValue: 'true',
                        },
                        {
                            prop: 'description',
                            description: 'Description of the timer activity',
                            type: 'string',
                            defaultValue: 'None',
                        },
                        {
                            prop: 'onComplete',
                            description: 'Callback function when all rounds are completed',
                            type: 'function',
                            defaultValue: 'null',
                        },
                    ]}
                />
            </div>
        </Container>
    );
};

export default Documentation;
