/**
 * CreateRecipe Page
 * 
 * Main page for creating and editing recipes
 * Handles form state, recipe loading/saving, and orchestrates child components
 * 
 * Features:
 * - Create new recipes or edit existing ones
 * - Template-based quick start
 * - Drag-and-drop block ordering
 * - Image upload integration
 * - Autosave functionality (future enhancement)
 */

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { recipeAPI, userAPI } from '../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import { useRecipeBlocks } from '../hooks/useRecipeBlocks'
import { cleanRecipeBlocks } from '../utils/recipeBlockUtils'

// UI Components
import ConfirmModal from '../components/modals/ConfirmModal'
import ConfirmModalPassword from '../components/modals/ConfirmModalPassword'
import BulkUploadRecipes from '../components/recipe/BulkUploadRecipes'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorAlert from '../components/ui/ErrorAlert'

// Recipe-specific Components
import RecipeFormBasicInfo from '../components/recipe/RecipeFormBasicInfo'
import TemplateSelector from '../components/recipe/TemplateSelector'
import RecipeBlockEditor from '../components/recipe/RecipeBlockEditor'
import AddBlockButtons from '../components/recipe/AddBlockButtons'

function CreateRecipe() {
  const { isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  // Basic recipe information
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail_image_url: ''
  })

  // Recipe content blocks (managed by custom hook)
  const {
    blocks,
    setBlocks,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlockUp,
    moveBlockDown,
    updateListItem,
    addListItem,
    removeListItem
  } = useRecipeBlocks([])

  // UI State
  const [loading, setLoading] = useState(false)
  const [loadingRecipe, setLoadingRecipe] = useState(isEditMode)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [imageUploadError, setImageUploadError] = useState('')

  // ============================================
  // LOAD RECIPE (EDIT MODE)
  // ============================================

  useEffect(() => {
    if (isEditMode) {
      loadRecipe()
    }
  }, [id])

  const loadRecipe = async () => {
    try {
      setLoadingRecipe(true)
      setError('')

      // Wait for auth to load
      if (authLoading) return

      // Check authentication
      if (!isAuthenticated) {
        setError('You must be logged in to edit recipes')
        setTimeout(() => navigate('/'), 2000)
        return
      }

      // Verify ownership
      const userResponse = await userAPI.getMe()
      const currentUserId = userResponse.data.id

      const response = await recipeAPI.getById(id)
      const recipe = response.data

      if (recipe.author_id !== currentUserId) {
        setError('You can only edit your own recipes')
        setTimeout(() => navigate('/'), 2000)
        return
      }

      // Populate form data
      setFormData({
        title: recipe.title || '',
        description: recipe.description || '',
        thumbnail_image_url: recipe.thumbnail_image_url || ''
      })

      // Populate blocks with unique IDs for React keys
      if (recipe.recipe && recipe.recipe.length > 0) {
        const blocksWithIds = recipe.recipe.map((block, index) => ({
          ...block,
          id: Date.now() + index
        }))
        setBlocks(blocksWithIds)
      } else {
        setBlocks([])
      }
    } catch (err) {
      console.error('Error loading recipe:', err)
      if (err.response?.status === 404) {
        setError('Recipe not found')
      } else if (err.response?.status === 403) {
        setError('You can only edit your own recipes')
      } else {
        setError('Failed to load recipe. Please try again.')
      }
      setTimeout(() => navigate('/'), 2000)
    } finally {
      setLoadingRecipe(false)
    }
  }

  // ============================================
  // FORM HANDLERS
  // ============================================

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageError = (errorMessage) => {
    setImageUploadError(errorMessage)
    setTimeout(() => setImageUploadError(''), 5000)
  }

  // ============================================
  // TEMPLATE HANDLERS
  // ============================================

  const applyDefaultTemplate = () => {
    const defaultBlocks = [
      {
        id: Date.now() + 1,
        type: 'text',
        text: 'This recipe works great for weeknight dinners, meal prep, or when you want to impress guests without spending hours in the kitchen.'
      },
      {
        id: Date.now() + 2,
        type: 'subtitle',
        text: 'Ingredients'
      },
      {
        id: Date.now() + 3,
        type: 'list',
        items: [
          'Main ingredient 1',
          'Main ingredient 2',
          'Spices and seasonings',
          'Optional garnishes'
        ]
      },
      {
        id: Date.now() + 4,
        type: 'subtitle',
        text: 'Preparation Steps'
      },
      {
        id: Date.now() + 5,
        type: 'text',
        text: 'Step 1: Prepare your ingredients by washing and chopping as needed.\n' +
          'Step 2: Heat your cooking vessel and add the main ingredients.\n' +
          'Step 3: Season to taste and cook until done.\n' +
          'Step 4: Serve hot and enjoy!'
      }
    ]
    setBlocks(defaultBlocks)
  }

  const applyCustomTemplate = () => {
    setBlocks([])
  }

  // ============================================
  // DELETE HANDLER
  // ============================================

  const handleDeleteRecipe = async (password) => {
    await recipeAPI.delete(id, password)
    navigate('/profile')
  }

  // ============================================
  // SUBMIT HANDLER
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Clean and format blocks for API submission
      const cleanedBlocks = cleanRecipeBlocks(blocks)

      const recipeData = {
        ...formData,
        recipe: cleanedBlocks
      }

      if (isEditMode) {
        // Update existing recipe
        await recipeAPI.update(id, recipeData)
        navigate(`/recipes/${id}`)
      } else {
        // Create new recipe
        const response = await recipeAPI.create(recipeData)
        navigate(`/recipes/${response.data.id}`)
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} recipe:`, err)
      if (err.response?.status === 403) {
        setError('You can only edit your own recipes')
      } else if (err.response?.status === 404) {
        setError('Recipe not found')
      } else {
        setError(`Failed to ${isEditMode ? 'update' : 'create'} recipe. Please try again.`)
      }
    } finally {
      setLoading(false)
    }
  }

  // ============================================
  // RENDER
  // ============================================

  if (loadingRecipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner message="Loading recipe..." />
      </div>
    )
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      <ConfirmModalPassword
        isOpen={showDeleteConfirm}
        title="Delete Recipe?"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        onConfirm={handleDeleteRecipe}
        onCancel={() => setShowDeleteConfirm(false)}
        confirmButtonText="Delete Recipe"
        confirmButtonColor="red"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
          </h1>

          {/* Error Display */}
          {error && <ErrorAlert message={error} className="mb-6" />}

          {/* Bulk Upload (Create Mode Only) */}
          {!isEditMode && <BulkUploadRecipes />}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <RecipeFormBasicInfo
              formData={formData}
              onChange={handleFormChange}
            />

            {/* Recipe Content Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recipe Content</h2>

              {/* Template Selector */}
              <div className="mb-6">
                <TemplateSelector
                  onSelectDefault={applyDefaultTemplate}
                  onSelectCustom={applyCustomTemplate}
                  hasExistingBlocks={blocks.length > 0}
                />
              </div>

              {/* Image Upload Error Display */}
              {imageUploadError && (
                <ErrorAlert
                  message={imageUploadError}
                  className="mb-4"
                />
              )}

              {/* Recipe Blocks Editor */}
              <div className="mb-6">
                <RecipeBlockEditor
                  blocks={blocks}
                  onUpdateBlock={updateBlock}
                  onRemoveBlock={removeBlock}
                  onMoveBlockUp={moveBlockUp}
                  onMoveBlockDown={moveBlockDown}
                  onUpdateListItem={updateListItem}
                  onAddListItem={addListItem}
                  onRemoveListItem={removeListItem}
                  onImageError={handleImageError}
                />
              </div>

              {/* Add Block Buttons */}
              <AddBlockButtons onAddBlock={addBlock} />
            </div>

            {/* Form Actions */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <div className="flex gap-3">
                {isEditMode && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete Recipe
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (isEditMode ? 'Update Recipe' : 'Create Recipe')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateRecipe
