import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';

const NavBar = ({ className = "", onLoginClick }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleNewRecipeClick = () => {
    if (user) {
      navigate('/create-recipe');
    } else {
      // Store intent to redirect after login
      sessionStorage.setItem('redirectAfterLogin', '/create-recipe');
      onLoginClick();
    }
  };

  return (
    <nav className={`flex justify-between items-center p-4 bg-yellow-300 ${className}`}>
      <Link to="/">
        <h1 className='text-2xl font-bold hover:text-yellow-700 transition'>Foody Bubble</h1>
      </Link>
      <div className="flex items-center gap-6">
        <ul className='flex space-x-4'>
          <li><Link to="/" className="hover:text-yellow-700 transition">Home</Link></li>
          <li><Link to="/about" className="hover:text-yellow-700 transition">About</Link></li>
          <li><Link to="/contact" className="hover:text-yellow-700 transition">Contact</Link></li>
        </ul>

        {/* New Recipe Button */}
        <button
          onClick={handleNewRecipeClick}
          className="bg-yellow-500 hover:bg-yellow-600 px-3 py-2 rounded-lg font-semibold transition flex items-center gap-1"
          title="Create new recipe"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">New Recipe</span>
        </button>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold transition"
            >
              {user.user_name}
              <svg
                className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/my-recipes"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Recipes
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg font-semibold transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
