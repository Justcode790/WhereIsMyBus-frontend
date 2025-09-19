// import React, { useState, useEffect, useRef } from 'react';
// import { demoBusesData } from '../data/mockData';

// // The backend server address (commented out for demo)
// // const API_URL = "http://localhost:3001";

// // --- Helper Icons ---
// const BusIcon = ({ className }) => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 6v6" /><path d="M15 6v6" /><path d="M2 12h19.6" /><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
// );

// const PhoneIcon = () => (
//     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
// );

// // --- Main Traffic Control Component ---
// export default function TrafficControl() {
//     // Default location set to Vadlamudi, Andhra Pradesh
//     setInterval(()=>{
//         console.log(localStorage.getItem("busLocation"))
//     },2000)

//     const [userLocation, setUserLocation] = useState({ lat: 16.4426, lon: 80.6225 });
//     const [buses, setBuses] = useState(demoBusesData);
//     const [selectedBus, setSelectedBus] = useState(null);
//     const [error, setError] = useState(null);
//     const mapRef = useRef(null); // Ref for the map container

//     // Fetch user's actual location (will override the default if successful)
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setUserLocation({ lat: latitude, lon: longitude });
//                 },
//                 (err) => {
//                     setError("Could not get your location. Using default. Please enable location services for accuracy.");
//                     console.error(err);
//                 }
//             );
//         } else {
//             setError("Geolocation is not supported by this browser.");
//         }
//     }, []);

//     // --- DEMO SIMULATION ---
//     useEffect(() => {
//         const simulationInterval = setInterval(() => {
//             setBuses(currentBuses => 
//                 currentBuses.map(bus => {
//                     const nextIndex = bus.pathIndex + 1;
//                     // Reset path if it reaches the end, creating a loop
//                     const newIndex = nextIndex >= bus.path.length ? 0 : nextIndex;
//                     const newPosition = bus.path[newIndex];
                    
//                     return {
//                         ...bus,
//                         lat: newPosition.lat,
//                         lon: newPosition.lon,
//                         pathIndex: newIndex,
//                     };
//                 })
//             );
//         }, 3000); // Update every 3 seconds

//         return () => clearInterval(simulationInterval);
//     }, []);


//     /* --- ACTUAL LIVE DATA FETCHING (COMMENTED OUT) ---
//     useEffect(() => {
//         const fetchAllBuses = async () => {
//             try {
//                 const response = await fetch(`${API_URL}/api/allBusesStatus`);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 setBuses(data);
//                 setError(null);
//             } catch (err) {
//                 setError("Failed to fetch bus data from server.");
//                 console.error(err);
//             }
//         };

//         fetchAllBuses();
//         const intervalId = setInterval(fetchAllBuses, 7000); // Poll every 7 seconds

//         return () => clearInterval(intervalId);
//     }, []);
//     */

//     // Helper to calculate position on a simple grid map
//     const getMapPosition = (lat, lon) => {
//         if (!userLocation || !mapRef.current) return { top: '50%', left: '50%' };
        
//         const mapWidth = mapRef.current.offsetWidth;
//         const mapHeight = mapRef.current.offsetHeight;

//         // Simple projection: assumes a relatively small, flat area
//         // Multiplier is increased for more visible movement on the map
//         const left = mapWidth * (0.5 + (lon - userLocation.lon) * 100);
//         const top = mapHeight * (0.5 - (lat - userLocation.lat) * 100);

//         return { top: `${top}px`, left: `${left}px` };
//     };

//     return (
//         <div className="font-sans bg-gray-100 min-h-screen">
//             <header className="bg-blue-800 text-white p-4 shadow-md text-center">
//                 <h1 className="text-2xl font-bold">Traffic Control Live Map</h1>
//             </header>

//             {error && <div className="bg-yellow-500 text-white p-3 text-center">{error}</div>}

//             <div className="p-4">
//                 <div ref={mapRef} className="relative w-full h-[60vh] bg-green-100 rounded-lg shadow-lg overflow-hidden border-4 border-white">
//                     {/* Placeholder for a real map tile layer */}
//                     <div className="absolute inset-0 bg-grid-gray-300/20" style={{ backgroundImage: 'linear-gradient(white 2px, transparent 2px), linear-gradient(90deg, white 2px, transparent 2px), linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px', backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px' }}></div>

//                     {userLocation && (
//                         <div className="absolute" style={getMapPosition(userLocation.lat, userLocation.lon)}>
//                              <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-xl animate-pulse"></div>
//                         </div>
//                     )}

//                     {buses.map(bus => (
//                         <div 
//                             key={bus.busId} 
//                             className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear cursor-pointer" 
//                             style={getMapPosition(bus.lat, bus.lon)}
//                             onClick={() => setSelectedBus(bus)}
//                         >
//                            <BusIcon className={`w-10 h-10 text-white p-1 rounded-full shadow-2xl ${selectedBus?.busId === bus.busId ? 'bg-red-600' : 'bg-gray-800'}`} />
//                         </div>
//                     ))}
//                 </div>

