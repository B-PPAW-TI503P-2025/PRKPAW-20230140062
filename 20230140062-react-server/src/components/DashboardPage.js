import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500">Selamat datang di sistem presensi</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-200 shadow-md"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white font-bold">
                {user?.nama ? user.nama.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                Halo, {user?.nama || 'User'}! 👋
              </h2>
              <p className="text-gray-600 mt-2">
                Role: <span className="font-semibold capitalize">{user?.role || 'N/A'}</span>
              </p>
              <p className="text-gray-600">
                Email: <span className="font-semibold">{user?.email || 'N/A'}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Kehadiran</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">85%</p>
              </div>
              <div className="text-4xl text-blue-500">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Pertemuan Dihadiri</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">17/20</p>
              </div>
              <div className="text-4xl text-green-500">✅</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Status Hari Ini</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">Hadir ✓</p>
              </div>
              <div className="text-4xl text-yellow-500">📅</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Aktivitas Terbaru</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-800">Presensi Masuk</p>
                  <p className="text-sm text-gray-500">Hari ini, 08:00 AM</p>
                </div>
              </div>
              <span className="text-green-600 font-semibold">Sukses</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-800">Login</p>
                  <p className="text-sm text-gray-500">Kemarin, 07:30 AM</p>
                </div>
              </div>
              <span className="text-blue-600 font-semibold">Sukses</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-800">Presensi Pulang</p>
                  <p className="text-sm text-gray-500">2 hari lalu, 05:00 PM</p>
                </div>
              </div>
              <span className="text-green-600 font-semibold">Sukses</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition duration-200">
            📝 Lihat Presensi
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition duration-200">
            📋 Laporan Kehadiran
          </button>
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-300 text-center py-4 mt-12">
        <p>&copy; 2025 Sistem Presensi. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default DashboardPage;