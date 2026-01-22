import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userAPI, recipeAPI, favoriteAPI, noteAPI } from '../utils/api'
import RecipeCard from '../components/recipe/RecipeCard'
import ConfirmModalPassword from '../components/modals/ConfirmModalPassword'
import StatsCard from '../components/ui/StatsCard'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorAlert from '../components/ui/ErrorAlert'
import { formatDate } from '../utils/dateUtils'

function Profile() {
  const { isAuthenticated, logout, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [favorites, setFavorites] = useState([])
  const [notes, setNotes] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    // Wait for auth to load before checking
    if (authLoading) return

    if (!isAuthenticated) {
      navigate('/')
      return
    }
    fetchProfileData()
  }, [isAuthenticated, authLoading])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch user info
      const userResponse = await userAPI.getMe()
      const userData = userResponse.data
      setUser(userData)

      // Fetch user's recipes
      const recipesResponse = await recipeAPI.getByUser(userData.id)
      setRecipes(recipesResponse.data)

      // Fetch favorites
      const favoritesResponse = await favoriteAPI.getMyFavorites()
      setFavorites(favoritesResponse.data)

      // Fetch notes
      const notesResponse = await noteAPI.getMyNotes()
      setNotes(notesResponse.data)

      // Calculate comments count (fetch all recipes and count comments)
      // For now, we'll estimate or skip - could add endpoint later
      setComments([]) // Placeholder - would need endpoint to get user's comments
    } catch (err) {
      console.error('Error fetching profile data:', err)
      if (err.response?.status === 401) {
        navigate('/')
      } else {
        setError('Failed to load profile. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner message="Loading profile..." />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ErrorAlert
            message={error || 'Failed to load profile'}
            actionText="Try Again"
            onAction={fetchProfileData}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.user_name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{user.user_name}</h1>
            <p className="text-gray-600 mt-1">
              Member since {formatDate(user.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard value={recipes.length} label="Recipes" />
        <StatsCard value={favorites.length} label="Favorites" />
        <StatsCard value={notes.length} label="Notes" />
        <StatsCard value={comments.length} label="Comments" />
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Full Name</label>
            <p className="text-lg text-gray-900">
              {user.first_name} {user.last_name}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg text-gray-900">{user.email}</p>
          </div>
          {user.country && (
            <div>
              <label className="text-sm font-medium text-gray-500">Country</label>
              <p className="text-lg text-gray-900">{user.country}</p>
            </div>
          )}
        </div>
      </div>

      {/* My Recipes */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Recipes</h2>
          <button
            onClick={() => navigate('/create')}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Create New Recipe
          </button>
        </div>

        {recipes.length === 0 ? (
          <EmptyState
            icon="🍽️"
            title="No recipes yet"
            message="Start sharing your favorite recipes with the community!"
            actionText="Create Your First Recipe"
            onAction={() => navigate('/create')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>

      {/* Account Management */}
      <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-red-500">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Management</h2>
        <p className="text-gray-600 mb-6">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Modal */}
      <ConfirmModalPassword
        isOpen={showDeleteModal}
        title="Delete Account"
        message={
          <div>
            <p className="mb-4">
              Are you sure you want to delete your account? This will permanently delete:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
              <li>All your recipes</li>
              <li>All your favorites</li>
              <li>All your notes</li>
            </ul>
            <p className="text-red-600 font-semibold">This action cannot be undone.</p>
          </div>
        }
        onConfirm={async (password) => {
          await userAPI.deleteAccount(password)
          // Clear auth and redirect using centralized logout
          logout()
          navigate('/')
          // No reload needed - AuthContext clears state automatically! ✅
        }}
        onCancel={() => setShowDeleteModal(false)}
        confirmButtonText="Delete Account"
        confirmButtonColor="red"
      />
    </div>
  )
}

export default Profile
