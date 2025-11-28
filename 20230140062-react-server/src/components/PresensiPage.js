import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

        <div className="flex space-x-4 justify-center">
          <button
            onClick={handleCheckIn}
            className="w-1/2 py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-1/2 py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
