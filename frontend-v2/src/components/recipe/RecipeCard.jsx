import { Link } from 'react-router-dom'
import { useState } from 'react'
import FavoriteButton from '../FavoriteButton'
import AuthModal from '../modals/AuthModal'
import { formatDateShort } from '../../utils/dateUtils'

function RecipeCard({ recipe }) {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <Link to={`/recipes/${recipe.id}`} className="block h-full">
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 relative h-full flex flex-col">
          {/* Favorite Button */}
          <div className="absolute top-3 right-3 z-10 bg-white rounded-full p-1 shadow-md">
            <FavoriteButton
              recipeId={recipe.id}
              onAuthRequired={() => setShowAuthModal(true)}
              size="medium"
            />
          </div>

          {/* Recipe Image */}
          <div className="h-56 bg-gray-200 overflow-hidden flex-shrink-0">
            {recipe.thumbnail_image_url ? (
              <img
                src={recipe.thumbnail_image_url}
                alt={recipe.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                <span className="text-orange-400 text-5xl">🍽️</span>
              </div>
            )}
          </div>

          {/* Recipe Info */}
          <div className="p-5 flex-1 flex flex-col">
            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 text-center">
              {recipe.title || 'Untitled Recipe'}
            </h3>

            {/* Metadata - Author and Date */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
              <span className="truncate">
                By: {recipe.author?.user_name || `User #${recipe.author_id}`}
              </span>
              <span className="text-gray-300 mx-2">|</span>
              <span className="whitespace-nowrap">
                {formatDateShort(recipe.created_at)}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-3 text-center">
              {recipe.description || ''}
            </p>
          </div>
        </div>
      </Link>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}

export default RecipeCard

