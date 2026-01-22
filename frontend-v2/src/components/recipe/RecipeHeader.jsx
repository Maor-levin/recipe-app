import { formatDate } from '../../utils/dateUtils'
import FavoriteButton from '../FavoriteButton'

function RecipeHeader({ 
  recipe, 
  variant, 
  isOwner, 
  isFavorited, 
  onFavoriteChange, 
  onAuthRequired,
  onEdit 
}) {
  const title = variant ? variant.modified_title : recipe.title
  const description = variant ? variant.modified_description : recipe.description
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Thumbnail */}
      {recipe.thumbnail_image_url && (
        <div className="h-96 overflow-hidden">
          <img
            src={recipe.thumbnail_image_url}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title and Metadata */}
      <div className="p-8">
        {/* Variant Badge */}
        {variant && (
          <div className="mb-4 flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium">
              ✨ AI-Adjusted Recipe
            </span>
            {variant.adjustments?.map((adj) => (
              <span key={adj} className="px-3 py-1 bg-purple-100 text-purple-900 rounded-full text-sm">
                {adj}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-start mb-4">
          <h1 className={`text-4xl font-bold flex-1 text-center ${variant ? 'text-purple-900' : 'text-gray-900'}`}>
            {title}
          </h1>
          <div className="ml-4 flex items-center gap-3">
            {isOwner && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                title="Edit Recipe"
              >
                ✏️ Edit
              </button>
            )}
            <FavoriteButton
              recipeId={recipe.id}
              isFavorited={isFavorited}
              onFavoriteChange={onFavoriteChange}
              onAuthRequired={onAuthRequired}
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
        {description && (
          <p className={`text-lg text-center mb-6 ${variant ? 'text-purple-800' : 'text-gray-700'}`}>
            {description}
          </p>
        )}
        
        {/* Changes Made */}
        {variant && variant.changes_made && variant.changes_made.length > 0 && (
          <div className="mb-6 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2 flex items-center">
              <span className="mr-2">🔄</span>
              Changes Made:
            </h4>
            <ul className="space-y-1">
              {variant.changes_made.map((change, index) => (
                <li key={index} className="text-purple-800 text-sm flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* AI Disclaimer */}
        {variant && (
          <div className="mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ <strong>AI-Generated Content:</strong> Please review all substitutions and verify they're safe for your dietary needs.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default RecipeHeader
