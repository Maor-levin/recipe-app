import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import RecipePage from './pages/RecipePage'
import CreateRecipe from './pages/CreateRecipe'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/recipes/:id" element={<RecipePage />} />
        <Route path="/create-recipe" element={<CreateRecipe />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)
