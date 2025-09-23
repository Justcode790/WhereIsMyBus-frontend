// // // import React, { useContext, useState } from "react";
// // // import BusStatusScreen from "./BusStatusScreen";
// // // import { SearchScreen } from "./SearchScreen";
// // // import { BusListScreen } from "./BusListScreen";
// // // import { LocationContext } from "./LocationProvider";
// // // import { RouteContext } from "./RouteProvider";



// // // const availableBusesData = [
// // //   {
// // //     id: "R101-A",
// // //     busNumber: "KA-01-F-1234",
// // //     name: "Majestic to ITPL",
// // //     platform: 5,
// // //     status: "On Time",
// // //     etaMinutes: 5,
// // //     from: "Majestic Bus Station",
// // //     to: "ITPL",
// // //     stops: [
// // //       { id: 1, name: "Majestic Bus Station", time: "10:00 AM" },
// // //       { id: 2, name: "Corporation Circle", time: "10:10 AM" },
// // //       { id: 3, name: "Richmond Circle", time: "10:20 AM" },
// // //       { id: 4, name: "MG Road", time: "10:30 AM" },
// // //       { id: 5, name: "Indiranagar", time: "10:45 AM" },
// // //       { id: 6, name: "Marathahalli", time: "11:00 AM" },
// // //       { id: 7, name: "Graphite India", time: "11:10 AM" },
// // //       { id: 8, name: "ITPL", time: "11:20 AM" },
// // //     ],
// // //     initialStopIndex: 3,
// // //   },
// // //   {
// // //     id: "R101-B",
// // //     busNumber: "KA-02-G-9101",
// // //     name: "Majestic to ITPL",
// // //     platform: 5,
// // //     status: "Delayed",
// // //     etaMinutes: 18,
// // //     from: "Majestic Bus Station",
// // //     to: "ITPL",
// // //     stops: [
// // //       { id: 1, name: "Majestic Bus Station", time: "10:05 AM" },
// // //       { id: 2, name: "Corporation Circle", time: "10:15 AM" },
// // //       { id: 3, name: "Richmond Circle", time: "10:25 AM" },
// // //       { id: 4, name: "MG Road", time: "10:35 AM" },
// // //       { id: 5, name: "Indiranagar", time: "10:50 AM" },
// // //       { id: 6, name: "Marathahalli", time: "11:05 AM" },
// // //       { id: 7, name: "Graphite India", time: "11:15 AM" },
// // //       { id: 8, name: "ITPL", time: "11:25 AM" },
// // //     ],
// // //     initialStopIndex: 1,
// // //   },
// // //   {
// // //     id: "R102-A",
// // //     busNumber: "KA-05-K-2222",
// // //     name: "Koramangala to Marathahalli",
// // //     platform: 3,
// // //     status: "On Time",
// // //     etaMinutes: 12,
// // //     from: "Koramangala",
// // //     to: "Marathahalli",
// // //     stops: [
// // //       { id: 1, name: "Koramangala", time: "9:30 AM" },
// // //       { id: 2, name: "Domlur", time: "9:45 AM" },
// // //       { id: 3, name: "Indiranagar", time: "10:00 AM" },
// // //       { id: 4, name: "HAL", time: "10:15 AM" },
// // //       { id: 5, name: "Marathahalli", time: "10:30 AM" },
// // //     ],
// // //     initialStopIndex: 0,
// // //   },
// // //   {
// // //     id: "R103-A",
// // //     busNumber: "KA-09-L-7890",
// // //     name: "Bannerghatta to Hebbal",
// // //     platform: 7,
// // //     status: "Early",
// // //     etaMinutes: 8,
// // //     from: "Bannerghatta Road",
// // //     to: "Hebbal",
// // //     stops: [
// // //       { id: 1, name: "Bannerghatta Road", time: "8:30 AM" },
// // //       { id: 2, name: "BTM Layout", time: "8:45 AM" },
// // //       { id: 3, name: "Silk Board", time: "9:00 AM" },
// // //       { id: 4, name: "Madiwala", time: "9:15 AM" },
// // //       { id: 5, name: "Hebbal", time: "9:30 AM" },
// // //     ],
// // //     initialStopIndex: 2,
// // //   },
// // // ];

// // // // --- App Entry Point ---
// // // export default function UserSide() {
// // //   const [view, setView] = useState("search");
// // //   const [selectedRoute, setSelectedRoute] = useState(null);
// // //   const [filteredBuses, setFilteredBuses] = useState([]);
// // //   const [searchQuery, setSearchQuery] = useState({ from: "", to: "" });

// // //   const {location} = useContext(LocationContext);

// // //   const {routes,setRoutes} = useContext(RouteContext);

// // //   // setInterval(()=>{
// // //   //   console.log("Location of Bus :",localStorage.getItem("busLocation"));
// // //   // },50000)

// // //   const handleSearch = (from, to) => {
// // //     setSearchQuery({ from, to });
// // //     const matches = availableBusesData.filter(
// // //       (bus) =>
// // //         bus.from.toLowerCase().includes(from.toLowerCase()) &&
// // //         bus.to.toLowerCase().includes(to.toLowerCase())
// // //     );
// // //     setFilteredBuses(matches);
// // //     setView("busList");
// // //   };

