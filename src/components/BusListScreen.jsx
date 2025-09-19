import React, { useEffect, useState } from "react";
import { BusIcon } from "./icons/BusIcon";

export const BusListScreen = ({ buses, onSelectBus, onBack, from, to }) => {
  const [countdowns, setCountdowns] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("busCountdowns") || "{}");
    const now = Date.now();

    const initialCountdowns = {};
    buses.forEach((bus) => {
      if (stored[bus.id]) {
        // Resume countdown if saved
        const remaining = Math.floor((stored[bus.id] - now) / 1000);
        initialCountdowns[bus.id] = remaining > 0 ? remaining : 0;
      } else {
        // First time → save expiry timestamp
        const endTime = now + bus.etaMinutes * 60 * 1000;
        stored[bus.id] = endTime;
        initialCountdowns[bus.id] = bus.etaMinutes * 60;
      }
    });

    setCountdowns(initialCountdowns);
    localStorage.setItem("busCountdowns", JSON.stringify(stored));
  }, [buses]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdowns((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((id) => {
          if (updated[id] > 0) {
            updated[id] -= 1;
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getStatusBadge = (status) => {
    if (status === "Delayed") return "bg-red-50 text-red-700 ring-1 ring-red-200";
    if (status === "Early") return "bg-orange-50 text-orange-700 ring-1 ring-orange-200";
    return "bg-green-50 text-green-700 ring-1 ring-green-200";
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="sticky top-0 z-20">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="p-4 flex items-center">
            <button onClick={onBack} className="mr-4 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold">Available Buses</h1>
              <p className="text-sm text-white/90">{from} → {to}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow">
          <div className="px-4 py-2 text-sm text-gray-600 flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Live updates
            </span>
            <span className="text-gray-300">•</span>
            <span>{buses.length} result{buses.length === 1 ? "" : "s"}</span>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4">
        {buses.length === 0 ? (
          <div className="bg-white rounded-lg shadow border border-dashed border-gray-300 p-8 text-center">
            <div className="mx-auto mb-3 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-400"><path d="M2.25 15a4.5 4.5 0 0 1 4.5-4.5h10.5a4.5 4.5 0 1 1 0 9H6.75A4.5 4.5 0 0 1 2.25 15Zm4.5-3a3 3 0 0 0 0 6h10.5a3 3 0 1 0 0-6H6.75Z" /></svg>
            </div>
            <p className="text-gray-700 font-medium">No buses found</p>
            <p className="text-sm text-gray-500">Try a different time or route.</p>
          </div>
        ) : (
          buses.map((bus) => {
            const remaining = countdowns[bus.id] ?? bus.etaMinutes * 60;
            const missed = remaining <= 0;
            const total = Math.max(1, (bus.etaMinutes || 0) * 60);
            const progress = missed ? 100 : Math.min(100, Math.max(0, ((total - remaining) / total) * 100));

            return (
              <div
                key={bus.id}
                onClick={() => onSelectBus(bus)}
                className="bg-white rounded-xl shadow hover:shadow-lg border border-gray-200 hover:border-blue-500 transition cursor-pointer overflow-hidden"
              >
                <div className="p-4 flex items-start gap-3">
                  <div className="shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <BusIcon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-base text-gray-900 truncate">Bus {bus.busNumber}</p>
                        <p className="text-sm text-gray-500 truncate">{bus.name}</p>
                      </div>
                      <div className="text-right">
                        {missed ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 ring-1 ring-red-200">Missed</span>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(bus.status)}`}>
                            {bus.status}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm text-gray-700">ETA: {missed ? "—" : formatTime(remaining)}</p>
                      {!missed && (
                        <p className="text-xs text-gray-500">{Math.round(100 - progress)}% remaining</p>
                      )}
                    </div>
                    <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${missed ? "bg-red-400" : "bg-blue-500"}`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
