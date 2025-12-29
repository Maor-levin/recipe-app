import { useState, useEffect } from 'react'
import RecipeCard from '../components/RecipeCard'
import { recipeAPI } from '../utils/api'

function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [logoutMessage, setLogoutMessage] = useState(null)

  useEffect(() => {
    // Check for logout message from session expiration
    const message = sessionStorage.getItem("logoutMessage");
    if (message) {
      setLogoutMessage(message);
      sessionStorage.removeItem("logoutMessage"); // Clear after reading
    }
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const response = await recipeAPI.getAll()
      setRecipes(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching recipes:', err)
      setError('Failed to load recipes. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Logout Message */}
      {logoutMessage && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
          {logoutMessage}
        </div>
      )}

      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Welcome to Recipe App
        </h1>
        <p className="text-lg text-gray-600">
          Discover and share amazing recipes
        </p>
      </div>

      {/* Recipes Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Recipes</h2>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Loading recipes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-lg">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No recipes yet. Be the first to create one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

