import { useState, useEffect } from 'react'
import { recipeAPI } from '../utils/api'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'

function CreateRecipe() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail_image_url: ''
  })
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)

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

    switch(type) {
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
    }
  }

  const handleCancel = () => {
    setShowConfirm(false)
    setConfirmAction(null)
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

      const response = await recipeAPI.create(recipeData)
      navigate(`/recipes/${response.data.id}`)
    } catch (err) {
      console.error('Error creating recipe:', err)
      setError('Failed to create recipe. Please try again.')
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
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Recipe</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Recipe title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Short description of your recipe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thumbnail Image URL
              </label>
              <input
                type="url"
                name="thumbnail_image_url"
                value={formData.thumbnail_image_url}
                onChange={handleFormChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

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
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeBlock(block.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>

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
          <div className="flex justify-end space-x-4">
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
              {loading ? 'Creating...' : 'Create Recipe'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  )
}

export default CreateRecipe

