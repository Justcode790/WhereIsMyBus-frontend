import React, { useState, useRef, useContext, useEffect } from "react";
import { LocationContext } from "./LocationProvider";
import { RouteContext } from "./RouteProvider";

const DriverPanel = () => {
  const [busId, setBusId] = useState("");
  const [routeId, setRouteId] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [locked, setLocked] = useState(false);
  const intervalRef = useRef(null);
const API_URL = 'https://whereismybus-1.onrender.com';
  const { setLocation } = useContext(LocationContext);

  const {routes} = useContext(RouteContext)

  useEffect(() => {
    // When busId length is 4, try to auto-resolve assigned route
    const id = busId.trim().toUpperCase();
    if (id.length === 4) {
      (async () => {
        try {
          const res = await fetch(`${API_URL}/api/bus-lookup/${id}`);
          if (res.ok) {
            const data = await res.json();
            setRouteId(data.routeId);
            setLocked(true);
          } else {
            setLocked(false);
          }
        } catch {
          setLocked(false);
        }
      })();
    } else {
      setLocked(false);
    }
  }, [busId]);

  const sendLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log(`Sending location: ${latitude}, ${longitude}`);

        try {
          const res = await fetch(`${API_URL}/api/update-location`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              busId,
              latitude,
              longitude,
              timestamp: new Date().toISOString(),
            }),
          });
          console.log("✅ Location sent successfully");
          const response = await res.json();
          setLocation(response);

          localStorage.setItem("busLocation", JSON.stringify(response)); // mediator
          console.log(response);
        } catch (err) {
          console.error("Error sending location:", err);
        }
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  };

  const startTracking = async () => {
    if (!busId) {
      alert("Please enter Bus ID (4 chars)");
      return;
    }
    if (!routeId) {
      alert("No route assigned for this Bus ID");
      return;
    }

    try {
      await fetch(`${API_URL}/api/register-bus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ busId: busId.trim().toUpperCase(), routeId, busNumber: busId.trim().toUpperCase() }),
      });
    } catch (e) {
      console.error("Failed to register bus", e);
    }

    sendLocation();
    const id = setInterval(sendLocation, 2000);
    intervalRef.current = id;
    setIsTracking(true);
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
    console.log("🛑 Stopped tracking");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans bg-contain bg-center bg-no-repeat "

     style={{ backgroundImage: "url('https://res.cloudinary.com/debc5aznw/image/upload/v1758737413/scrapbook/r3kkyfpvzrc1fghqgfen.png')" }}

    >
     


      {/* 🔹 Main content */}
      <div className="relative z-20 bg-white/90 shadow-md rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Driver Panel</h1>

        <input
          type="text"
          placeholder="Enter Bus ID (4 chars)"
          value={busId}
          onChange={(e) => setBusId(e.target.value)}
          className="w-full p-2 border rounded mb-4 uppercase tracking-widest"
          maxLength={4}
        />

        <select
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          disabled={locked}
        >
          <option value="">{locked ? 'Route locked from Bus ID' : 'Select Route'}</option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>

        {!isTracking ? (
          <button
            onClick={startTracking}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Start Tracking
          </button>
        ) : (
          <button
            onClick={stopTracking}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
          >
            Stop Tracking
          </button>
        )}

        {isTracking && (
          <p className="text-green-600 mt-4 font-semibold">
            ✅ Live location is being sent for Bus {busId} every 2 seconds
          </p>
        )}
      </div>
    </div>
  );
};

export default DriverPanel;
