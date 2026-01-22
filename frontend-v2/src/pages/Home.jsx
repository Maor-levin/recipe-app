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
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch recipes (all or filtered by search)
  const fetchRecipes = async (query = '') => {
    try {
      setLoading(true)
      const response = await recipeAPI.search(query)
      setRecipes(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching recipes:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        baseURL: err.config?.baseURL
      })

      // Show detailed error message
      let errorMsg = 'Failed to load recipes.'
      if (err.response) {
        errorMsg += ` Status: ${err.response.status}. `
        if (err.response.status === 0) {
          errorMsg += 'CORS or network error - check if backend is accessible.'
        } else if (err.response.data?.detail) {
          errorMsg += err.response.data.detail
        }
      } else if (err.request) {
        errorMsg += ' Network error - backend may be unreachable. Check console for API URL.'
      } else {
        errorMsg += ` Error: ${err.message}`
      }
      // Also log the full URL being used
      const apiUrl = err.config?.baseURL || 'unknown'
      errorMsg += ` (API: ${apiUrl})`
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all recipes on component mount
  useEffect(() => {
    fetchRecipes()
  }, [])

  // Handle search button click
  const handleSearch = () => {
    fetchRecipes(searchQuery)
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
        <div className="flex gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search recipes by title, description, or author..."
              resultCount={null}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onClear={() => {
                setSearchQuery('')
                fetchRecipes('')
              }}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            Search
          </button>
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-600 text-center">
            {recipes.length} {recipes.length === 1 ? 'result' : 'results'}
          </div>
        )}
      </div>

      {/* Recipes Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {searchQuery ? 'Search Results' : 'All Recipes'}
        </h2>

        {loading ? (
          <LoadingSpinner message={searchQuery ? "Searching..." : "Loading recipes..."} />
        ) : error ? (
          <ErrorAlert message={error} className="text-center py-6" />
        ) : recipes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">
              {searchQuery ? `No recipes found matching "${searchQuery}"` : 'No recipes yet. Be the first to create one!'}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  fetchRecipes('')
                }}
                className="mt-4 text-yellow-700 hover:text-yellow-800 font-medium"
              >
                Clear search
              </button>
            )}
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

