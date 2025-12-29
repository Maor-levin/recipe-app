import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { recipeAPI } from '../utils/api'
import CommentsSection from '../components/CommentsSection'
import AuthModal from '../components/AuthModal'
import FavoriteButton from '../components/FavoriteButton'
import NotesSection from '../components/NotesSection'

function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [notesRefresh, setNotesRefresh] = useState(0)

  useEffect(() => {
    fetchRecipe()
  }, [id])

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

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return ''
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600 text-lg mb-4">{error || 'Recipe not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            Back to Home
          </button>
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
                  <div className="ml-4">
                    <FavoriteButton
                      recipeId={recipe.id}
                      onAuthRequired={() => setShowAuthModal(true)}
                      onUnfavorite={() => setNotesRefresh(prev => prev + 1)}
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
              <div className="space-y-6">
                {recipe.recipe && recipe.recipe.length > 0 ? (
                  recipe.recipe.map((block, index) => (
                    <div key={index}>
                      {/* Subtitle Block */}
                      {block.type === 'subtitle' && (
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-orange-500">
                          {block.text}
                        </h2>
                      )}

                      {/* Text Block */}
                      {block.type === 'text' && (
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {block.text}
                        </p>
                      )}

                      {/* List Block */}
                      {block.type === 'list' && (
                        <ul className="space-y-2">
                          {block.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start">
                              <span className="text-orange-500 mr-3 mt-1">•</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Image Block */}
                      {block.type === 'image' && block.url && (
                        <div className="my-6 rounded-lg overflow-hidden">
                          <img
                            src={block.url}
                            alt="Recipe step"
                            className="w-full h-auto"
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No recipe content available.
                  </p>
                )}
              </div>
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
                onAuthRequired={() => setShowAuthModal(true)}
                refreshTrigger={notesRefresh}
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

