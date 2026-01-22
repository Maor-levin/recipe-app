/**
 * BlockControls Component
 * 
 * Reusable control buttons for recipe blocks (move up/down, remove)
 * Handles disabled states and provides consistent styling across all block types
 */

function BlockControls({ 
  onMoveUp, 
  onMoveDown, 
  onRemove, 
  canMoveUp = true, 
  canMoveDown = true 
}) {
  return (
    <div className="absolute top-2 right-2 flex gap-1 bg-white rounded shadow-md">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed transition"
        title="Move up"
        aria-label="Move block up"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        className="px-2 py-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed transition"
        title="Move down"
        aria-label="Move block down"
      >
        ↓
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="px-2 py-1 text-red-500 hover:text-red-700 transition"
        title="Remove block"
        aria-label="Remove block"
      >
        ✕
      </button>
    </div>
  )
}

export default BlockControls
