import { useState, useEffect } from 'react'
import RecipeCard from '../components/recipe/RecipeCard'
import SearchBar from '../components/ui/SearchBar'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorAlert from '../components/ui/ErrorAlert'
import { recipeAPI } from '../utils/api'

function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [logoutMessage, setLogoutMessage] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

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

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter(recipe => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      recipe.title?.toLowerCase()?.includes(query) ||
      recipe.description?.toLowerCase()?.includes(query) ||
      recipe.author?.username?.toLowerCase()?.includes(query)
    )
  })

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

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search recipes by title, description, or author..."
          resultCount={searchQuery ? filteredRecipes.length : null}
        />
      </div>

      {/* Recipes Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {searchQuery ? 'Search Results' : 'All Recipes'}
        </h2>

        {loading ? (
          <LoadingSpinner message="Loading recipes..." />
        ) : error ? (
          <ErrorAlert message={error} className="text-center py-6" />
        ) : recipes.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">No recipes yet. Be the first to create one!</p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No recipes found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-yellow-700 hover:text-yellow-800 font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

