import React, { useState, useEffect } from "react";
import { BusIcon } from "./icons/BusIcon";

// const BusStatusScreen = ({ route, onBack }) => {
//   const [currentStopIndex, setCurrentStopIndex] = useState(0);
//   const [statusMessage, setStatusMessage] = useState("Waiting for live bus data...");
//   console.log("Route",route)
//   useEffect(() => {
//     if (!route) return;

//     // Poll localStorage every 2s for updates
//     const interval = setInterval(() => {
//       const stored = localStorage.getItem("busLocation");
//       if (stored) {
//         const data = JSON.parse(stored);

//         // Make sure it's the same bus
//         if (data.busId === route.id) {
//           setStatusMessage(data.status);

//           if (data.currentStopIndex !== -1) {
//             setCurrentStopIndex(data.currentStopIndex);
//           }
//         }
//       }
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [route]);

//   const busPositionPercentage =
//     (currentStopIndex / (route.stops.length - 1)) * 100;

//   return (
//     <div className="bg-gray-100 min-h-screen font-sans">
//       <header className="bg-white shadow-md p-4 flex items-center sticky top-0 z-20">
//         <button onClick={onBack} className="mr-4 text-blue-600">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
//         <div>
//           <h1 className="text-lg font-bold text-gray-900">{route.busNumber}</h1>
//           <p className="text-sm text-gray-600">{route.name}</p>
//         </div>
//       </header>

//       <div className="p-4">
//         <div className="bg-white rounded-lg shadow p-4 mb-4 text-center">
//           <p className="text-sm text-gray-500">{statusMessage}</p>
//           <h2 className="text-xl font-bold text-blue-600">
//             {route.stops[currentStopIndex + 1]?.name || "Destination Reached"}
//           </h2>
//           <p className="text-sm text-gray-500">Platform No: {route.platform}</p>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <div className="relative">
//             <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

//             {/* Bus progress line */}
//             <div
//               className="absolute left-[11px] top-0 h-full transition-all duration-1000"
//               style={{ height: `${busPositionPercentage}%` }}
//             >
//               <div className="absolute top-0 w-2 h-full bg-blue-500 rounded"></div>
//               <BusIcon className="absolute right-[-14px] -bottom-3 w-8 h-8 text-white bg-blue-600 p-1 rounded-full shadow-lg z-10" />
//             </div>

//             {route.stops.map((stop, index) => {
//               const hasPassed = index < currentStopIndex;
//               const isCurrent = index === currentStopIndex;

//               return (
//                 <div key={stop.id} className="relative pl-12 py-3">
//                   <div
//                     className={`absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
//                       hasPassed ? "bg-blue-500" : "bg-gray-300"
//                     }`}
//                   >
//                     <div className="w-3 h-3 bg-white rounded-full"></div>
//                   </div>
//                   <div>
//                     <p
//                       className={`font-semibold ${
//                         hasPassed || isCurrent ? "text-gray-900" : "text-gray-500"
//                       }`}
//                     >
//                       {stop.name}
//                     </p>
//                     <p className="text-sm text-gray-500">Scheduled: {stop.time}</p>
//                     {isCurrent && <p className="text-xs text-blue-600 font-bold">Arrived</p>}
//                     {hasPassed && <p className="text-xs text-green-600 font-bold">Crossed</p>}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };






// You might need to import a BusIcon or define a simple one like this



