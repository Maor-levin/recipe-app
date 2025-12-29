import { useState, useEffect } from 'react'
import { favoriteAPI, noteAPI } from '../utils/api'
import ConfirmModal from './ConfirmModal'

function FavoriteButton({ recipeId, onAuthRequired, size = 'medium', onUnfavorite }) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [hasNote, setHasNote] = useState(false)

  useEffect(() => {
    const username = localStorage.getItem('username')
    setCurrentUser(username)

    if (username) {
      checkIfFavorited()
      checkIfHasNote()
    }
  }, [recipeId])

  const checkIfFavorited = async () => {
    try {
      const response = await favoriteAPI.check(recipeId)
      setIsFavorited(response.data.is_favorited)
    } catch (err) {
      // If not authenticated, that's okay
      console.error('Error checking favorite:', err)
    }
  }

  const checkIfHasNote = async () => {
    try {
      const response = await noteAPI.getForRecipe(recipeId)
      setHasNote(!!response.data)
    } catch (err) {
      // 404 means no note exists
      setHasNote(false)
    }
  }

  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!currentUser) {
      onAuthRequired()
      return
    }

    setLoading(true)

    try {
      if (isFavorited) {
        // Check if there's a note before unfavoriting
        if (hasNote) {
          setShowConfirm(true)
          setLoading(false)
        } else {
          await favoriteAPI.remove(recipeId)
          setIsFavorited(false)
          if (onUnfavorite) onUnfavorite()
        }
      } else {
        await favoriteAPI.add(recipeId)
        setIsFavorited(true)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
      // If error, recheck status
      await checkIfFavorited()
    } finally {
      if (!isFavorited || !hasNote) {
        setLoading(false)
      }
    }
  }

  const handleConfirmUnfavorite = async () => {
    setLoading(true)
    try {
      // Delete the note first
      await noteAPI.delete(recipeId)
      // Then remove from favorites
      await favoriteAPI.remove(recipeId)
      setIsFavorited(false)
      setHasNote(false)
      setShowConfirm(false)
      if (onUnfavorite) onUnfavorite()
    } catch (err) {
      console.error('Error unfavoriting:', err)
    } finally {
      setLoading(false)
    }
  }

  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  }

  return (
    <>
      <ConfirmModal
        isOpen={showConfirm}
        title="Remove from Favorites?"
        message="This recipe has a note attached. Removing it from favorites will also delete your note. Are you sure?"
        onConfirm={handleConfirmUnfavorite}
        onCancel={() => {
          setShowConfirm(false)
          setLoading(false)
        }}
      />

      <button
        onClick={handleClick}
        disabled={loading}
        className={`${sizeClasses[size]} transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {loading ? (
          <span className="text-gray-400">⏳</span>
        ) : isFavorited ? (
          <span className="text-orange-500">★</span>
        ) : (
          <span className="text-gray-300 hover:text-orange-400">☆</span>
        )}
      </button>
    </>
  )
}

export default FavoriteButton

