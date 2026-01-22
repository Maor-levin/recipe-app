import { useState } from 'react'
import LoadingSpinner from '../ui/LoadingSpinner'
import { recipeAPI } from '../../utils/api'

const ADJUSTMENT_OPTIONS = [
  { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
  { value: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
  { value: 'dairy-free', label: 'Dairy-Free', emoji: '🥛' },
  { value: 'low-fat', label: 'Low-Fat', emoji: '💪' },
  { value: 'low-carb', label: 'Low-Carb', emoji: '🥑' },
  { value: 'keto', label: 'Keto', emoji: '🥓' },
  { value: 'paleo', label: 'Paleo', emoji: '🍖' },
]

function AIAdjustmentSidebar({ recipeId, onVariantGenerated, onReset, hasActiveVariant }) {
  const [selectedAdjustments, setSelectedAdjustments] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const toggleAdjustment = (value) => {
    setSelectedAdjustments(prev =>
      prev.includes(value)
        ? prev.filter(a => a !== value)
        : [...prev, value]
    )
  }

  const handleGenerate = async () => {
    if (selectedAdjustments.length === 0) {
      setError('Please select at least one adjustment')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await recipeAPI.generateVariant(recipeId, selectedAdjustments)
      onVariantGenerated(response.data, selectedAdjustments)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate variant. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleReset = () => {
    setSelectedAdjustments([])
    setError('')
    onReset()
  }

  return (
    <div className="sticky top-24 space-y-4 min-w-[200px]">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg p-4 border-2 border-purple-200">
        <h3 className="text-sm font-bold text-purple-900 mb-3 flex items-center">
          <span className="mr-2">✨</span>
          AI Adjust
        </h3>
        
        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
            {error}
          </div>
        )}
        
        <div className="space-y-2 mb-4">
          {ADJUSTMENT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => toggleAdjustment(option.value)}
              disabled={isGenerating || hasActiveVariant}
              className={`
                w-full p-2 rounded-lg border-2 transition-all text-left text-xs
                ${selectedAdjustments.includes(option.value)
                  ? 'border-purple-500 bg-purple-100 text-purple-900'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                }
                ${(isGenerating || hasActiveVariant) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="mr-1">{option.emoji}</span>
              {option.label}
            </button>
          ))}
        </div>
        
        {hasActiveVariant ? (
          <button
            onClick={handleReset}
            className="w-full px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-xs font-medium"
          >
            Reset
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedAdjustments.length === 0}
            className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? '⏳ Generating...' : '✨ Generate'}
          </button>
        )}
        
        {isGenerating && (
          <div className="mt-3 flex justify-center">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  )
}

export default AIAdjustmentSidebar
