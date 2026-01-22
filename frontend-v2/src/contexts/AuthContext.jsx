import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    // Load auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        const storedUsername = localStorage.getItem('username')

        if (storedToken && storedUsername) {
            setToken(storedToken)
            setUser({ username: storedUsername })
        }

        setLoading(false)
    }, [])

    // Sync token to localStorage whenever it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    }, [token])

    // Sync user to localStorage whenever it changes
    useEffect(() => {
        if (user?.username) {
            localStorage.setItem('username', user.username)
        } else {
            localStorage.removeItem('username')
        }
    }, [user])

    const login = (accessToken, userData) => {
        setToken(accessToken)
        setUser(userData)
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('username')
    }

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user && !!token,
        login,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