//                 {/* Bus Information Panel */}
//                 <div className="mt-4">
//                     {selectedBus ? (
//                         <div className="bg-white p-4 rounded-lg shadow-md border animate-fade-in">
//                             <h2 className="text-xl font-bold text-gray-800">{selectedBus.busId}</h2>
//                             <p className="text-gray-600">Route: {selectedBus.routeName}</p>
//                             <p className="text-gray-600">Next Stop: {selectedBus.nextStopName}</p>
//                             <button className="w-full mt-4 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
//                                <PhoneIcon /> Contact Agency
//                             </button>
//                         </div>
//                     ) : (
//                          <div className="bg-white p-4 rounded-lg shadow-md text-center text-gray-500">
//                             <p>Click on a bus to see its details.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }


import React, { useState, useEffect, useRef } from 'react';

// --- Mock Data ---
// This is the initial set of buses. Live buses from the Driver Panel can be added dynamically.
const demoBusesData = [
    {
        busId: "68c4ec67a081f0aa4239e2ce",
        routeName: "Downtown Express",
        nextStopName: "Central Station",
        lat: 16.4450,
        lon: 80.6250,
        pathIndex: 0,
        path: [ 
            { lat: 16.4450, lon: 80.6250 },
            { lat: 16.4460, lon: 80.6260 },
            { lat: 16.4470, lon: 80.6270 },
            { lat: 16.4480, lon: 80.6260 },
            { lat: 16.4470, lon: 80.6250 },
            { lat: 16.4460, lon: 80.6240 },
        ]
    },
    {
        busId: "B102",
        routeName: "University Loop",
        nextStopName: "Library Campus",
        lat: 16.4390,
        lon: 80.6200,
        pathIndex: 0,
        path: [
            { lat: 16.4390, lon: 80.6200 },
            { lat: 16.4385, lon: 80.6215 },
            { lat: 16.4395, lon: 80.6225 },
            { lat: 16.4405, lon: 80.6215 },
            { lat: 16.4400, lon: 80.6200 },
        ]
    },
    {
        busId: "B103",
        routeName: "Crosstown",
        nextStopName: "Shopping Mall",
        lat: 16.448,
        lon: 80.628,
        pathIndex: 0,
        path: [
           { lat: 16.448, lon: 80.628 },
           { lat: 16.449, lon: 80.629 },
           { lat: 16.450, lon: 80.630 },
           { lat: 16.449, lon: 80.631 },
           { lat: 16.448, lon: 80.630 },
        ]
    }
];


// --- Helper Icons ---
const BusIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 6v6" /><path d="M15 6v6" /><path d="M2 12h19.6" /><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);


// --- Helper Function ---
/**
 * Calculates the distance between two lat/lon points in kilometers using the Haversine formula.
 */
const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => x * Math.PI / 180;
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lon - coords1.lon);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};


