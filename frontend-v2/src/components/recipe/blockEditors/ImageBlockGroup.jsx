/**
 * ImageBlockGroup Component
 * 
 * Groups consecutive image blocks into a responsive grid layout
 * Allows multiple images to be displayed side-by-side for better visual organization
 */

import ImageBlockEditor from './ImageBlockEditor'

function ImageBlockGroup({ 
  imageBlocks, 
  onUpdate, 
  onRemove, 
  onMoveUp, 
  onMoveDown,
  onError,
  totalBlockCount 
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
          IMAGES
        </span>
        <span className="text-gray-500 text-xs">
          {imageBlocks.length} {imageBlocks.length === 1 ? 'image' : 'images'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {imageBlocks.map((block) => (
          <ImageBlockEditor
            key={block.id}
            block={block}
            onUpdate={(field, value) => onUpdate(block.id, field, value)}
            onRemove={() => onRemove(block.id)}
            onMoveUp={() => onMoveUp(block.id)}
            onMoveDown={() => onMoveDown(block.id)}
            onError={onError}
            canMoveUp={block.originalIndex > 0}
            canMoveDown={block.originalIndex < totalBlockCount - 1}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageBlockGroup
