import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { recipeAPI, favoriteAPI } from '../utils/api'
import CommentsSection from '../components/comments/CommentsSection'
import AuthModal from '../components/modals/AuthModal'
import NotesSection from '../components/NotesSection'
import RecipeBlockRenderer from '../components/recipe/RecipeBlockRenderer'
import RecipeHeader from '../components/recipe/RecipeHeader'
import AIAdjustmentSidebar from '../components/recipe/AIAdjustmentSidebar'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorAlert from '../components/ui/ErrorAlert'
import { useRecipeOwnership } from '../hooks/useRecipeOwnership'

function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [checkingFavorite, setCheckingFavorite] = useState(true)
  const [variant, setVariant] = useState(null)

  // Use custom hook for ownership checking
  const isOwner = useRecipeOwnership(recipe)

  // Fetch recipe on mount or when id changes
  useEffect(() => {
    fetchRecipe()
  }, [id])

  // Check favorite status when auth is ready
  useEffect(() => {
    if (!authLoading) {
      checkFavoriteStatus()
    }
  }, [id, isAuthenticated, authLoading])

  const checkFavoriteStatus = async () => {
    if (!isAuthenticated) {
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

  const handleVariantGenerated = (variantData, adjustments) => {
    setVariant({ ...variantData, adjustments })
  }

  const handleVariantReset = () => {
    setVariant(null)
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
      <div className="max-w-[1600px] mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-gray-600 hover:text-orange-500 transition flex items-center"
        >
          <span className="mr-2">←</span> Back to Recipes
        </button>

        {/* Three Column Layout: Adjustments | Recipe | Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar - AI Adjustments */}
          <div className="lg:col-span-2">
            <AIAdjustmentSidebar
              recipeId={id}
              onVariantGenerated={handleVariantGenerated}
              onReset={handleVariantReset}
              hasActiveVariant={variant !== null}
            />
          </div>

          {/* Middle Column - Recipe Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* Recipe Header */}
            <RecipeHeader
              recipe={recipe}
              variant={variant}
              isOwner={isOwner}
              isFavorited={isFavorited}
              onFavoriteChange={handleFavoriteChange}
              onAuthRequired={() => setShowAuthModal(true)}
              onEdit={() => navigate(`/recipes/${recipe.id}/edit`)}
            />

            {/* Recipe Content Blocks */}
            <div className={`bg-white rounded-lg shadow-lg p-8 ${variant ? 'border-2 border-purple-200' : ''}`}>
              <RecipeBlockRenderer
                blocks={variant ? variant.modified_blocks : recipe.recipe}
                className={variant ? 'variant-highlight' : ''}
              />
            </div>

            {/* Comments Section */}
            <CommentsSection
              recipeId={recipe.id}
              onAuthRequired={() => setShowAuthModal(true)}
            />
          </div>

          {/* Right Column - Notes Section (Sticky) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 h-[calc(100vh-8rem)] min-w-[300px]">
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

