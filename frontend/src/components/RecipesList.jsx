import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import RecipeCard from './RecipeCard'
import { Link } from 'react-router-dom'

const RecipesList = ({ className = '' }) => {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
      ; (async () => {
        try {
          const { data } = await api.get('/recipes/all')
          if (alive) setRecipes(Array.isArray(data) ? data : [])
        } catch (err) {
          if (alive) setError(err)
          console.log('detail:', err.response?.data)
        } finally {
          if (alive) setLoading(false)
        }
      })()
    return () => { alive = false }
  }, [])

  if (loading) {
    return (
      <div className={`${className} p-8`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`${className} p-8 flex items-center justify-center`}>
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Couldn't load recipes</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    )
  }

  if (!recipes.length) {
    return (
      <div className={`${className} p-8 flex items-center justify-center`}>
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="text-6xl mb-4">🍳</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No recipes yet</h2>
          <p className="text-gray-600">Be the first to share a delicious recipe!</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} p-6 bg-amber-50/50`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🍴 All Recipes</h2>
        <p className="text-gray-600">{recipes.length} delicious recipes to explore</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(r => (
          <Link to={`/recipes/${r.id}`} key={r.id} className="block">
            <RecipeCard r={r} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecipesList
