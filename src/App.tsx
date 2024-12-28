import { ErrorBoundary } from 'react-error-boundary';
import { Link, Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import styled from 'styled-components';
import Countdown from './components/timers/Countdown';
import Stopwatch from './components/timers/Stopwatch';
import Tabata from './components/timers/Tabata';
import XY from './components/timers/XY';
import AddTimeView from './views/AddTimerHomeView';
import DocumentationView from './views/DocumentationView';
import TimersView from './views/TimersView';
import WorkoutHistoryView from './views/WorkoutHistroyView';

const AppContainer = styled.div`
    min-height: 100vh;
    background-color: #f0f0f0;
  `;

const Header = styled.div`
    padding: 1rem 2rem;
  `;

const HeaderTitle = styled.h1`
    margin-bottom: 1rem;
    color: black
  `;

const Nav = styled.ul`
    list-style: none;
    padding: 0;
    margin: 1rem 0;
    display: flex;
    gap: 2rem;
  `;

const NavItem = styled.li`
    a {
      text-decoration: none;
      color: black;
      font-size: 1.1rem;
      
      &:hover {
        text-decoration: underline;
      }
    }
  `;

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
    <div role="alert" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Something went wrong!</h2>
        <p>{error.message}</p>
        <button onClick={resetErrorBoundary} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Try Again
        </button>
    </div>
);

const PageIndex = () => {
    return (
        <AppContainer>
            <Header>
                <HeaderTitle>Assignment 3</HeaderTitle>
                <Nav>
                    <NavItem>
                        <Link to="/">Timers</Link>
                    </NavItem>
                    <NavItem>
                        <Link to="/add">Add Timers</Link>
                    </NavItem>
                    <NavItem>
                        <Link to="/docs">Documentation</Link>
                    </NavItem>
                    <NavItem>
                        <Link to="/history">History</Link>
                    </NavItem>
                </Nav>
            </Header>
            <Outlet />
        </AppContainer>
    );
};

// Configure the routes
const router = createHashRouter([
    {
        path: '/',
        element: <PageIndex />,
        children: [
            {
                index: true,
                element: <TimersView />,
            },
            {
                path: 'add',
                element: <AddTimeView />,
            },
            {
                path: 'docs',
                element: <DocumentationView />,
            },
            {
                path: 'history',
                element: <WorkoutHistoryView />,
            },
            {
                path: 'stopwatch',
                element: <Stopwatch />,
            },
            {
                path: 'countdown',
                element: <Countdown />,
            },
            {
                path: 'xy',
                element: <XY rounds={0} timePerRound={0} />,
            },
            {
                path: 'tabata',
                element: <Tabata rounds={0} workTime={0} restTime={0} />,
            },
        ],
    },
]);

const App = () => (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <RouterProvider router={router} />
    </ErrorBoundary>
);

export default App;
