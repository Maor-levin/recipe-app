import { useState, useEffect } from 'react'
import { favoriteAPI } from '../utils/api'
import RecipeCard from '../components/RecipeCard'
import { useNavigate } from 'react-router-dom'

function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading favorites...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchFavorites}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Try Again
          </button>
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

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">☆</div>
          <p className="text-xl text-gray-600 mb-2">No favorites yet</p>
          <p className="text-gray-500 mb-6">
            Start exploring recipes and add your favorites!
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Browse Recipes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites

