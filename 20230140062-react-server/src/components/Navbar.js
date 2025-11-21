import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState({ nama: 'Pengguna', role: 'mahasiswa' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ nama: decoded.nama, role: decoded.role });
            } catch (e) {
                handleLogout();
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="bg-indigo-600 p-4 text-white shadow-md">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <div className="text-lg font-bold">Aplikasi Presensi</div>
                <div className="flex items-center space-x-4">
                    <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                    <Link to="/presensi" className="hover:text-gray-300">Presensi</Link>

                    {user.role === 'admin' && (
                        <Link to="/reports" className="hover:text-yellow-300 font-semibold">
                            Laporan Admin
                        </Link>
                    )}

                    <span className="ml-4 font-semibold">Halo, {user.nama} ({user.role})</span>
                    
                    <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
export default Navbar;