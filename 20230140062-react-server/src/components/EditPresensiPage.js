import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Utility function untuk konversi ISO date string dari DB ke format input datetime-local (YYYY-MM-DDTHH:mm)
const toInputDatetimeLocal = (isoString) => {
    if (!isoString) return '';
    try {
        const date = new Date(isoString);
        
        // Menggunakan toLocaleString untuk mendapatkan waktu lokal (WIB)
        // dan memformatnya secara manual agar sesuai dengan input datetime-local
        const localTimeString = date.toLocaleString("en-US", { 
            timeZone: "Asia/Jakarta", 
            year: 'numeric', month: '2-digit', day: '2-digit', 
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });

        // Contoh: "12/11/2025, 21:00:00" -> perlu dipecah/diubah ke "2025-12-11T21:00"
        const [datePart, timePart] = localTimeString.split(', ');
        const [month, day, year] = datePart.split('/');
        const [hours, minutes] = timePart.split(':');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;

    } catch (e) {
        console.error("Error formatting date:", e);
        return '';
    }
};


function EditPresensiPage() {
    const { id } = useParams(); // Mengambil ID dari URL
    const navigate = useNavigate();
    const [presensi, setPresensi] = useState({
        checkIn: '',
        checkOut: '',
        latitude: '',
        longitude: '',
        buktiFoto: null, // Hanya nama file
    });
    // const [file, setFile] = useState(null); // File upload dinonaktifkan sementara
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');

    const getToken = () => localStorage.getItem("token");

    // Fungsi untuk mendapatkan URL gambar (sama dengan di ReportPage.js)
    const getImageUrl = (filename) => {
        if (!filename) return null;
        return `http://localhost:3001/uploads/${filename}`;
    };


    // 1. Fetch Data Lama
    useEffect(() => {
        const fetchPresensi = async () => {
            const token = getToken();
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                // Catatan: Endpoint GET /api/presensi/:id mungkin perlu Anda tambahkan di Node.js
                // untuk menampilkan data yang benar. Saat ini kita menggunakan format PUT
                // untuk mencoba mengambil data dari API yang mungkin belum ada.
                const response = await axios.get(`http://localhost:3001/api/presensi/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                // Mengisi state dengan data yang sudah diformat untuk input datetime-local
                setPresensi({
                    ...response.data.data,
                    checkIn: toInputDatetimeLocal(response.data.data.checkIn),
                    checkOut: response.data.data.checkOut ? toInputDatetimeLocal(response.data.data.checkOut) : '',
                    latitude: response.data.data.latitude || '',
                    longitude: response.data.data.longitude || '',
                }); 
                setLoading(false);
            } catch (err) {
                // Menangani jika endpoint GET /api/presensi/:id belum dibuat
                setError(err.response?.data?.message || "Gagal memuat data presensi. Anda mungkin perlu menambahkan endpoint GET /api/presensi/:id di server.");
                setLoading(false);
            }
        };
        fetchPresensi();
    }, [id, navigate]);
    
    // Menangani perubahan form 
    const handleChange = (e) => {
        setPresensi({ ...presensi, [e.target.name]: e.target.value });
    };

    // 2. Handle Submit Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = getToken();
        setStatusMessage('');
        setError(null);
        
        // Data yang akan dikirim (menggunakan format state presensi)
        // Kita tidak perlu FormData karena tidak mengirim file (Lihat Catatan di ReportPage.js)
        const dataToUpdate = {
             // Waktu harus dikirim sebagai string ISO
            checkIn: presensi.checkIn ? new Date(presensi.checkIn).toISOString() : null,
            checkOut: presensi.checkOut ? new Date(presensi.checkOut).toISOString() : null,
            latitude: presensi.latitude,
            longitude: presensi.longitude,
        };

        try {
            const response = await axios.put(`http://localhost:3001/api/presensi/${id}`, dataToUpdate, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStatusMessage(response.data.message || 'Data presensi berhasil diperbarui!');
            
            setTimeout(() => {
                 navigate('/reports'); // Kembali ke halaman laporan setelah sukses
            }, 1500);

        } catch (err) {
            setError(`Gagal memperbarui data: ${err.response?.data?.message || 'Terjadi kesalahan'}`);
        }
    };

    if (loading) return <div className="text-center mt-10">Memuat...</div>;
    // Tampilkan error saat fetch data
    if (error && !presensi.checkIn) return <div className="text-center mt-10 text-red-600">Terjadi kesalahan: {error}</div>;


    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Edit Presensi (ID: {id})</h1>

                {statusMessage && <p className="text-green-600 text-center mb-4">{statusMessage}</p>}
                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Input Check-In */}
                    <div>
                        <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">Check-In (WIB)</label>
                        <input
                            id="checkIn"
                            type="datetime-local" 
                            name="checkIn"
                            value={presensi.checkIn} 
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    
                    {/* Input Check-Out */}
                    <div>
                        <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">Check-Out (WIB)</label>
                        <input
                            id="checkOut"
                            type="datetime-local" 
                            name="checkOut"
                            value={presensi.checkOut || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    {/* Input Latitude */}
                    <div>
                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                        <input
                            id="latitude"
                            type="text"
                            name="latitude"
                            value={presensi.latitude || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>
                    
                    {/* Input Longitude */}
                    <div>
                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                        <input
                            id="longitude"
                            type="text"
                            name="longitude"
                            value={presensi.longitude || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    {/* Info Bukti Foto */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bukti Foto</label>
                        {presensi.buktiFoto ? (
                            <img 
                                src={getImageUrl(presensi.buktiFoto)} 
                                alt="Bukti Presensi Saat Ini" 
                                className="mt-2 h-32 w-32 object-cover rounded-md"
                            />
                        ) : (
                            <p className="mt-1 text-gray-500">Tidak ada foto.</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">Catatan: Untuk saat ini, fitur edit hanya dapat memperbarui waktu dan lokasi, bukan foto.</p>
                    </div>

                    <div className='pt-4 flex space-x-4'>
                         <button
                            type="submit"
                            className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Simpan Perubahan
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/reports')}
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditPresensiPage;