import { Link, Outlet, RouterProvider, createHashRouter } from 'react-router-dom';
import styled from 'styled-components';
import Countdown from './components/timers/Countdown';
import Stopwatch from './components/timers/Stopwatch';
import Tabata from './components/timers/Tabata';
import XY from './components/timers/XY';
import AddTimeView from './views/AddTimerHomeView';
import DocumentationView from './views/DocumentationView';
import TimersView from './views/TimersView';

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

const PageIndex = () => {
    return (
        <AppContainer>
            <Header>
                <HeaderTitle>Assignment 2</HeaderTitle>
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
                path: 'stopwatch',
                element: <Stopwatch />,
            },
            {
                path: 'countdown',
                element: <Countdown />,
            },
            {
                path: 'xy',
                element: <XY />,
            },
            {
                path: 'tabata',
                element: <Tabata />,
            },
        ],
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
