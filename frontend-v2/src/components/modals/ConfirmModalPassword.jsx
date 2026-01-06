import { useState } from 'react'

/**
 * Generic confirmation modal that requires password input
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {string} title - Modal title
 * @param {string} message - Main message (can be string or JSX)
 * @param {Function} onConfirm - Callback with password: (password) => Promise<void>
 * @param {Function} onCancel - Callback when user cancels
 * @param {string} confirmButtonText - Text for confirm button (default: "Confirm")
 * @param {string} confirmButtonColor - Tailwind color class (default: "red")
 */
function ConfirmModalPassword({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmButtonText = 'Confirm',
    confirmButtonColor = 'red'
}) {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    if (!isOpen) return null

    const handleConfirm = async () => {
        if (!password.trim()) {
            setError('Password is required')
            return
        }

        setLoading(true)
        setError('')

        try {
            await onConfirm(password)
            // Reset state on success
            setPassword('')
            setError('')
        } catch (err) {
            console.error('Error in confirmation action:', err)
            if (err.response?.status === 401) {
                setError('Incorrect password')
            } else {
                setError(err.response?.data?.detail || 'An error occurred. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setPassword('')
        setError('')
        onCancel()
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
        setError('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && password.trim() && !loading) {
            handleConfirm()
        }
    }

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={handleCancel}
        >
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {title}
                </h3>

                {/* Message */}
                <div className="text-gray-700 mb-6">
                    {typeof message === 'string' ? <p>{message}</p> : message}

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter your password to confirm:
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            autoFocus
                            disabled={loading}
                        />
                        {error && (
                            <p className="text-red-600 text-sm mt-2">{error}</p>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || !password.trim()}
                        className={`px-4 py-2 bg-${confirmButtonColor}-600 text-white rounded-lg hover:bg-${confirmButtonColor}-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {loading ? 'Processing...' : confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModalPassword

