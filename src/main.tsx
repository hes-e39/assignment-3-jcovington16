import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { TimerProvider } from './components/contex/TimerContext';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <TimerProvider>
            <App />
        </TimerProvider>
    </StrictMode>,
);