const BusStatusScreen = ({ route, onBack }) => {
    const [currentStopIndex, setCurrentStopIndex] = useState(route.initialStopIndex || 0);
    const [speed, setSpeed] = useState(25);
    const [etaInSeconds, setEtaInSeconds] = useState(120);
    const [, setLive] = useState(null);

    // Live polling if busId provided
    useEffect(() => {
        if (!route?.busId) return;
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`http://localhost:4000/api/bus-location/${route.busId}`);
                if (!res.ok) return;
                const data = await res.json();
                setLive(data);
                if (typeof data.currentStopIndex === 'number') setCurrentStopIndex(Math.max(0, data.currentStopIndex));
                if (typeof data.etaSeconds === 'number') setEtaInSeconds(data.etaSeconds);
            } catch {
                // ignore network errors
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [route?.busId]);

    // Main effect for moving between stops (every 5 seconds) – simulation fallback
    useEffect(() => {
        if (route?.busId) return; // skip simulation when live
        const moveBus = () => {
            setCurrentStopIndex(prevIndex => {
                const isLastStop = prevIndex >= route.stops.length - 1;
                if (!isLastStop) {
                    // It's time to move to the next stop
                    setEtaInSeconds(120); // Reset ETA for the next leg (e.g., 2 minutes)
                    setSpeed(Math.floor(Math.random() * (45 - 20 + 1)) + 20); // Random speed between 20-45 km/h
                    return prevIndex + 1;
                }
                
                // Bus has reached the destination
                setSpeed(0);
                setEtaInSeconds(0);
                clearInterval(busMovementTimer); // Stop the simulation
                return prevIndex;
            });
        };
        
        const busMovementTimer = setInterval(moveBus, 5000); // Bus moves to the next stop every 5 seconds

        return () => clearInterval(busMovementTimer);
    }, [route.stops.length, route?.busId]);

    // Effect for the ETA countdown (every 1 second)
    useEffect(() => {
        if (etaInSeconds <= 0) return;
        
        const countdownTimer = setInterval(() => {
            setEtaInSeconds(prevSeconds => prevSeconds > 0 ? prevSeconds - 1 : 0);
        }, 1000);

        return () => clearInterval(countdownTimer);
    }, [etaInSeconds]);
    
    // Helper to format seconds into MM:SS
    const formatTime = (seconds) => {
        if (currentStopIndex >= route.stops.length - 1) return 'Reached';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const busPositionPercentage = (currentStopIndex / (route.stops.length - 1)) * 100;
    const isReached = currentStopIndex >= route.stops.length - 1;

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <header className="sticky top-0 z-20">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <div className="p-4 flex items-center">
                        <button onClick={onBack} className="mr-4 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <div>
                            <h1 className="text-lg font-bold">{route.busNumber}</h1>
                            <p className="text-sm text-white/90">{route.name}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white shadow">
                    <div className="px-4 py-2 text-sm text-gray-600 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Live simulation
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>{route.stops.length} stops</span>
                        {isReached && (
                            <span className="ml-auto inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">Reached</span>
                        )}
                    </div>
                </div>
            </header>
            
            <div className="p-4">
                {/* Info cards */}
                <div className="bg-white rounded-xl shadow p-4 mb-4 grid grid-cols-2 divide-x divide-gray-200 text-center">
                    <div>
                        <p className="text-sm text-gray-500">Live Speed</p>
                        <p className="text-2xl font-bold text-blue-600">{speed}<span className="text-lg font-normal"> km/h</span></p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">ETA to Next Stop</p>
                        <p className="text-2xl font-bold text-blue-600">{formatTime(etaInSeconds)}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Next Stop</p>
                            <h2 className="text-xl font-bold text-gray-800">{route.stops[currentStopIndex + 1]?.name || 'Destination Reached'}</h2>
                        </div>
                        {!isReached && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-200">En route</span>
                        )}
                    </div>
                    <div className="relative">
                        {/* The gray line for the route */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                        {/* Bus Icon and its progress line */}
                        <div 
                            className="absolute left-[12px] top-0 h-full transition-all duration-1000" 
                            style={{ height: `${busPositionPercentage}%` }}
                        >
                            <div className="absolute top-0 w-2 h-full bg-blue-500 rounded"></div>
                            <BusIcon className="absolute right-[-14px] -bottom-3 w-8 h-8 text-white bg-blue-600 p-1 rounded-full shadow-lg z-10" />
                        </div>

                        {route.stops.map((stop, index) => {
                            const hasPassed = index < currentStopIndex;
                            const isCurrent = index === currentStopIndex;
                            
                            return (
                                <div key={stop.id} className="relative pl-12 py-3">
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                                        hasPassed ? 'bg-blue-500' : 'bg-gray-300'
                                    }`}>
                                        <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${hasPassed || isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>{stop.name}</p>
                                        <p className="text-sm text-gray-500">Scheduled: {stop.time}</p>
                                        {isCurrent && <p className="text-xs text-blue-600 font-bold animate-pulse">ARRIVED</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusStatusScreen;