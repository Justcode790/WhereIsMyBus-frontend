import React, { useMemo, useState } from 'react'
const API_URL = 'https://whereismybus-1.onrender.com';
// Bus Management Page
const BusManagement = ({ buses, setBuses, routes }) => {
    const [error, setError] = useState("");
    const [selectedBus, setSelectedBus] = useState(null);

    const handleAddBus = async (e) => {
        e.preventDefault();
        const shortId = e.target.shortId.value.trim().toUpperCase();
        if (!/^[A-Z0-9]{4}$/.test(shortId)) {
            setError("Bus ID must be exactly 4 alphanumeric characters");
            return;
        }
        try {
            const res = await fetch(`${API_URL}/api/buses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
                body: JSON.stringify({
                    shortId,
                    registration: e.target.registration.value,
                    routeId: e.target.routeId.value,
                }),
            });
            const saved = await res.json();
            if (!res.ok) {
                setError(saved?.error || 'Failed to save bus');
                return;
            }
            const newBus = {
                id: saved.id,
                shortId: saved.shortId,
                registration: saved.registration,
                routeId: saved.routeId,
                status: 'Idle',
                lat: 12.9716,
                lng: 77.5946,
                passengers: 0,
                speed: 0
            };
            setBuses([...buses, newBus]);
            e.target.reset();
            setError("");
        } catch (err) {
            setError('Network error saving bus',err);
        }
    };

    const handleGenerateId = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:4000/api/generate-bus-id');
            const data = await res.json();
            if (data?.id) {
                const input = document.getElementById('shortId');
                if (input) input.value = data.id;
                setError("");
            } else {
                setError('Failed to generate ID');
            }
        } catch {
            setError('Failed to generate ID');
        }
    };

    const routeIdToName = useMemo(() => {
        const map = new Map();
        routes.forEach(r => map.set(r.id, r.name));
        return map;
    }, [routes]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">Manage Buses</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Bus ID</th>
                                <th className="p-2">Registration</th>
                                <th className="p-2">Route</th>
                                <th className="p-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buses.map(bus => (
                                <tr
                                    key={bus.id}
                                    onClick={() => setSelectedBus(bus)}
                                    className={`border-b cursor-pointer ${selectedBus?.id === bus.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                                >
                                    <td className="p-2 font-mono">{bus.shortId || '-'}</td>
                                    <td className="p-2 font-mono">{bus.registration}</td>
                                    <td className="p-2">{bus.routeName || '-'}</td>

                                    <td className="p-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            bus.status === 'On Time' ? 'bg-green-100 text-green-800' :
                                            bus.status === 'Delayed' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>{bus.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow space-y-6">
                {selectedBus && (
                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <h2 className="text-xl font-bold">Bus Details</h2>
                                <button onClick={() => setSelectedBus(null)} className="text-sm text-blue-600 hover:underline">Clear</button>
                            </div>
                            <div className="text-sm text-gray-700 space-y-1">
                                <p><span className="font-semibold">Bus ID:</span> {selectedBus.shortId || '-'}</p>
                                <p><span className="font-semibold">Registration:</span> {selectedBus.registration || '-'}</p>
                                <p><span className="font-semibold">Route:</span> {selectedBus.routeName || '-'}</p>
                                <p><span className="font-semibold">Status:</span> {selectedBus.status}</p>
                            </div>
                        </div>
                    )}

                <h2 className="text-xl font-bold">Add New Bus</h2>
                <form onSubmit={handleAddBus}>
                    <div className="mb-4">
                        <label htmlFor="shortId" className="block text-sm font-medium text-gray-700 mb-1">4-Char Bus ID</label>
                        <div className="flex gap-2">
                            <input type="text" id="shortId" name="shortId" maxLength={4} required className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase tracking-widest" placeholder="e.g., GT01" />
                            <button onClick={handleGenerateId} className="px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">Generate</button>
                        </div>
                        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="registration" className="block text-sm font-medium text-gray-700 mb-1">Registration No.</label>
                        <input type="text" id="registration" name="registration" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., KA-01-F-9999" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="routeId" className="block text-sm font-medium text-gray-700 mb-1">Assign Route</label>
                        <select id="routeId" name="routeId" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select a route</option>
                            {routes.map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Add Bus</button>
                </form>
            </div>
        </div>
    );
};


export default BusManagement