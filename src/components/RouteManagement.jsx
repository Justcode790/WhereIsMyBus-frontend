import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteContext } from "./RouteProvider";

const RouteManagement = () => {
  const { routes, setRoutes } = useContext(RouteContext);
  const [selectedRoute, setSelectedRoute] = useState(null);

  if(routes.length>0){
    console.log("Route(RouteMana):",routes)
    localStorage.setItem("routes", JSON.stringify(routes));
  }

  // React Hook Form
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Fetch routes on mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/routes", { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } });
        const data = await res.json();
        console.log("Data from backEnd:",data)
        const formatted = data.map(r => ({
          id: r.id,
          name: r.name,
          stops: r.stops,
          distance: r.distance
        }));
        setRoutes(formatted);
      } catch (err) {
        console.error("Error fetching routes:", err);
      }
    };

    fetchRoutes();
  }, [setRoutes]);

  // Handle form submission
  const onSubmit = async (formData) => {
    const stopCount = parseInt(formData.stops, 10);
    const stopNames = formData.stopNames.split(",").map(s => s.trim());
    const stopCoords = formData.stopCoords.split(",").map(c => c.trim());

    if (stopNames.length !== stopCount || stopCoords.length !== stopCount) {
      alert("❌ Number of stops, stop names, and coordinates must match!");
      return;
    }

    const stops = stopNames.map((name, idx) => {
      const [lat, lng] = stopCoords[idx].split("|").map(Number);
      return { stopName: name, latitude: lat, longitude: lng };
    });

    const newRoute = {
      routeName: formData.name,
      distanceKm: Number(formData.distance.replace(/[^0-9.]/g, "")),
      stops
    };

    try {
      const res = await fetch("http://localhost:4000/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
        body: JSON.stringify(newRoute)
      });
      const data = await res.json();

     if(data){

       setRoutes(prev => [
        ...prev,
        { id: data._id, name: data.name, stops: data.stops, distance: data.distance }
      ]);
     }

      reset();
    } catch (err) {
      console.error("Error saving route:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Table */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Manage Routes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Route Name</th>
                <th className="p-2">Stops</th>
                <th className="p-2">Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {routes?.map(route => (
                <tr
                  key={route.id}
                  onClick={() => setSelectedRoute(route)}
                  className={`border-b cursor-pointer ${selectedRoute?.id === route.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <td className="p-2 font-semibold">{route.name}</td>
                  <td className="p-2">{route.stops.length}</td>
                  <td className="p-2">{route.distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right: Route details + Add Route Form */}
      <div className="bg-white p-6 rounded-lg shadow space-y-6">
        {selectedRoute && (
          <div>
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-xl font-bold">Route Details</h2>
              <button onClick={() => setSelectedRoute(null)} className="text-sm text-blue-600 hover:underline">Clear</button>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><span className="font-semibold">Name:</span> {selectedRoute.name}</p>
              <p><span className="font-semibold">Route ID:</span> {selectedRoute.id}</p>
              <p><span className="font-semibold">Distance:</span> {selectedRoute.distance} km</p>
              <p><span className="font-semibold">Stops:</span> {selectedRoute.stops.length}</p>
            </div>
            <div className="mt-3 max-h-60 overflow-y-auto border rounded">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="p-2">#</th>
                    <th className="p-2">Stop</th>
                    <th className="p-2">Latitude</th>
                    <th className="p-2">Longitude</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRoute.stops.map((s, i) => (
                    <tr key={`${s.stopName}-${i}`} className="border-b">
                      <td className="p-2">{s.stopOrder || i + 1}</td>
                      <td className="p-2">{s.stopName}</td>
                      <td className="p-2 font-mono">{s.latitude}</td>
                      <td className="p-2 font-mono">{s.longitude}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold mb-4">Add New Route</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Route Name</label>
              <input
                {...register("name", { required: true })}
                className="w-full border p-2 rounded"
                placeholder="Majestic to ITPL"
              />
              {errors.name && <span className="text-red-500 text-sm">Route name is required</span>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Number of Stops</label>
              <input
                type="number"
                {...register("stops", { required: true, min: 1 })}
                className="w-full border p-2 rounded"
                placeholder="e.g., 5"
              />
              {errors.stops && <span className="text-red-500 text-sm">Enter valid number of stops</span>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Stop Names (comma-separated)</label>
              <input
                {...register("stopNames", { required: true })}
                className="w-full border p-2 rounded"
                placeholder="Majestic, Corporation Circle, MG Road..."
              />
              {errors.stopNames && <span className="text-red-500 text-sm">Enter stop names</span>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Stop Coordinates (comma-separated, lat|lng)</label>
              <input
                {...register("stopCoords", { required: true })}
                className="w-full border p-2 rounded"
                placeholder="12.9716|77.5946, 12.9634|77.5856, ..."
              />
              {errors.stopCoords && <span className="text-red-500 text-sm">Enter stop coordinates</span>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Distance (km)</label>
              <input
                {...register("distance", { required: true, min: 0 })}
                className="w-full border p-2 rounded"
                placeholder="22"
              />
              {errors.distance && <span className="text-red-500 text-sm">Enter distance</span>}
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Add Route
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RouteManagement;
