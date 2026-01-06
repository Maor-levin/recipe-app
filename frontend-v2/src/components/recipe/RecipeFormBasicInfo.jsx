/**
 * RecipeFormBasicInfo - Basic recipe information form
 * Used in CreateRecipe page for title, description, and thumbnail
 */
function RecipeFormBasicInfo({ formData, onChange }) {
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Thumbnail Image URL
        </label>
        <input
          type="url"
          name="thumbnail_image_url"
          value={formData.thumbnail_image_url}
          onChange={onChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </div>
  )
}

export default RecipeFormBasicInfo

