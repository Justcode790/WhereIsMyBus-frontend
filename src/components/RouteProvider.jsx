import React, { createContext, useEffect, useState } from "react";

export const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('routes');
    if (saved) {
      try { setRoutes(JSON.parse(saved)); } catch (e) {
        console.warn('Failed to parse saved routes', e);
      }
    }
  }, []);

  return (
    <RouteContext.Provider value={{ routes, setRoutes }}>
      {children}
    </RouteContext.Provider>
  );
};
