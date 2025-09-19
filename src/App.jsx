// import React, { useState, useEffect,} from 'react';
// import LoginPage from './components/LoginPage'
// import Dashboard from './components/Dashboard'
// import UserSide from './components/UserSide';
// import { Routes,Route } from 'react-router-dom';
// import { initialBuses,initialRoutes } from './data/mockData';
// import Vahan from './components/Vahan';

// export default function App() {

  
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [buses, setBuses] = useState(initialBuses);
//     const [routes, setRoutes] = useState(initialRoutes);
//     const [announcements, setAnnouncements] = useState([]);

//     // Simulate real-time bus movement
//     useEffect(() => {
//         if (isLoggedIn) {
//             const interval = setInterval(() => {
//                 setBuses(currentBuses => 
//                     currentBuses.map(bus => {
//                         const latChange = (Math.random() - 0.5) * 0.001;
//                         const lngChange = (Math.random() - 0.5) * 0.001;
//                         const newSpeed = Math.max(15, Math.min(60, bus.speed + (Math.random() - 0.5) * 5));
//                         const newPassengers = Math.max(5, Math.min(50, bus.passengers + Math.floor((Math.random() - 0.5) * 3)));
                        
//                         return {
//                             ...bus,
//                             lat: bus.lat + latChange,
//                             lng: bus.lng + lngChange,
//                             speed: Math.round(newSpeed),
//                             passengers: newPassengers
//                         };
//                     })
//                 );
//             }, 2000); // Update every 2 seconds

//             return () => clearInterval(interval);
//         }
//     }, [isLoggedIn]);

//     if (!isLoggedIn) {
//         // return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
//         return <Vahan/>
//     }

//     return <>
    
   
//     <Dashboard 
//         buses={buses} 
//         setBuses={setBuses}
//         routes={routes}
//         setRoutes={setRoutes}
//         announcements={announcements}
//         setAnnouncements={setAnnouncements}
//         onLogout={() => setIsLoggedIn(false)} 
//     />;
//     </>
// }



import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import UserSide from './components/UserSide';
import Vahan from './components/Vahan';

import { initialBuses, initialRoutes } from './data/mockData';
import SignUpPage from './components/SignUpPage';
import DriverPanel from './components/DriverPanel';
import TrafficControl from './components/TrafficControl';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [buses, setBuses] = useState(initialBuses);
  const [routes, setRoutes] = useState(initialRoutes);
  const [announcements, setAnnouncements] = useState([]);

  // Simulate real-time bus movement
  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        setBuses(currentBuses =>
          currentBuses.map(bus => {
            const latChange = (Math.random() - 0.5) * 0.001;
            const lngChange = (Math.random() - 0.5) * 0.001;
            const newSpeed = Math.max(
              15,
              Math.min(60, bus.speed + (Math.random() - 0.5) * 5)
            );
            const newPassengers = Math.max(
              5,
              Math.min(
                50,
                bus.passengers + Math.floor((Math.random() - 0.5) * 3)
              )
            );

            return {
              ...bus,
              lat: bus.lat + latChange,
              lng: bus.lng + lngChange,
              speed: Math.round(newSpeed),
              passengers: newPassengers,
            };
          })
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Load routes from backend and keep localStorage in sync
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/routes', { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }});
        if (!res.ok) return;
        const data = await res.json();
        setRoutes(data);
        localStorage.setItem('routes', JSON.stringify(data));
      } catch (e) {
        console.warn('Failed to load routes', e);
      }
    };
    loadRoutes();
  }, []);

  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Vahan />} />

      {/* Login route */}
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/agency" replace />
          ) : (
            <LoginPage onLogin={() => setIsLoggedIn(true)} />
          )
        }
      />

      {/* Agency dashboard (protected) */}
      <Route
        path="/agency"
        element={
          isLoggedIn ? (
            <Dashboard
              buses={buses}
              setBuses={setBuses}
              routes={routes}
              setRoutes={setRoutes}
              announcements={announcements}
              setAnnouncements={setAnnouncements}
              onLogout={() => setIsLoggedIn(false)}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* User side (open) */}
      <Route path="/user" element={<UserSide />} />
      <Route path="/signup" element={<SignUpPage/>} />
      <Route path="/driver" element={<DriverPanel/>} />
      <Route path="/traffic" element={<TrafficControl/>} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
