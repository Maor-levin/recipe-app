import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userAPI } from "../utils/api";

/**
 * Custom hook to check if the current user owns a recipe
 * @param {Object} recipe - The recipe object with author_id (can be null during initial load)
 * @returns {boolean} isOwner - True if current user owns the recipe, false otherwise
 */
export function useRecipeOwnership(recipe) {
  const { user, isAuthenticated } = useAuth();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Early exit if recipe hasn't loaded yet - avoids unnecessary API call
    if (!recipe) {
      setIsOwner(false);
      return;
    }

    // Early exit if not logged in - no need to check ownership
    if (!isAuthenticated) {
      setIsOwner(false);
      return;
    }

    // Check ownership asynchronously
    const checkOwnership = async () => {
      try {
        const userResponse = await userAPI.getMe();
        const currentUserId = userResponse.data.id;
        setIsOwner(recipe.author_id === currentUserId);
      } catch (err) {
        // If auth fails, user doesn't own it
        setIsOwner(false);
      }
    };

    checkOwnership();
  }, [recipe, isAuthenticated]);

  return isOwner;
}
