import React from 'react';
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing.page';
import DashboardPage from './pages/dashboard.page';
import KanbanBoard from './pages/kanbanboard.page';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/dashboard" element={<DashboardPage/>} />
            <Route path="/kanban" element={<KanbanBoard/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
