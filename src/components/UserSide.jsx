import React, { useContext, useState, useMemo, useEffect } from "react";
import BusStatusScreen from "./BusStatusScreen";
import { SearchScreen } from "./SearchScreen";
import { BusListScreen } from "./BusListScreen";
import { LocationContext } from "./LocationProvider";
import { RouteContext } from "./RouteProvider";
const API_URL = 'https://whereismybus-1.onrender.com';
export default function UserSide() {
  // 🔹 Load from localStorage on init
  const [view, setView] = useState(() => localStorage.getItem("view") || "search");
  const [selectedRoute, setSelectedRoute] = useState(() => {
    const saved = localStorage.getItem("selectedRoute");
    return saved ? JSON.parse(saved) : null;
  });
  const [filteredBuses, setFilteredBuses] = useState(() => {
    const saved = localStorage.getItem("filteredBuses");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    const saved = localStorage.getItem("searchQuery");
    return saved ? JSON.parse(saved) : { from: "", to: "" };
  });

  useContext(LocationContext);
  const routes = useMemo(() => {
    const storedRoutes = localStorage.getItem("routes");
    return storedRoutes ? JSON.parse(storedRoutes) : [];
  }, []);

  // 🟢 Normalize backend route data to frontend bus format
  const availableBusesData = useMemo(() => {
    return routes.map((route, index) => ({
      id: route.id,
      busNumber: `BUS-${index + 1}`,
      name: route.name,
      platform: index + 1,
      status: ["On Time", "Delayed", "Early"][index % 3],
      etaMinutes: 5 + index * 3,
      from: route.stops[0]?.stopName || "Unknown",
      to: route.stops[route.stops.length - 1]?.stopName || "Unknown",
      stops: route.stops.map((s, i) => ({
        id: i + 1,
        name: s.stopName,
        time: `${9 + i}:${i % 2 === 0 ? "00" : "30"} AM`,
      })),
      initialStopIndex: 0,
    }));
  }, [routes]);

  // 🔹 Persist state changes
  useEffect(() => {
    localStorage.setItem("view", view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem("selectedRoute", JSON.stringify(selectedRoute));
  }, [selectedRoute]);

  useEffect(() => {
    localStorage.setItem("filteredBuses", JSON.stringify(filteredBuses));
  }, [filteredBuses]);

  useEffect(() => {
    localStorage.setItem("searchQuery", JSON.stringify(searchQuery));
  }, [searchQuery]);

  // 🔍 Search across stops + include all assigned buses, mark not started if no live
  const handleSearch = async (from, to, routeId, busShortId) => {
    setSearchQuery({ from, to });

    // If user provided a 4-char bus id, try resolve to its route via live list
    if (busShortId) {
      try {
        const res = await fetch(`${API_URL}/api/live-buses`);
        const live = await res.json();
        const found = live.find(x => (x.busId || "").toUpperCase() === busShortId.toUpperCase());
        if (found) {
          const baseRoute = availableBusesData.find(r => r.id === found.routeId);
          const entry = {
            id: found.busId,
            busId: found.busId,
            busNumber: found.busNumber || found.busId,
            name: baseRoute?.name || found.routeName,
            platform: baseRoute?.platform || 1,
            status: "Live",
            etaMinutes: found.etaSeconds != null ? Math.max(0, Math.ceil(found.etaSeconds / 60)) : baseRoute?.etaMinutes || 10,
            etaSeconds: found.etaSeconds ?? null,
            from: baseRoute?.from,
            to: baseRoute?.to,
            stops: baseRoute?.stops || [],
            initialStopIndex: found.currentStopIndex >= 0 ? found.currentStopIndex : 0,
          };
          setFilteredBuses([entry]);
          setView("busList");
          return;
        }
      } catch {
        // ignore network errors for bus id search
      }
    }

    // If user selected a route explicitly, seed matches to that route when no stop keywords provided
    let routeMatches = [];
    if (routeId && !from && !to) {
      const direct = availableBusesData.find(r => r.id === routeId);
      if (direct) routeMatches = [direct];
    } else {
      routeMatches = availableBusesData.filter((bus) => {
      const stopNames = bus.stops.map((s) => s.name.toLowerCase());
      const routeName = bus.name.toLowerCase();

      const fromInput = from.toLowerCase();
      const toInput = to.toLowerCase();

      if (fromInput && !toInput && routeName.includes(fromInput)) return true;
      if (fromInput && toInput) {
        return (
          (stopNames.includes(fromInput) || routeName.includes(fromInput)) &&
          (stopNames.includes(toInput) || routeName.includes(toInput))
        );
      }
      if (fromInput && !toInput) return stopNames.includes(fromInput) || routeName.includes(fromInput);
      if (!fromInput && toInput) return stopNames.includes(toInput) || routeName.includes(toInput);

      return false;
    });
    }

    try {
      const [liveRes, busesRes] = await Promise.all([
        fetch("http://localhost:4000/api/live-buses"),
        fetch("http://localhost:4000/api/buses"),
      ]);
      const live = liveRes.ok ? await liveRes.json() : [];
      const buses = busesRes.ok ? await busesRes.json() : [];

      // Filter on routeId if selected
      let filteredRoutes = routeMatches;
      if (routeId) {
        filteredRoutes = routeMatches.filter(r => r.id === routeId);
      }
      const matchedRouteIds = new Set(filteredRoutes.map((b) => b.id));

      // Filter buses to matched routes
      let busesOnRoutes = buses.filter(b => matchedRouteIds.has(b.routeId));
      if (busShortId) {
        busesOnRoutes = busesOnRoutes.filter(b => (b.shortId || '').toUpperCase() === busShortId.toUpperCase());
      }

      const liveMap = new Map(live.map(l => [l.busId, l]));

      const combined = busesOnRoutes.map(bus => {
        const baseRoute = availableBusesData.find(r => r.id === bus.routeId);
        const liveInfo = liveMap.get(bus.shortId);
        if (liveInfo) {
          return {
            id: bus.shortId,
            busId: bus.shortId,
            busNumber: bus.shortId,
            name: baseRoute?.name || liveInfo.routeName,
            platform: baseRoute?.platform || 1,
            status: "Live",
            etaMinutes: liveInfo.etaSeconds != null ? Math.max(0, Math.ceil(liveInfo.etaSeconds / 60)) : baseRoute?.etaMinutes || 10,
            etaSeconds: liveInfo.etaSeconds ?? null,
            from: baseRoute?.from,
            to: baseRoute?.to,
            stops: baseRoute?.stops || [],
            initialStopIndex: liveInfo.currentStopIndex >= 0 ? liveInfo.currentStopIndex : 0,
          };
        }
        // Not active (no live)
        return {
          id: bus.shortId,
          busId: bus.shortId,
          busNumber: bus.shortId,
          name: baseRoute?.name || bus.routeName,
          platform: baseRoute?.platform || 1,
          status: "Not Active",
          etaMinutes: baseRoute?.etaMinutes || 10,
          etaSeconds: null,
          from: baseRoute?.from,
          to: baseRoute?.to,
          stops: baseRoute?.stops || [],
          initialStopIndex: 0,
        };
      });

      // If no buses exist for route search, fall back to route cards
      const finalList = combined.length > 0 ? combined : (routeId ? filteredRoutes : routeMatches);
      setFilteredBuses(finalList);
    } catch (e) {
      console.error("Failed to load data", e);
      setFilteredBuses(routeId ? routeMatches.filter(r => r.id === routeId) : routeMatches);
    }

    setView("busList");
  };

  const handleSelectBus = (route) => {
    setSelectedRoute(route);
    setView("status");
  };

  const handleBack = () => {
    if (view === "status") setView("busList");
    else if (view === "busList") setView("search");
  };

  if (view === "search") {
    return <SearchScreen onSearch={handleSearch} />;
  }

  if (view === "busList") {
    return (
      <BusListScreen
        buses={filteredBuses}
        from={searchQuery.from}
        to={searchQuery.to}
        onSelectBus={handleSelectBus}
        onBack={handleBack}
      />
    );
  }

  return <BusStatusScreen route={selectedRoute} onBack={handleBack} />;
}
