/**
 * BlockLabel Component
 * 
 * Displays a styled label indicating the block type
 * Provides visual consistency across all recipe block editors
 */

const BLOCK_TYPE_LABELS = {
  subtitle: 'SUBTITLE',
  text: 'TEXT',
  list: 'LIST',
  image: 'IMAGE',
}

function BlockLabel({ type }) {
  const label = BLOCK_TYPE_LABELS[type] || type.toUpperCase()
  
  return (
    <div className="mb-3">
      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
        {label}
      </span>
    </div>
  )
}

export default BlockLabel
