/**
 * TemplateSelector Component
 * 
 * Provides quick-start templates for recipe creation
 * - Default Template: Pre-populated with common recipe structure
 * - Custom Template: Start from scratch with empty canvas
 */

function TemplateSelector({ onSelectDefault, onSelectCustom, hasExistingBlocks }) {
  const handleDefaultClick = () => {
    if (hasExistingBlocks) {
      // Show confirmation if user already has content
      if (window.confirm('This will replace all current content with the default template. Continue?')) {
        onSelectDefault()
      }
    } else {
      onSelectDefault()
    }
  }

  const handleCustomClick = () => {
    if (hasExistingBlocks) {
      // Show confirmation if user already has content
      if (window.confirm('This will clear all current content. Continue?')) {
        onSelectCustom()
      }
    } else {
      onSelectCustom()
    }
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <p className="text-sm text-gray-600 mb-3">
        Choose a template to get started:
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleDefaultClick}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
        >
          📋 Default Template
        </button>
        <button
          type="button"
          onClick={handleCustomClick}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
        >
          ✨ Custom (Start Fresh)
        </button>
      </div>
      {hasExistingBlocks && (
        <p className="text-xs text-amber-600 mt-2">
          ⚠️ Selecting a template will replace your current content
        </p>
      )}
    </div>
  )
}

export default TemplateSelector
