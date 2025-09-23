import React from 'react';
import { Link } from 'react-router-dom';
const API_URL = 'https://whereismybus-1.onrender.com';

const LoginPage = ({ onLogin }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.username.value;
    const password = e.target.password.value;
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || 'Login failed');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('agency', JSON.stringify(data.agency));
      onLogin();
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans bg-cover bg-center"
      style={{ backgroundImage: "url('./people-waiting-bus-bus-stop.png')" }} 
    >
      <div className="bg-white/50 p-10 rounded-lg shadow-xl w-full max-w-md backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Agency Portal Login</h1>
          <p className="text-gray-500">National Bus Tracking Platform</p>
        </div>

        {/* Agency Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Agency ID / Email
            </label>
            <input
              id="username"
              type="text"
              placeholder="your.agency@gov.in"
              defaultValue="demo@agency.com"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight 
                         focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="******************"
              defaultValue="password"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight 
                         focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            {/* Submit button = Agency Login */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg 
                         focus:outline-none focus:shadow-outline w-full transition"
            >
              Log In
            </button>

            <Link to="/signup" className="w-full">
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg 
                           focus:outline-none focus:shadow-outline w-full transition"
              >
                Sign Up
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
