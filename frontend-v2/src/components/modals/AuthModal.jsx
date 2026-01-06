import { useState } from 'react'
import { authAPI } from '../../utils/api'

function AuthModal({ isOpen, onClose }) {
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        country: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            if (isLogin) {
                // Login
                const response = await authAPI.login({
                    username: formData.username,
                    password: formData.password
                })

                // Store token and username from response (capitalized)
                localStorage.setItem('token', response.data.access_token)
                localStorage.setItem('username', response.data.user.user_name)

                // Close modal and reset form
                setFormData({ username: '', email: '', password: '' })
                onClose()

                // Reload to update UI
                window.location.reload()
            } else {
                // Register
                await authAPI.register({
                    user_name: formData.username,
                    email: formData.email,
                    password: formData.password,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    country: formData.country || null
                })

                // After successful register, automatically login
                const loginResponse = await authAPI.login({
                    username: formData.username,
                    password: formData.password
                })

                // Store token and username from response (capitalized)
                localStorage.setItem('token', loginResponse.data.access_token)
                localStorage.setItem('username', loginResponse.data.user.user_name)

                // Close modal and reset form
                setFormData({ username: '', email: '', password: '', first_name: '', last_name: '', country: '' })
                onClose()

                // Reload to update UI
                window.location.reload()
            }
        } catch (err) {
            console.error('Auth error:', err)
            if (err.response?.data?.detail) {
                if (typeof err.response.data.detail === 'string') {
                    setError(err.response.data.detail)
                } else {
                    setError(JSON.stringify(err.response.data.detail))
                }
            } else {
                setError(isLogin ? 'Login failed. Please try again.' : 'Registration failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('') // Clear error when user types
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal */}
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                >
                    ×
                </button>

                {/* Content */}
                <div className="p-8">
                    {/* Title */}
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {isLogin ? 'Login to your account' : 'Sign up to get started'}
                    </p>

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                placeholder="Enter your username"
                            />
                        </div>

                        {/* Additional fields for register */}
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                            placeholder="First name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                            placeholder="Last name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Country (optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                        placeholder="Your country"
                                    />
                                </div>
                            </>
                        )}

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                        </button>
                    </form>

                    {/* Toggle between Login/Register */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-orange-500 hover:text-orange-600 font-medium"
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AuthModal

