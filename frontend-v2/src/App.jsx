import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import RecipeList from './pages/RecipeList'
import RecipeDetail from './pages/RecipeDetail'
import CreateRecipe from './pages/CreateRecipe'
import Login from './pages/Login'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/create" element={<CreateRecipe />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

