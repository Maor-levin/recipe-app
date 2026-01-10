import { useState, useEffect } from 'react'
import { favoriteAPI } from '../utils/api'
import RecipeCard from '../components/recipe/RecipeCard'
import SearchBar from '../components/ui/SearchBar'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorAlert from '../components/ui/ErrorAlert'
import { useNavigate } from 'react-router-dom'

function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const username = localStorage.getItem('username')
    setCurrentUser(username)

    if (!username) {
      // Redirect to home if not logged in
      navigate('/')
      return
    }

    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await favoriteAPI.getMyFavorites()
      setFavorites(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching favorites:', err)
      setError('Failed to load favorites')
    } finally {
      setLoading(false)
    }
  }

  // Filter favorites based on search query (client-side for small personal dataset)
  const filteredFavorites = favorites.filter(recipe => {
    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()

    return [
      recipe.title,
      recipe.description,
      recipe.author?.username
    ].some(field => field?.toLowerCase().includes(query))
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner message="Loading favorites..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ErrorAlert
            message={error}
            actionText="Try Again"
            onAction={fetchFavorites}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          My Favorite Recipes
        </h1>
        <p className="text-lg text-gray-600">
          {favorites.length === 0
            ? 'You haven\'t favorited any recipes yet'
            : `${favorites.length} favorite ${favorites.length === 1 ? 'recipe' : 'recipes'}`
          }
        </p>
      </div>

      {/* Search Bar */}
      {favorites.length > 0 && (
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search your favorites..."
            resultCount={searchQuery ? filteredFavorites.length : null}
          />
        </div>
      )}

      {favorites.length === 0 ? (
        <EmptyState
          icon="☆"
          title="No favorites yet"
          message="Start exploring recipes and add your favorites!"
          actionText="Browse Recipes"
          onAction={() => navigate('/')}
        />
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No favorites found matching "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-yellow-700 hover:text-yellow-800 font-medium"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFavorites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites

