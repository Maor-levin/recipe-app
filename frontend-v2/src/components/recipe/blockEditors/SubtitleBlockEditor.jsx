/**
 * SubtitleBlockEditor Component
 * 
 * Editor for subtitle blocks - displays a single-line input for section titles
 * Used to organize recipe content into clear sections (e.g., "Ingredients", "Instructions")
 */

import BlockControls from '../BlockControls'
import BlockLabel from '../BlockLabel'

function SubtitleBlockEditor({ 
  block, 
  onUpdate, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  canMoveUp, 
  canMoveDown 
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 relative">
      <BlockControls
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onRemove={onRemove}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />
      
      <BlockLabel type="subtitle" />
      
      <input
        type="text"
        value={block.text || ''}
        onChange={(e) => onUpdate('text', e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold"
        placeholder="Enter subtitle (e.g., 'Ingredients', 'Instructions')..."
      />
    </div>
  )
}

export default SubtitleBlockEditor
