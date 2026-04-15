import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

import DashboardLayout from './components/layout/DashboardLayout';
import PatientDashboard from './pages/patient/PatientDashboard';
import SearchDoctors from './pages/patient/SearchDoctors';
import MedicalRecords from './pages/patient/MedicalRecords';
import PatientChat from './pages/patient/PatientChat';

import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorChat from './pages/doctor/DoctorChat';
import Prescriptions from './pages/doctor/Prescriptions';
import DoctorProfile from './pages/doctor/DoctorProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import Users from './pages/admin/Users';
import Verifications from './pages/admin/Verifications';

import PatientAppointments from './pages/patient/PatientAppointments';
import PatientPrescriptions from './pages/patient/PatientPrescriptions';

const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#F7F9FB]">
    <div className="w-16 h-16 rounded-lg bg-[#EF4444] flex items-center justify-center mb-6">
      <span className="text-2xl text-white font-bold">!</span>
    </div>
    <h1 className="text-3xl font-bold text-[#1F2933] mb-3">403 - Unauthorized</h1>
    <p className="text-[#6B7280]">You do not have permission to view this page.</p>
  </div>
);

function App() {
  return (
    <div className="min-h-screen font-sans">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/patient/*" element={
          <ProtectedRoute allowedRoles={['Patient', 'Doctor']}>
            <DashboardLayout roleView="Patient">
              <Routes>
                <Route path="dashboard" element={<PatientDashboard />} />
                <Route path="search" element={<SearchDoctors />} />
                <Route path="records" element={<MedicalRecords />} />
                <Route path="appointments" element={<PatientAppointments />} />
                <Route path="chat" element={<PatientChat />} />
                <Route path="prescriptions" element={<PatientPrescriptions />} />
                <Route path="*" element={<PatientDashboard />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/doctor/*" element={
          <ProtectedRoute allowedRoles={['Doctor']}>
            <DashboardLayout roleView="Doctor">
              <Routes>
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="appointments" element={<DoctorDashboard />} />
                <Route path="prescriptions" element={<Prescriptions />} />
                <Route path="chat" element={<DoctorChat />} />
                <Route path="profile" element={<DoctorProfile />} />
                <Route path="*" element={<DoctorDashboard />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <DashboardLayout roleView="Admin">
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="verifications" element={<Verifications />} />
                <Route path="*" element={<AdminDashboard />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