// // //   const handleSelectBus = (route) => {
// // //     setSelectedRoute(route);
// // //     setView("status");
// // //   };

// // //   const handleBack = () => {
// // //     if (view === "status") {
// // //       setView("busList");
// // //     } else if (view === "busList") {
// // //       setView("search");
// // //     }
// // //   };

// // //   if (view === "search") {
// // //     return <SearchScreen onSearch={handleSearch} />;
// // //   }

// // //   if (view === "busList") {
// // //     return (
// // //       <BusListScreen
// // //         buses={filteredBuses}
// // //         from={searchQuery.from}
// // //         to={searchQuery.to}
// // //         onSelectBus={handleSelectBus}
// // //         onBack={handleBack}
// // //       />
// // //     );
// // //   }

// // //   return <BusStatusScreen route={selectedRoute} onBack={handleBack} />;
// // // }


// // import React, { useContext, useState, useMemo } from "react";
// // import BusStatusScreen from "./BusStatusScreen";
// // import { SearchScreen } from "./SearchScreen";
// // import { BusListScreen } from "./BusListScreen";
// // import { LocationContext } from "./LocationProvider";
// // import { RouteContext } from "./RouteProvider";

// // export default function UserSide() {
// //   const [view, setView] = useState("search");
// //   const [selectedRoute, setSelectedRoute] = useState(null);
// //   const [filteredBuses, setFilteredBuses] = useState([]);
// //   const [searchQuery, setSearchQuery] = useState({ from: "", to: "" });

// //   const { location } = useContext(LocationContext);
// //   // let { routes } = useContext(RouteContext);
  
// //    let routes = localStorage.getItem("routes")
// //   // 🟢 Normalize backend route data to frontend bus format
// //   const availableBusesData = useMemo(() => {
// //     return routes.map((route, index) => ({
// //       id: route.id,
// //       busNumber: `BUS-${index + 1}`, // placeholder, since backend doesn’t give busNumber
// //       name: route.name,
// //       platform: index + 1,
// //       status: ["On Time", "Delayed", "Early"][index % 3], // placeholder status
// //       etaMinutes: 5 + index * 3, // stable placeholder ETA
// //       from: route.stops[0]?.stopName || "Unknown",
// //       to: route.stops[route.stops.length - 1]?.stopName || "Unknown",
// //       stops: route.stops.map((s, i) => ({
// //         id: i + 1,
// //         name: s.stopName,
// //         time: `${9 + i}:${i % 2 === 0 ? "00" : "30"} AM`, // placeholder times
// //       })),
// //       initialStopIndex: 0,
// //     }));
// //   }, [routes]);

// //   // 🔍 Search across all stops, not just first/last
// // const handleSearch = (from, to) => {
// //   setSearchQuery({ from, to });

// //   const matches = availableBusesData.filter((bus) => {
// //     const stopNames = bus.stops.map((s) => s.name.toLowerCase());
// //     const routeName = bus.name.toLowerCase();

// //     const fromInput = from.toLowerCase();
// //     const toInput = to.toLowerCase();

// //     // Case 1: User searches full route name
// //     if (fromInput && !toInput && routeName.includes(fromInput)) {
// //       return true;
// //     }

// //     // Case 2: User searches both stops
// //     if (fromInput && toInput) {
// //       return (
// //         (stopNames.includes(fromInput) || routeName.includes(fromInput)) &&
// //         (stopNames.includes(toInput) || routeName.includes(toInput))
// //       );
// //     }

// //     // Case 3: User types only one stop (from or to)
// //     if (fromInput && !toInput) {
// //       return stopNames.includes(fromInput) || routeName.includes(fromInput);
// //     }
// //     if (!fromInput && toInput) {
// //       return stopNames.includes(toInput) || routeName.includes(toInput);
// //     }

// //     return false;
// //   });

// //   setFilteredBuses(matches);
// //   setView("busList");
// // };


// //   const handleSelectBus = (route) => {
// //     setSelectedRoute(route);
// //     setView("status");
// //   };

// //   const handleBack = () => {
// //     if (view === "status") setView("busList");
// //     else if (view === "busList") setView("search");
// //   };

// //   if (view === "search") {
// //     return <SearchScreen onSearch={handleSearch} />;
// //   }

// //   if (view === "busList") {
// //     return (
// //       <BusListScreen
// //         buses={filteredBuses}
// //         from={searchQuery.from}
// //         to={searchQuery.to}
// //         onSelectBus={handleSelectBus}
// //         onBack={handleBack}
// //       />
// //     );
// //   }

// //   return <BusStatusScreen route={selectedRoute} onBack={handleBack} />;
// // }


// import React, { useContext, useState, useMemo } from "react";
// import BusStatusScreen from "./BusStatusScreen";
// import { SearchScreen } from "./SearchScreen";
// import { BusListScreen } from "./BusListScreen";
// import { LocationContext } from "./LocationProvider";
// import { RouteContext } from "./RouteProvider";

