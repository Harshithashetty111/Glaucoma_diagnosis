import React, { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Home from "./pages/doctor/Home";
import Dashboard from "./pages/doctor/Dashboard";
import Patients from "./pages/doctor/Patients";
import AddPatient from "./pages/doctor/AddPatient";
import NewPrediction from "./pages/doctor/NewPrediction";
import ViewPatient from "./pages/doctor/ViewPatient";
import EditPatient from "./pages/doctor/EditPatient";
import ModelInfo from "./pages/doctor/ModelInfo";
import Contact from "./pages/doctor/Contact";
import SupportTickets from "./pages/doctor/SupportTickets";

// ---------- ProtectedRoute (checks token every time) ----------
type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
// ---------------------------------------------------------------

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* doctor routes (all protected now) */}
        <Route
          path="/doctor/support-tickets"
          element={
            <ProtectedRoute>
              <SupportTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute>
              <Patients />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients/new"
          element={
            <ProtectedRoute>
              <AddPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/new-prediction"
          element={
            <ProtectedRoute>
              <NewPrediction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients/:id"
          element={
            <ProtectedRoute>
              <ViewPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients/:id/edit"
          element={
            <ProtectedRoute>
              <EditPatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/model-info"
          element={
            <ProtectedRoute>
              <ModelInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
