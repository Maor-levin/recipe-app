import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/layout/Header'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import RecipeDetail from './pages/RecipeDetail'
import CreateRecipe from './pages/CreateRecipe'
import Profile from './pages/Profile'
import Favorites from './pages/Favorites'
import Contact from './pages/Contact'

function App() {
  const [logoutMessage, setLogoutMessage] = useState(null)

  useEffect(() => {
    // Check for logout message from session expiration
    const message = sessionStorage.getItem("logoutMessage")
    if (message) {
      setLogoutMessage(message)
      sessionStorage.removeItem("logoutMessage") // Clear after reading
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setLogoutMessage(null)
      }, 5000)
    }
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <Navbar />
        
        {/* Global Logout Message */}
        {logoutMessage && (
          <div className="container mx-auto px-4 pt-4">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-2 flex items-center justify-between">
              <span>{logoutMessage}</span>
              <button
                onClick={() => setLogoutMessage(null)}
                className="ml-4 text-yellow-600 hover:text-yellow-800 font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipes/:id" element={<RecipeDetail />} />
            <Route path="/recipes/:id/edit" element={<CreateRecipe />} />
            <Route path="/create" element={<CreateRecipe />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>

        <Footer />
      </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

