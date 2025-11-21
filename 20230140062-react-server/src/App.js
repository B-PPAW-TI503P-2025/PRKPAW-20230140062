import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import Navbar from './components/Navbar';
import PresensiPage from './components/PresensiPage';
import ReportPage from './components/ReportPage';


const isAuthenticated = () => {
    return localStorage.getItem('token');
};

const ProtectedRoute = ({ element: Element }) => {
    return isAuthenticated() ? <Element /> : <Navigate to="/login" />;
};

function App() {
    return (
        <Router>
            {isAuthenticated() && <Navbar />} 

            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                <Route path="/" element={<Navigate to="/dashboard" />} /> 

                <Route 
                    path="/dashboard" 
                    element={<ProtectedRoute element={DashboardPage} />} 
                />
                <Route 
                    path="/presensi" 
                    element={<ProtectedRoute element={PresensiPage} />} 
                />
                <Route 
                    path="/reports" 
                    element={<ProtectedRoute element={ReportPage} />} 
                /> 
            </Routes>
        </Router>
    );
}

export default App;