// --- Traffic Control Component ---
export default function TrafficControl() {
    const [userLocation, setUserLocation] = useState(null); // Police officer's location
    const [buses, setBuses] = useState(demoBusesData);
    const [selectedBus, setSelectedBus] = useState(null);
    const [error, setError] = useState(null);
    const [searchRadius, setSearchRadius] = useState(5); // in Kilometers
    const [liveBusId, setLiveBusId] = useState(null); // Track which bus is live
    const mapRef = useRef(null);

    // 1. Get Traffic Police's location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lon: longitude });
                },
                (err) => {
                    setError("Could not get your location. Using default. Please enable location services.");
                    setUserLocation({ lat: 16.4426, lon: 80.6225 }); // Default fallback
                    console.error(err);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
            setUserLocation({ lat: 16.4426, lon: 80.6225 }); // Default fallback
        }
    }, []);

    // 2. Listen for live bus data from localStorage (sent by a separate DriverPanel app)
    useEffect(() => {
        const liveDataInterval = setInterval(() => {
            const busLocationData = localStorage.getItem("busLocation");
            if (busLocationData) {
                try {
                    const liveBus = JSON.parse(busLocationData);
                    setBuses(currentBuses => {
                        const busExists = currentBuses.some(b => b.busId === liveBus.busId);
                        
                        if (busExists) {
                            // If bus exists, update its location
                            return currentBuses.map(bus =>
                                bus.busId === liveBus.id
                                    ? { ...bus, lat: liveBus.latitude, lon: liveBus.longitude }
                                    : bus
                            );
                        } else {
                            // If bus is new, add it to the state
                            const newBusData = {
                                busId: liveBus.busId,
                                routeName: "Live Track",
                                nextStopName: "N/A",
                                lat: liveBus.latitude,
                                lon: liveBus.longitude,
                                pathIndex: 0,
                                path: [{ lat: liveBus.latitude, lon: liveBus.longitude }],
                            };
                            return [...currentBuses, newBusData];
                        }
                    });
                    setLiveBusId(liveBus.busId);
                } catch (e) {
                    console.error("Failed to parse bus location from localStorage", e);
                }
            }
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(liveDataInterval);
    }, []);

    // 3. Run simulation for demo buses (but not for the one that is live)
    useEffect(() => {
        const simulationInterval = setInterval(() => {
            setBuses(currentBuses =>
                currentBuses.map(bus => {
                    // Skip simulation for the live bus and for any bus without a path
                    if (bus.busId === liveBusId || !bus.path || bus.path.length <= 1) return bus;

                    const nextIndex = bus.pathIndex + 1;
                    const newIndex = nextIndex >= bus.path.length ? 0 : nextIndex;
                    const newPosition = bus.path[newIndex];
                    return { ...bus, lat: newPosition.lat, lon: newPosition.lon, pathIndex: newIndex };
                })
            );
        }, 3000);

        return () => clearInterval(simulationInterval);
    }, [liveBusId]); // Rerun if the live bus changes


    const getMapPosition = (lat, lon) => {
        if (!userLocation || !mapRef.current) return { top: '50%', left: '50%' };
        
        const mapWidth = mapRef.current.offsetWidth;
        const mapHeight = mapRef.current.offsetHeight;
        const zoomFactor = 8000; // Increased for better visual spread

        const left = mapWidth * (0.5 + (lon - userLocation.lon) * zoomFactor);
        const top = mapHeight * (0.5 - (lat - userLocation.lat) * zoomFactor);

        return { top: `${top}px`, left: `${left}px` };
    };

    // Filter buses to show only those within the search radius
    const visibleBuses = userLocation ? buses.filter(bus => {
        const distance = haversineDistance(userLocation, { lat: bus.lat, lon: bus.lon });
        return distance <= searchRadius;
    }) : [];

    const PIXELS_PER_KM = 30; // Visual scale of the circle on the map
    const circleDiameter = searchRadius * PIXELS_PER_KM * 2;

    return (
        <div className="font-sans bg-gray-100 min-h-screen">
            <header className="bg-blue-800 text-white p-4 shadow-md text-center">
                <h1 className="text-2xl font-bold">Traffic Control Live Map</h1>
            </header>

            {error && <div className="bg-yellow-500 text-white p-3 text-center">{error}</div>}

            <div className="flex flex-col lg:flex-row p-4 gap-4">
                {/* Left Panel: Map */}
                <div className="flex-grow">
                    <div ref={mapRef} className="relative w-full h-[60vh] bg-green-100 rounded-lg shadow-lg overflow-hidden border-4 border-white">
                        <div className="absolute inset-0 bg-grid-gray-300/20" style={{ backgroundImage: 'linear-gradient(white 2px, transparent 2px), linear-gradient(90deg, white 2px, transparent 2px), linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px', backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px' }}></div>
                       
                        {userLocation && (
                            <>
                                {/* Detection Circle */}
                                <div
                                    className="absolute bg-blue-500 bg-opacity-10 border-2 border-blue-400 border-dashed rounded-full transition-all duration-500"
                                    style={{
                                        ...getMapPosition(userLocation.lat, userLocation.lon),
                                        width: `${circleDiameter}px`,
                                        height: `${circleDiameter}px`,
                                        transform: 'translate(-50%, -50%)',
                                    }}
                                />
                                {/* User's Location (Police) */}
                                <div className="absolute" style={getMapPosition(userLocation.lat, userLocation.lon)}>
                                     <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-xl animate-pulse flex items-center justify-center text-white font-bold text-xs">P</div>
                                </div>
                            </>
                        )}
                        
                        {visibleBuses.map(bus => (
                            <div
                                key={bus.busId}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear cursor-pointer group"
                                style={getMapPosition(bus.lat, bus.lon)}
                                onClick={() => setSelectedBus(bus)}
                            >
                                <BusIcon className={`w-10 h-10 text-white p-1 rounded-full shadow-2xl transition-colors ${selectedBus?.busId === bus.busId ? 'bg-red-600' : 'bg-gray-800'}`} />
                                <span className="absolute bottom-full mb-2 w-max bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {bus.busId}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Controls and Info */}
                <div className="lg:w-80 flex-shrink-0 flex flex-col gap-4">
                     <div className="bg-white p-4 rounded-lg shadow-md border">
                        <label htmlFor="radius-slider" className="block text-gray-700 font-bold mb-2">
                            Detection Radius: {searchRadius} km
                        </label>
                        <input
                            id="radius-slider"
                            type="range"
                            min="1"
                            max="20"
                            step="1"
                            value={searchRadius}
                            onChange={(e) => setSearchRadius(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                    </div>
                    {selectedBus ? (
                        <div className="bg-white p-4 rounded-lg shadow-md border animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-800">{selectedBus.busId}</h2>
                            <p className="text-gray-600">Route: {selectedBus.routeName}</p>
                            <p className="text-gray-600">Next Stop: {selectedBus.nextStopName}</p>
                             <p className="text-sm text-gray-500">Lat: {selectedBus.lat.toFixed(4)}, Lon: {selectedBus.lon.toFixed(4)}</p>
                            <button className="w-full mt-4 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
                                <PhoneIcon /> Contact Agency
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white p-4 rounded-lg shadow-md text-center text-gray-500 border">
                            <p>Click on a bus inside the circle to see its details.</p>
                            <p className='mt-2 text-sm'>Showing {visibleBuses.length} of {buses.length} total buses.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

