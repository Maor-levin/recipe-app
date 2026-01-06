import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recipeAPI, favoriteAPI, userAPI } from '../utils/api'
import CommentsSection from '../components/comments/CommentsSection'
import AuthModal from '../components/modals/AuthModal'
import FavoriteButton from '../components/FavoriteButton'
import NotesSection from '../components/NotesSection'
import RecipeBlockRenderer from '../components/recipe/RecipeBlockRenderer'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorAlert from '../components/ui/ErrorAlert'
import { formatDate } from '../utils/dateUtils'

function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [checkingFavorite, setCheckingFavorite] = useState(true)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    fetchRecipe()
    checkFavoriteStatus()
  }, [id])

  useEffect(() => {
    const checkOwnership = async () => {
      if (!recipe) {
        setIsOwner(false)
        return
      }

      const username = localStorage.getItem('username')
      if (!username) {
        setIsOwner(false)
        return
      }

      try {
        const userResponse = await userAPI.getMe()
        const currentUserId = userResponse.data.id

        setIsOwner(recipe.author_id === currentUserId)
      } catch (err) {
        setIsOwner(false)
      }
    }

    checkOwnership()
  }, [recipe])

  const checkFavoriteStatus = async () => {
    const username = localStorage.getItem('username')
    if (!username) {
      setCheckingFavorite(false)
      return
    }

    try {
      setCheckingFavorite(true)
      const response = await favoriteAPI.check(id)
      setIsFavorited(response.data.is_favorited)
    } catch (err) {
      // If not authenticated or error, default to false
      setIsFavorited(false)
    } finally {
      setCheckingFavorite(false)
    }
  }

  const handleFavoriteChange = (newValue) => {
    setIsFavorited(newValue)
  }

  const fetchRecipe = async () => {
    try {
      setLoading(true)
      const response = await recipeAPI.getById(id)
      setRecipe(response.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching recipe:', err)
      setError('Failed to load recipe.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner message="Loading recipe..." />
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ErrorAlert
            message={error || 'Recipe not found'}
            actionText="Back to Home"
            onAction={() => navigate('/')}
            variant="error"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-gray-600 hover:text-orange-500 transition flex items-center"
        >
          <span className="mr-2">←</span> Back to Recipes
        </button>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recipe Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Header */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Thumbnail */}
              {recipe.thumbnail_image_url && (
                <div className="h-96 overflow-hidden">
                  <img
                    src={recipe.thumbnail_image_url}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Title and Metadata */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-4xl font-bold text-gray-900 flex-1 text-center">
                    {recipe.title}
                  </h1>
                  <div className="ml-4 flex items-center gap-3">
                    {isOwner && (
                      <button
                        onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                        title="Edit Recipe"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    <FavoriteButton
                      recipeId={recipe.id}
                      isFavorited={isFavorited}
                      onFavoriteChange={handleFavoriteChange}
                      onAuthRequired={() => setShowAuthModal(true)}
                      size="large"
                    />
                  </div>
                </div>

                {/* Author and Date */}
                <div className="flex items-center justify-center text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                  <span>By: {recipe.author?.user_name || `User #${recipe.author_id}`}</span>
                  <span className="text-gray-300 mx-3">|</span>
                  <span>{formatDate(recipe.created_at)}</span>
                </div>

                {/* Description */}
                {recipe.description && (
                  <p className="text-lg text-gray-700 text-center mb-6">
                    {recipe.description}
                  </p>
                )}
              </div>
            </div>

            {/* Recipe Content Blocks */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <RecipeBlockRenderer blocks={recipe.recipe} />
            </div>

            {/* Comments Section */}
            <CommentsSection
              recipeId={recipe.id}
              onAuthRequired={() => setShowAuthModal(true)}
            />
          </div>

          {/* Right Column - Notes Section (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 h-[calc(100vh-8rem)]">
              <NotesSection
                recipeId={recipe.id}
                isFavorited={isFavorited}
                onAuthRequired={() => setShowAuthModal(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  )
}

export default RecipeDetail

