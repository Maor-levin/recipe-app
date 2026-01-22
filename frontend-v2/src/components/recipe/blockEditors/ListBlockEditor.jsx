/**
 * ListBlockEditor Component
 * 
 * Editor for list blocks - manages multiple list items with add/remove functionality
 * Commonly used for ingredients, equipment lists, or step-by-step instructions
 */

import BlockControls from '../BlockControls'
import BlockLabel from '../BlockLabel'

function ListBlockEditor({ 
  block, 
  onUpdate, 
  onRemove, 
  onMoveUp, 
  onMoveDown,
  onUpdateItem,
  onAddItem,
  onRemoveItem,
  canMoveUp, 
  canMoveDown 
}) {
  const items = block.items || []

  return (
    <div className="border border-gray-200 rounded-lg p-4 relative">
      <BlockControls
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onRemove={onRemove}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />
      
      <BlockLabel type="list" />
      
      <div className="space-y-2">
        {items.map((item, itemIndex) => (
          <div key={itemIndex} className="flex items-center gap-2">
            <span className="text-gray-400 text-sm flex-shrink-0">
              {itemIndex + 1}.
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => onUpdateItem(block.id, itemIndex, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter list item..."
            />
            <button
              type="button"
              onClick={() => onRemoveItem(block.id, itemIndex)}
              className="px-2 py-1 text-red-500 hover:text-red-700 transition flex-shrink-0"
              title="Remove item"
              aria-label="Remove list item"
            >
              ✕
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => onAddItem(block.id)}
          className="w-full mt-2 px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition"
        >
          + Add Item
        </button>
      </div>
    </div>
  )
}

export default ListBlockEditor
