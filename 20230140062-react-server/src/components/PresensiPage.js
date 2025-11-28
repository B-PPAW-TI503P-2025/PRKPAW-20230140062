import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);
  

  const getToken = () => localStorage.getItem("token");

  const handleCheckIn = async () => {
    setMessage("");
    setError("");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      // Request simpel tanpa body latitude/longitude
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {}, 
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-in gagal");
    }
  };

  const handleCheckOut = async () => {
    setMessage("");
    setError("");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-out gagal");
    }
  };

  useEffect(() => {
        getLocation();
    }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setError("Gagal mendapatkan lokasi: " + error.message);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Lakukan Presensi
        </h2>

        {message && <p className="text-green-600 mb-4 bg-green-100 p-2 rounded">{message}</p>}
        {error && <p className="text-red-600 mb-4 bg-red-100 p-2 rounded">{error}</p>}

        {coords ? (
                <div className="w-full max-w-2xl my-4 border rounded-lg overflow-hidden">
                    <MapContainer 
                        center={[coords.lat, coords.lng]} 
                        zoom={15} 
                        style={{ height: '300px', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker position={[coords.lat, coords.lng]}>
                            <Popup>Lokasi Presensi Anda</Popup>
                        </Marker>
                    </MapContainer>
                </div>
            ) : (
                <p className='text-gray-500 mb-4'>Memuat lokasi...</p>
            )}

            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">
                    Lakukan Presensi
                </h2>
                {message && <p className="text-green-600 mb-4">{message}</p>}
                {error && <p className="text-red-600 mb-4">{error}</p>}
                
                <div className="flex space-x-4">
                    <button
                        onClick={handleCheckIn}
                        className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
                        disabled={!coords}
                    >
                        Check-In
                    </button>
                    <button
                        onClick={handleCheckOut}
                        className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
                    >
                        Check-Out
                    </button>
                </div>
            </div>
      </div>
    </div>
  );
}

export default PresensiPage;
