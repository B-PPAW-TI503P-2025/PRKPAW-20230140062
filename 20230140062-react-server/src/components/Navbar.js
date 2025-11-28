import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Requirement B.1

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token invalid");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <div className="font-bold text-lg">
        Sistem Presensi - Halo, {user.nama}
      </div>
      <div className="space-x-4">
        <Link to="/dashboard" className="hover:text-gray-200">Dashboard</Link>
        <Link to="/presensi" className="hover:text-gray-200">Presensi</Link>
        
        {user.role === 'admin' && (
          <Link to="/reports" className="hover:text-gray-200 bg-blue-800 px-3 py-1 rounded">
            Laporan Admin
          </Link>
        )}

        <button     
          onClick={handleLogout} 
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;