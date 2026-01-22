/**
 * AddBlockButtons Component
 * 
 * Toolbar for adding new content blocks to a recipe
 * Provides buttons for all available block types with clear icons and labels
 */

const BLOCK_TYPES = [
  { type: 'subtitle', label: 'Subtitle', icon: '📌', description: 'Section header' },
  { type: 'text', label: 'Text', icon: '📝', description: 'Paragraph' },
  { type: 'list', label: 'List', icon: '📋', description: 'Bullet/numbered list' },
  { type: 'image', label: 'Image', icon: '🖼️', description: 'Photo' },
]

function AddBlockButtons({ onAddBlock }) {
  return (
    <div className="border-t-2 border-dashed border-gray-300 pt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Add Content Block:
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BLOCK_TYPES.map(({ type, label, icon, description }) => (
          <button
            key={type}
            type="button"
            onClick={() => onAddBlock(type)}
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
            title={`Add ${description}`}
          >
            <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
              {icon}
            </span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default AddBlockButtons
