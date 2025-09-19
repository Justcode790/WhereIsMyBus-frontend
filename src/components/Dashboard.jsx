import React from "react";
import  { useState, useEffect } from "react";
import Bus from "../components/icons/Bus";
import RouteIcon from "../components/icons/RouteIcon";
import Gauge from "../components/icons/Gauge";
import Users from "../components/icons/Users";
import Megaphone from "../components/icons/Megaphone";
import MapPin from "../components/icons/MapPin";

import LiveFleetMap from "./LiveFleetMap";
import BusManagement from "./BusManagement";
import RouteManagement from "./RouteManagement";
import AnnouncementsPage from "./AnnouncementsPage";




const Dashboard = ({ buses, routes, announcements, setBuses, setRoutes, setAnnouncements, onLogout }) => {
    const [activePage, setActivePage] = useState('dashboard')
    
    // Load buses from backend so Manage Buses shows persisted entries
    useEffect(() => {
        const loadBuses = async () => {
            try {
                const res = await fetch('http://localhost:4000/api/buses', { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }});
                if (!res.ok) return;
                const data = await res.json();
                // Map backend buses to dashboard bus shape if needed
                const mapped = data.map(b => ({
                    id: b.id,
                    registration: b.registration || b.shortId,
                    routeId: b.routeId,
                    status: 'Idle',
                    lat: 12.9716,
                    lng: 77.5946,
                    passengers: 0,
                    speed: 0,
                    shortId: b.shortId,
                }));
                setBuses(mapped);
            } catch (e) {
                console.warn('Failed to load buses', e);
            }
        };
        loadBuses();
    }, [setBuses]);

    // Poll live buses and mark status Active/Idle accordingly
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch('http://localhost:4000/api/live-buses');
                if (!res.ok) return;
                const live = await res.json();
                const liveSet = new Set(live.map(l => l.busId));
                setBuses(prev => prev.map(b => ({
                    ...b,
                    status: liveSet.has(b.shortId) ? 'Active' : 'Idle',
                })));
            } catch {
                // ignore transient network errors
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [setBuses]);
    
    const onTimeCount = buses.filter(b => b.status === 'On Time').length;
    const delayedCount = buses.filter(b => b.status === 'Delayed').length;

    const renderPage = () => {
        switch (activePage) {
            case 'dashboard':
                return (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div className="bg-white p-5 rounded-lg shadow flex items-center">
                                <div className="bg-blue-100 p-3 rounded-full mr-4"><Bus className="w-6 h-6 text-blue-600"/></div>
                                <div>
                                    <p className="text-gray-500 text-sm">Total Buses</p>
                                    <p className="text-2xl font-bold">{buses.length}</p>
                                </div>
                            </div>
                             <div className="bg-white p-5 rounded-lg shadow flex items-center">
                                <div className="bg-green-100 p-3 rounded-full mr-4"><Bus className="w-6 h-6 text-green-600"/></div>
                                <div>
                                    <p className="text-gray-500 text-sm">On Time</p>
                                    <p className="text-2xl font-bold">{onTimeCount}</p>
                                </div>
                            </div>
                             <div className="bg-white p-5 rounded-lg shadow flex items-center">
                                <div className="bg-red-100 p-3 rounded-full mr-4"><Bus className="w-6 h-6 text-red-600"/></div>
                                <div>
                                    <p className="text-gray-500 text-sm">Delayed</p>
                                    <p className="text-2xl font-bold">{delayedCount}</p>
                                </div>
                            </div>
                             <div className="bg-white p-5 rounded-lg shadow flex items-center">
                                <div className="bg-yellow-100 p-3 rounded-full mr-4"><RouteIcon /></div>
                                <div>
                                    <p className="text-gray-500 text-sm">Total Routes</p>
                                    <p className="text-2xl font-bold">{routes.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                           <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow h-[60vh]">
                                <h2 className="text-xl font-bold mb-4">Live Fleet Status</h2>
                                <LiveFleetMap buses={buses} />
                           </div>
                           <div className="bg-white p-6 rounded-lg shadow h-[60vh] overflow-y-auto">
                                <h2 className="text-xl font-bold mb-4">Bus Details</h2>
                                <ul className="space-y-4">
                                    {buses.map(bus => (
                                        <li key={bus.id} className="border-b pb-2">
                                            <p className="font-bold">{bus.registration} <span className="font-normal text-gray-600">- {bus.routeId}</span></p>
                                            <div className="flex justify-between text-sm text-gray-500 mt-1">
                                                <span className="flex items-center"><Gauge /> {bus.speed} km/h</span>
                                                <span className="flex items-center"><Users /> {bus.passengers}</span>
                                                <span className={`font-semibold ${bus.status === 'Delayed' ? 'text-red-500' : 'text-green-500'}`}>{bus.status}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                           </div>
                        </div>
                    </div>
                );
            case 'buses':
                return <BusManagement buses={buses} setBuses={setBuses} routes={routes} />;
            case 'routes':
                return <RouteManagement routes={routes} setRoutes={setRoutes} />;
            case 'announcements':
                return <AnnouncementsPage announcements={announcements} setAnnouncements={setAnnouncements} />;
            default:
                return <div>Page not found</div>;
        }
    };
    
    const NavLink = ({ page, icon, children }) => (
        <button onClick={() => setActivePage(page)} className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition ${activePage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}>
            {icon}
            {children}
        </button>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-6 text-center border-b border-gray-700">
                    <h1 className="text-2xl font-bold">Agency Portal</h1>
                    <p className="text-sm text-gray-400">Bus Tracking System</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <NavLink page="dashboard" icon={<MapPin />}>Dashboard</NavLink>
                    <NavLink page="buses" icon={<Bus className="w-5 h-5 mr-2" />}>Manage Buses</NavLink>
                    <NavLink page="routes" icon={<RouteIcon />}>Manage Routes</NavLink>
                    <NavLink page="announcements" icon={<Megaphone />}>Announcements</NavLink>
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={onLogout} className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition">Logout</button>
                </div>
            </aside>
            <main className="flex-1 p-8 overflow-y-auto">
                {renderPage()}
            </main>
        </div>
    );
};

export default Dashboard;
