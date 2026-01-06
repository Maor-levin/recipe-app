import { useState, useEffect } from 'react'
import { recipeAPI, userAPI } from '../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmModal from '../components/modals/ConfirmModal'
import ConfirmModalPassword from '../components/modals/ConfirmModalPassword'
import BulkUploadRecipes from '../components/recipe/BulkUploadRecipes'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ErrorAlert from '../components/ui/ErrorAlert'
import RecipeFormBasicInfo from '../components/recipe/RecipeFormBasicInfo'

function CreateRecipe() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail_image_url: ''
  })
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingRecipe, setLoadingRecipe] = useState(isEditMode)
  const [error, setError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

  // Load recipe data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      loadRecipe()
    }
  }, [id])

  const loadRecipe = async () => {
    try {
      setLoadingRecipe(true)
      setError('')

      // Get current user to check ownership
      const username = localStorage.getItem('username')
      if (!username) {
        setError('You must be logged in to edit recipes')
        setTimeout(() => navigate('/'), 2000)
        return
      }

      let currentUserId = null
      try {
        const userResponse = await userAPI.getMe()
        currentUserId = userResponse.data.id
      } catch (err) {
        setError('Failed to verify authentication')
        setTimeout(() => navigate('/'), 2000)
        return
      }

      const response = await recipeAPI.getById(id)
      const recipe = response.data

      // Check if user owns this recipe
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

      // Populate blocks (add id field for React keys)
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

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type: type
    }

    switch (type) {
      case 'subtitle':
        newBlock.text = ''
        break
      case 'text':
        newBlock.text = ''
        break
      case 'list':
        newBlock.items = ['', '']
        break
      case 'image':
        newBlock.url = ''
        break
      default:
        break
    }

    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id, field, value) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, [field]: value } : block
    ))
  }

  const handleTextareaResize = (e) => {
    const textarea = e.target
    // Save scroll position
    const scrollPos = window.scrollY

    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'

    // Restore scroll position to prevent jumping
    window.scrollTo(0, scrollPos)
  }

  const updateListItem = (blockId, itemIndex, value) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        const newItems = [...block.items]
        newItems[itemIndex] = value
        return { ...block, items: newItems }
      }
      return block
    }))
  }

  const addListItem = (blockId) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return { ...block, items: [...block.items, ''] }
      }
      return block
    }))
  }

  const removeListItem = (blockId, itemIndex) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        const newItems = block.items.filter((_, index) => index !== itemIndex)
        // If no items left, remove the entire block
        if (newItems.length === 0) {
          return null
        }
        return { ...block, items: newItems }
      }
      return block
    }).filter(block => block !== null)) // Remove null blocks
  }

  const removeBlock = (id) => {
    setBlocks(blocks.filter(block => block.id !== id))
  }

  const moveBlockUp = (id) => {
    const index = blocks.findIndex(block => block.id === id)
    if (index > 0) {
      const newBlocks = [...blocks]
        ;[newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]]
      setBlocks(newBlocks)
    }
  }

  const moveBlockDown = (id) => {
    const index = blocks.findIndex(block => block.id === id)
    if (index < blocks.length - 1) {
      const newBlocks = [...blocks]
        ;[newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]]
      setBlocks(newBlocks)
    }
  }

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
    setShowConfirm(false)
  }

  const applyCustomTemplate = () => {
    setBlocks([])
    setShowConfirm(false)
  }

  const loadDefaultTemplate = () => {
    if (blocks.length > 0) {
      setConfirmAction({
        type: 'default',
        title: 'Replace Content?',
        message: 'This will replace all current content with the default template.'
      })
      setShowConfirm(true)
    } else {
      applyDefaultTemplate()
    }
  }

  const loadCustomTemplate = () => {
    if (blocks.length > 0) {
      setConfirmAction({
        type: 'custom',
        title: 'Clear Content?',
        message: 'This will clear all current content and start fresh.'
      })
      setShowConfirm(true)
    } else {
      applyCustomTemplate()
    }
  }

  const handleConfirm = () => {
    if (confirmAction?.type === 'default') {
      applyDefaultTemplate()
    } else if (confirmAction?.type === 'custom') {
      applyCustomTemplate()
    } else if (confirmAction?.type === 'delete') {
      handleDeleteRecipe()
    }
  }

  const handleCancel = () => {
    setShowConfirm(false)
    setConfirmAction(null)
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteRecipe = async (password) => {
    await recipeAPI.delete(id, password)
    navigate('/profile')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Format blocks for API (remove id field)
      const formattedBlocks = blocks.map(({ id, ...block }) => block)

      const recipeData = {
        ...formData,
        recipe: formattedBlocks
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

  return (
    <>
      <ConfirmModal
        isOpen={showConfirm}
        title={confirmAction?.title}
        message={confirmAction?.message}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmButtonText="Continue"
        confirmButtonColor="orange"
      />

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
          {loadingRecipe ? (
            <LoadingSpinner message="Loading recipe..." />
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
              </h1>

              {error && (
                <ErrorAlert message={error} className="mb-6" />
              )}

              {!isEditMode && <BulkUploadRecipes />}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <RecipeFormBasicInfo 
                  formData={formData}
                  onChange={handleFormChange}
                />

                {/* Recipe Content Blocks */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Recipe Content</h2>

                  {/* Template Buttons */}
                  <div className="flex gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">Choose a template to get started:</p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={loadDefaultTemplate}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
                        >
                          📋 Default Template
                        </button>
                        <button
                          type="button"
                          onClick={loadCustomTemplate}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
                        >
                          ✨ Custom (Start Fresh)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Render Blocks */}
                  <div className="space-y-4 mb-6">
                    {blocks.map((block, index) => (
                      <div key={block.id} className="border border-gray-200 rounded-lg p-4 relative">
                        {/* Move and Remove buttons */}
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveBlockUp(block.id)}
                            disabled={index === 0}
                            className="text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBlockDown(block.id)}
                            disabled={index === blocks.length - 1}
                            className="text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlock(block.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="mb-2">
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                            {block.type.toUpperCase()}
                          </span>
                        </div>

                        {/* Subtitle Block */}
                        {block.type === 'subtitle' && (
                          <input
                            type="text"
                            value={block.text}
                            onChange={(e) => updateBlock(block.id, 'text', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
                            placeholder="Enter subtitle..."
                          />
                        )}

                        {/* Text Block */}
                        {block.type === 'text' && (
                          <textarea
                            value={block.text}
                            onChange={(e) => updateBlock(block.id, 'text', e.target.value)}
                            onInput={handleTextareaResize}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none overflow-hidden"
                            placeholder="Enter text content..."
                            style={{ minHeight: '80px' }}
                          />
                        )}

                        {/* List Block */}
                        {block.type === 'list' && (
                          <div className="space-y-2">
                            {block.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center space-x-2">
                                <span className="text-gray-500">•</span>
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => updateListItem(block.id, itemIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                  placeholder={`Item ${itemIndex + 1}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeListItem(block.id, itemIndex)}
                                  className="text-red-500 hover:text-red-700 px-2"
                                  title="Remove item"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addListItem(block.id)}
                              className="text-purple-500 hover:text-purple-700 text-sm font-medium"
                            >
                              + Add Item
                            </button>
                          </div>
                        )}

                        {/* Image Block */}
                        {block.type === 'image' && (
                          <input
                            type="url"
                            value={block.url}
                            onChange={(e) => updateBlock(block.id, 'url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
                            placeholder="Enter image URL..."
                          />
                        )}
                      </div>
                    ))}

                    {blocks.length === 0 && (
                      <p className="text-gray-500 text-center py-8">
                        No content blocks yet. Click the buttons below to add content.
                      </p>
                    )}
                  </div>

                  {/* Add Block Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => addBlock('subtitle')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      + Subtitle
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock('text')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      + Text
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock('list')}
                      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                    >
                      + List
                    </button>
                    <button
                      type="button"
                      onClick={() => addBlock('image')}
                      className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition"
                    >
                      + Image
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-between items-center space-x-4">
                  <div>
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={handleDeleteClick}
                        disabled={loading}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Delete Recipe
                      </button>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => navigate('/')}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading
                        ? (isEditMode ? 'Updating...' : 'Creating...')
                        : (isEditMode ? 'Update Recipe' : 'Create Recipe')}
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default CreateRecipe

