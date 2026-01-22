/**
 * ImageBlockEditor Component
 * 
 * Editor for individual image blocks - integrates with ImageUploader component
 * Used within ImageBlockGroup for grid-based image management
 */

import ImageUploader from '../../ui/ImageUploader'

function ImageBlockEditor({ 
  block, 
  onUpdate, 
  onRemove, 
  onMoveUp, 
  onMoveDown,
  onError,
  canMoveUp, 
  canMoveDown 
}) {
  return (
    <div className="relative group">
      <ImageUploader
        value={block.url || ''}
        onChange={(url) => onUpdate('url', url)}
        onError={onError}
        height="h-48"
      />
      
      {/* Control buttons - positioned over the image */}
      <div className="absolute -top-2 -right-2 flex flex-col bg-white rounded shadow-md z-10">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          className="px-1.5 py-0.5 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed text-xs border-b border-gray-200 transition"
          title="Move up"
          aria-label="Move image up"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          className="px-1.5 py-0.5 text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed text-xs border-b border-gray-200 transition"
          title="Move down"
          aria-label="Move image down"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="px-1.5 py-0.5 text-red-500 hover:text-red-700 text-xs transition"
          title="Remove image"
          aria-label="Remove image"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default ImageBlockEditor
