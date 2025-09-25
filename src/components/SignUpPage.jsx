import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
const API_URL = 'https://whereismybus-1.onrender.com';

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const navigate = useNavigate();
  const onSubmit = async(data) => {
    console.log("Form Data:", data);
    alert(`Welcome ${data.name}, your account has been created!`);
    
    try {
        const res = await fetch(`${API_URL}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    
        const response = await res.json();
        if (res.ok) {
          navigate("/login");
          reset();
        }
        reset()
        

    
        // Navigate if successful
        // if (response.message === "User logged successfully") {
        //     navigate('/home');
        // }
    } catch (err) {
        console.error("Error:", err);
    }

  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans bg-cover bg-center"
      style={{ backgroundImage: "url('./people-waiting-bus-bus-stop.png')" }} 
    >
      <div className="bg-white/50 p-10 rounded-lg shadow-xl w-full max-w-md backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
          <p className="text-gray-500">National Bus Tracking Platform</p>
        </div>

        {/* SignUp Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              {...register("name", { required: "Name is required" })}
              placeholder="Tushar Kumar"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight 
                         focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
              })}
              placeholder="tushar110704@gmail.com"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight 
                         focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              placeholder="********"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight 
                         focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value, formValues) =>
                  value === formValues.password || "Passwords do not match",
              })}
              placeholder="********"
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight 
                         focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-blue-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg 
                       focus:outline-none focus:shadow-outline w-full transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
