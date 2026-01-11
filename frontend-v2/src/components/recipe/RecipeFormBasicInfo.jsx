import ImageUploader from '../ui/ImageUploader'
import { useState } from 'react'

/**
 * RecipeFormBasicInfo - Basic recipe information form
 * Used in CreateRecipe page for title, description, and thumbnail
 */
function RecipeFormBasicInfo({ formData, onChange }) {
  const [uploadError, setUploadError] = useState('')

  const handleThumbnailChange = (url) => {
    // Simulate an event to match the existing onChange interface
    onChange({
      target: {
        name: 'thumbnail_image_url',
        value: url
      }
    })
  }

  const handleUploadError = (errorMessage) => {
    setUploadError(errorMessage)
    setTimeout(() => setUploadError(''), 5000) // Clear after 5 seconds
  }

  return (
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
          onChange={onChange}
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
          onChange={onChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          placeholder="Short description of your recipe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail Image
        </label>

        {uploadError && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {uploadError}
          </div>
        )}

        <ImageUploader
          value={formData.thumbnail_image_url}
          onChange={handleThumbnailChange}
          onError={handleUploadError}
        />
      </div>
    </div>
  )
}

export default RecipeFormBasicInfo

