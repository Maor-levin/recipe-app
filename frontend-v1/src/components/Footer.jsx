import React from 'react'
import { Link } from 'react-router-dom'

const Footer = ({ className = "" }) => {
  return (
    <footer className={`py-8 px-4 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-3">🍽️ Foody Bubble</h3>
            <p className="text-gray-400 text-sm">
              Your go-to destination for discovering and sharing delicious recipes from around the world.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-amber-400 transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-amber-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition">Contact</Link></li>
            </ul>
          </div>
          
          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3">Connect With Us</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-amber-500 rounded-full flex items-center justify-center transition">
                📷
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-amber-500 rounded-full flex items-center justify-center transition">
                🐦
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-amber-500 rounded-full flex items-center justify-center transition">
                📘
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>© 2025 Foody Bubble. Made with ❤️ for food lovers everywhere.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
