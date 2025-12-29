import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { userAPI, recipeAPI, favoriteAPI, noteAPI } from '../utils/api'
import RecipeCard from '../components/RecipeCard'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [recipes, setRecipes] = useState([])
  const [favorites, setFavorites] = useState([])
  const [notes, setNotes] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    const username = localStorage.getItem('username')
    if (!username) {
      navigate('/')
      return
    }
    fetchProfileData()
  }, [])

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Unknown date'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
    setDeletePassword('')
    setDeleteError('')
  }

  const handleConfirmDelete = async () => {
    if (!deletePassword.trim()) {
      setDeleteError('Password is required')
      return
    }

    setDeleting(true)
    setDeleteError('')

    try {
      await userAPI.deleteAccount(deletePassword)
      // Clear auth and redirect
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      navigate('/')
      window.location.reload()
    } catch (err) {
      console.error('Error deleting account:', err)
      if (err.response?.status === 401) {
        setDeleteError('Incorrect password')
      } else {
        setDeleteError('Failed to delete account. Please try again.')
      }
    } finally {
      setDeleting(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setDeletePassword('')
    setDeleteError('')
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600 text-lg mb-4">{error || 'Failed to load profile'}</p>
          <button
            onClick={fetchProfileData}
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
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-orange-500 mb-2">{recipes.length}</div>
          <div className="text-gray-600">Recipes</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-orange-500 mb-2">{favorites.length}</div>
          <div className="text-gray-600">Favorites</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-orange-500 mb-2">{notes.length}</div>
          <div className="text-gray-600">Notes</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-orange-500 mb-2">—</div>
          <div className="text-gray-600">Comments</div>
        </div>
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
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-xl text-gray-600 mb-2">No recipes yet</p>
            <p className="text-gray-500 mb-6">
              Start sharing your favorite recipes with the community!
            </p>
            <button
              onClick={() => navigate('/create')}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Create Your First Recipe
            </button>
          </div>
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
          onClick={handleDeleteAccount}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          onClick={handleCancelDelete}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Delete Account
            </h3>

            {/* Message */}
            <div className="text-gray-700 mb-6">
              <p className="mb-4">
                Are you sure you want to delete your account? This will permanently delete:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                <li>All your recipes</li>
                <li>All your comments</li>
                <li>All your favorites</li>
                <li>All your notes</li>
              </ul>
              <p className="text-red-600 font-semibold mb-4">This action cannot be undone.</p>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your password to confirm:
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value)
                    setDeleteError('')
                  }}
                  placeholder="Your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && deletePassword.trim()) {
                      handleConfirmDelete()
                    }
                  }}
                />
                {deleteError && (
                  <p className="text-red-600 text-sm mt-2">{deleteError}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting || !deletePassword.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
