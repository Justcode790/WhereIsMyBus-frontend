import React from 'react';
import { Link } from 'react-router-dom';

const Vahan = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
      <div className="flex flex-col items-center space-y-6">
        <img 
          src="https://res.cloudinary.com/debc5aznw/image/upload/v1758737413/scrapbook/r3kkyfpvzrc1fghqgfen.png" 
          alt="Vahan"
          className="mb-6"
        />  

        {/* Buttons in a horizontal row */}
        <div className="flex space-x-6">
          <Link to="/login">
            <button className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-full shadow-lg hover:bg-purple-600 hover:text-white transition duration-300">
              Agency
            </button>
          </Link>

          <Link to="/user">
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition duration-300">
              User
            </button>
          </Link>

          <Link to="/driver">
            <button className="px-6 py-3 bg-white text-green-600 font-semibold rounded-full shadow-lg hover:bg-green-600 hover:text-white transition duration-300">
              Driver
            </button>
          </Link>
           <Link to="/traffic">
            <button className="px-6 py-3 bg-white text-orange-500 font-semibold rounded-full shadow-lg hover:bg-orange-600 hover:text-white transition duration-300">
              Trafic Management
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Vahan;
