// import React from 'react'
// import { SearchIcon } from "./icons/SearchIcon";
// import { ArrowDownIcon } from "./icons/ArrowDownIcon";
// import { useState } from 'react';

// export const SearchScreen = ({ onSearch }) => {
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");

//   const handleSubmit = () => {
//     onSearch(from.trim(), to.trim());
//   };

//   return (
//     <div className="p-4 bg-gray-50 min-h-screen font-sans">
//       <header className="bg-[#26667f] text-white p-4 rounded-lg shadow-md mb-6">
//         <h1 className="text-2xl font-bold text-center">National Bus Tracker</h1>
//       </header>
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Your Bus</h2>
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               From Station
//             </label>
//             <input
//               type="text"
//               placeholder="Enter starting point"
//               value={from}
//               onChange={(e) => setFrom(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
//             />
//           </div>
//           <div className=" flex justify-center my-2">
//             <ArrowDownIcon />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               To Station
//             </label>
//             <input
//               type="text"
//               placeholder="Enter destination"
//               value={to}
//               onChange={(e) => setTo(e.target.value)}
//               className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
//             />
//           </div>
//           <button
//             onClick={handleSubmit}
//             className="w-full flex justify-center items-center gap-2 bg-[#26667f] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300"
//           >
//             <SearchIcon />
//             Find Buses
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useContext, useState } from "react";
import { SearchIcon } from "./icons/SearchIcon";
import { ArrowDownIcon } from "./icons/ArrowDownIcon";
import { RouteContext } from "./RouteProvider";

export const SearchScreen = ({ onSearch }) => {

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [routeId, setRouteId] = useState("");
  const [busId, setBusId] = useState("");
  const [error, setError] = useState("");
  const {routes} = useContext(RouteContext);
  console.log("from search screen:",routes)

  const handleSubmit = () => {
    // allow any of the three: (from+to) OR routeId OR busId
    const hasStops = from.trim() && to.trim();
    const hasRoute = !!routeId;
    const hasBus = !!busId.trim();
    if (!hasStops && !hasRoute && !hasBus) {
      setError("Provide From+To, or select a Route, or enter a Bus ID.");
      return;
    }
    if (hasStops && from.trim().toLowerCase() === to.trim().toLowerCase()) {
      setError("From and To stations cannot be the same.");
      return;
    }
    setError("");
    onSearch(from.trim(), to.trim(), routeId, busId.trim().toUpperCase());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen font-sans">
      <header className="bg-[#26667f] text-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-center">National Bus Tracker</h1>
      </header>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Find Your Bus
        </h2>
        <div className="space-y-4" onKeyDown={handleKeyDown}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              From Station
            </label>
            <input
              type="text"
              placeholder="Enter starting point"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-center items-center gap-3 my-2">
            <ArrowDownIcon />
            <button
              type="button"
              onClick={handleSwap}
              className="text-sm text-blue-600 hover:underline"
            >
              Swap
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              To Station
            </label>
            <input
              type="text"
              placeholder="Enter destination"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Or select Route</label>
            <select
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            >
              <option value="">-- Optional: Route --</option>
              {routes.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Or search by Bus ID (4 chars)</label>
            <input
              type="text"
              placeholder="e.g., GT01"
              value={busId}
              maxLength={4}
              onChange={(e) => setBusId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none uppercase tracking-widest"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full flex justify-center items-center gap-2 bg-[#26667f] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition duration-300"
          >
            <SearchIcon />
            Find Buses
          </button>
        </div>
      </div>
    </div>
  );
};
