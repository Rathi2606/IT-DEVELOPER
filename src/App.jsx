import React from "react";
import "./index.css";
import { Route, Routes } from "react-router-dom";

import LandingPage from "./pages/landing.page";
import AboutPage from "./pages/about.page";
import DashboardPage from "./pages/dashboard.page";
import KanbanBoard from "./pages/kanbanboard.page";
import SignInPage from "./pages/sign-in.page";
import SignUpPage from "./pages/sign-up.page";
import SettingsPage from "./pages/settings.page";
import CalendarPage from "./pages/calendar.page";
import TeamPage from "./pages/team.page";
import QuickActionPage from "./pages/quick-action.page";

import RootLayout from "./layouts/root.layout";
import ProtectedLayout from "./layouts/protected.layout";
import MainLayout from "./layouts/main.layout";

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>

        {/* Auth routes */}
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />

        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/kanban" element={<KanbanBoard />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Quick Action routes */}
          <Route path="/new-task" element={<QuickActionPage filter="new-task" />} />
          <Route path="/in-progress" element={<QuickActionPage filter="in-progress" />} />
          <Route path="/completed" element={<QuickActionPage filter="completed" />} />
          <Route path="/due-soon" element={<QuickActionPage filter="due-soon" />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