// export default function UserSide() {
//   const [view, setView] = useState("search");
//   const [selectedRoute, setSelectedRoute] = useState(null);
//   const [filteredBuses, setFilteredBuses] = useState([]);
//   const [searchQuery, setSearchQuery] = useState({ from: "", to: "" });

//   const { location } = useContext(LocationContext);

//   // ✅ Get routes safely from localStorage
//   let storedRoutes = localStorage.getItem("routes");
//   let routes = storedRoutes ? JSON.parse(storedRoutes) : [];

//   // 🟢 Normalize backend route data to frontend bus format
//   const availableBusesData = useMemo(() => {
//     return routes.map((route, index) => ({
//       id: route.id,
//       busNumber: `BUS-${index + 1}`, // placeholder bus number
//       name: route.name,
//       platform: index + 1,
//       status: ["On Time", "Delayed", "Early"][index % 3], // fake status cycle
//       etaMinutes: 5 + index * 3, // fake ETA
//       from: route.stops[0]?.stopName || "Unknown",
//       to: route.stops[route.stops.length - 1]?.stopName || "Unknown",
//       stops: route.stops.map((s, i) => ({
//         id: i + 1,
//         name: s.stopName,
//         time: `${9 + i}:${i % 2 === 0 ? "00" : "30"} AM`, // fake times
//       })),
//       initialStopIndex: 0,
//     }));
//   }, [routes]);

//   // 🔍 Search buses by route name or stops
//   const handleSearch = (from, to) => {
//     setSearchQuery({ from, to });

//     const matches = availableBusesData.filter((bus) => {
//       const stopNames = bus.stops.map((s) => s.name.toLowerCase());
//       const routeName = bus.name.toLowerCase();

//       const fromInput = from.toLowerCase();
//       const toInput = to.toLowerCase();

//       // Case 1: Full route name search
//       if (fromInput && !toInput && routeName.includes(fromInput)) {
//         return true;
//       }

//       // Case 2: Both stops provided
//       if (fromInput && toInput) {
//         return (
//           (stopNames.includes(fromInput) || routeName.includes(fromInput)) &&
//           (stopNames.includes(toInput) || routeName.includes(toInput))
//         );
//       }

//       // Case 3: Single stop search
//       if (fromInput && !toInput) {
//         return stopNames.includes(fromInput) || routeName.includes(fromInput);
//       }
//       if (!fromInput && toInput) {
//         return stopNames.includes(toInput) || routeName.includes(toInput);
//       }

//       return false;
//     });

//     setFilteredBuses(matches);
//     setView("busList");
//   };

//   const handleSelectBus = (route) => {
//     setSelectedRoute(route);
//     setView("status");
//   };

//   const handleBack = () => {
//     if (view === "status") setView("busList");
//     else if (view === "busList") setView("search");
//   };

//   if (view === "search") {
//     return <SearchScreen onSearch={handleSearch} />;
//   }

//   if (view === "busList") {
//     return (
//       <BusListScreen
//         buses={filteredBuses}
//         from={searchQuery.from}
//         to={searchQuery.to}
//         onSelectBus={handleSelectBus}
//         onBack={handleBack}
//       />
//     );
//   }

//   return <BusStatusScreen route={selectedRoute} onBack={handleBack} />;
// }

import React, { useContext, useState, useMemo, useEffect } from "react";
import BusStatusScreen from "./BusStatusScreen";
import { SearchScreen } from "./SearchScreen";
import { BusListScreen } from "./BusListScreen";
import { LocationContext } from "./LocationProvider";
import { RouteContext } from "./RouteProvider";

const API_URL = 'https://whereismybus-1.onrender.com';

export default function UserSide() {
  // 🔹 Always start at SearchScreen
  const [view, setView] = useState("search");

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
    localStorage.setItem("selectedRoute", JSON.stringify(selectedRoute));
  }, [selectedRoute]);

  useEffect(() => {
    localStorage.setItem("filteredBuses", JSON.stringify(filteredBuses));
  }, [filteredBuses]);

  useEffect(() => {
    localStorage.setItem("searchQuery", JSON.stringify(searchQuery));
  }, [searchQuery]);

  // 🔍 Search logic
  const handleSearch = async (from, to, routeId, busShortId) => {
    setSearchQuery({ from, to });

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
        fetch(`${API_URL}/api/live-buses`),
        fetch(`${API_URL}/api/buses`),
      ]);
      const live = liveRes.ok ? await liveRes.json() : [];
      const buses = busesRes.ok ? await busesRes.json() : [];

      let filteredRoutes = routeMatches;
      if (routeId) filteredRoutes = routeMatches.filter(r => r.id === routeId);

      const matchedRouteIds = new Set(filteredRoutes.map((b) => b.id));
      let busesOnRoutes = buses.filter(b => matchedRouteIds.has(b.routeId));
      if (busShortId) busesOnRoutes = busesOnRoutes.filter(b => (b.shortId || '').toUpperCase() === busShortId.toUpperCase());

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

  if (view === "search") return <SearchScreen onSearch={handleSearch} />;

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
