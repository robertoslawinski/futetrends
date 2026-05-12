import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { installAnalytics, trackEvent } from "./api/analytics.js";
import Home from "./pages/Home.jsx";
import MarketDetails from "./pages/MarketDetails.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Ranking from "./pages/Ranking.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import MarketEditor from "./pages/MarketEditor.jsx";
import Rules from "./pages/Rules.jsx";
import About from "./pages/About.jsx";
import Legal from "./pages/Legal.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const location = useLocation();

  useEffect(() => installAnalytics(), []);
  useEffect(() => trackEvent("page_view", { page_path: location.pathname }), [location.pathname]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="markets/:id" element={<MarketDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="rules" element={<Rules />} />
        <Route path="about" element={<About />} />
        <Route path="privacy" element={<Legal type="privacy" />} />
        <Route path="terms" element={<Legal type="terms" />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute admin />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/markets/new" element={<MarketEditor />} />
          <Route path="admin/markets/:id/edit" element={<MarketEditor />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
