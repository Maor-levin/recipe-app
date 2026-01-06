import { useState, useEffect, useCallback } from 'react'
import { favoriteAPI, noteAPI } from '../utils/api'
import ConfirmModal from './modals/ConfirmModal'

function FavoriteButton({ recipeId, onAuthRequired, size = 'medium', onUnfavorite, isFavorited: controlledIsFavorited, onFavoriteChange }) {
  // Support both controlled and uncontrolled modes
  const isControlled = controlledIsFavorited !== undefined
  const [internalIsFavorited, setInternalIsFavorited] = useState(false)
  const isFavorited = isControlled ? controlledIsFavorited : internalIsFavorited
  
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [hasNote, setHasNote] = useState(false)

  const checkIfFavorited = useCallback(async () => {
    try {
      const response = await favoriteAPI.check(recipeId)
      const favorited = response.data.is_favorited
      if (isControlled) {
        if (onFavoriteChange) onFavoriteChange(favorited)
      } else {
        setInternalIsFavorited(favorited)
      }
    } catch (err) {
      // If not authenticated, that's okay
      console.error('Error checking favorite:', err)
    }
  }, [recipeId, isControlled, onFavoriteChange])

  const checkIfHasNote = useCallback(async () => {
    try {
      const response = await noteAPI.getForRecipe(recipeId)
      setHasNote(!!response.data)
    } catch (err) {
      // 404 means no note exists
      setHasNote(false)
    }
  }, [recipeId])

  useEffect(() => {
    const username = localStorage.getItem('username')
    setCurrentUser(username)

    if (username) {
      // Only check favorite status if uncontrolled
      if (!isControlled) {
        checkIfFavorited()
      }
      checkIfHasNote()
    }
  }, [recipeId, isControlled, checkIfFavorited, checkIfHasNote])

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
        // Always check fresh if there's a note before unfavoriting
        // This ensures we have the latest state, even if NotesSection saved a note
        let noteExists = false
        try {
          const response = await noteAPI.getForRecipe(recipeId)
          noteExists = !!response.data
          setHasNote(noteExists)
        } catch (err) {
          // 404 means no note exists
          noteExists = false
          setHasNote(false)
        }
        
        if (noteExists) {
          setShowConfirm(true)
          setLoading(false)
        } else {
          await favoriteAPI.remove(recipeId)
          const newValue = false
          if (isControlled) {
            if (onFavoriteChange) onFavoriteChange(newValue)
          } else {
            setInternalIsFavorited(newValue)
          }
          if (onUnfavorite) onUnfavorite()
        }
      } else {
        await favoriteAPI.add(recipeId)
        const newValue = true
        if (isControlled) {
          if (onFavoriteChange) onFavoriteChange(newValue)
        } else {
          setInternalIsFavorited(newValue)
        }
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
      const newValue = false
      if (isControlled) {
        if (onFavoriteChange) onFavoriteChange(newValue)
      } else {
        setInternalIsFavorited(newValue)
      }
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
        confirmButtonText="Remove"
        confirmButtonColor="orange"
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

