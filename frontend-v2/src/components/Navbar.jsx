import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AuthModal from './AuthModal'

function Navbar() {
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [username, setUsername] = useState(null)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Check if user is logged in
        const storedUsername = localStorage.getItem('username')
        setUsername(storedUsername)
    }, [])

    useEffect(() => {
        // Close menu when clicking outside
        const handleClickOutside = (e) => {
            if (showUserMenu && !e.target.closest('.user-menu-container')) {
                setShowUserMenu(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [showUserMenu])

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        setUsername(null)
        setShowUserMenu(false)
        window.location.reload()
    }

    const handleCreateRecipeClick = (e) => {
        e.preventDefault()
        if (!username) {
            // Not logged in, show auth modal
            setShowAuthModal(true)
        } else {
            // Logged in, navigate to create page
            navigate('/create')
        }
    }

    return (
        <>
            <nav className="bg-gray-50 border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo Section */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">R</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800">RecipeApp</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="flex items-center space-x-6">
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-orange-500 transition"
                            >
                                Home
                            </Link>
                            <a
                                href="/create"
                                onClick={handleCreateRecipeClick}
                                className="text-gray-600 hover:text-orange-500 transition cursor-pointer"
                            >
                                Create Recipe
                            </a>
                            {username && (
                                <Link
                                    to="/favorites"
                                    className="text-gray-600 hover:text-orange-500 transition flex items-center space-x-1"
                                >
                                    <span>★</span>
                                    <span>Favorites</span>
                                </Link>
                            )}
                            <Link
                                to="/contact"
                                className="text-gray-600 hover:text-orange-500 transition"
                            >
                                Contact
                            </Link>

                            {username ? (
                                <div className="relative user-menu-container">
                                    <button
                                        onClick={() => setShowUserMenu(!showUserMenu)}
                                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center space-x-2"
                                    >
                                        <span>{username}</span>
                                        <svg
                                            className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showUserMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false)
                                                    navigate('/favorites')
                                                }}
                                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition flex items-center space-x-2"
                                            >
                                                <span>★</span>
                                                <span>My Favorites</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowUserMenu(false)
                                                    navigate('/profile')
                                                }}
                                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                            >
                                                My Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowAuthModal(true)}
                                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    )
}

export default Navbar

