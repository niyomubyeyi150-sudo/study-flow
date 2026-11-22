import { BrowserRouter, Routes, Route } from "react-router-dom";

import SiteLayout from "./layouts/SiteLayout";

import DashboardPage from "./pages/DashboardPage";
// import TasksPage from "./pages/TasksPage";
// import FocusPage from "./pages/FocusPage";
// import SettingsPage from "./pages/SettingsPage";

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#A97865]">
        Page not found
      </p>

      <h1 className="mt-3 text-4xl font-bold text-[#29272D]">404</h1>

      <p className="mt-3 text-[#756F78]">
        The page you're looking for doesn't exist.
      </p>

      <a
        href="/"
        className="mt-6 rounded-xl bg-[#29272D] px-5 py-3 text-sm font-medium text-white hover:bg-[#45414A]"
      >
        Back to dashboard
      </a>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SiteLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          {/* <Route path="/tasks" element={<TasksPage />} />
          <Route path="/focus" element={<FocusPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </SiteLayout>
    </BrowserRouter>
  );
}

export default App;
