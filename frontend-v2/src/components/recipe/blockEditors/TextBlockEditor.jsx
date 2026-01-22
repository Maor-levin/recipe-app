/**
 * TextBlockEditor Component
 * 
 * Editor for text blocks - displays an auto-expanding textarea for paragraphs
 * Used for instructions, tips, and descriptive content
 */

import { useRef, useEffect } from 'react'
import BlockControls from '../BlockControls'
import BlockLabel from '../BlockLabel'

function TextBlockEditor({ 
  block, 
  onUpdate, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  canMoveUp, 
  canMoveDown 
}) {
  const textareaRef = useRef(null)

  // Auto-resize textarea as content changes
  const handleResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }

  // Initial resize on mount
  useEffect(() => {
    handleResize()
  }, [])

  const handleChange = (e) => {
    onUpdate('text', e.target.value)
    handleResize()
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 relative">
      <BlockControls
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onRemove={onRemove}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      />
      
      <BlockLabel type="text" />
      
      <textarea
        ref={textareaRef}
        value={block.text || ''}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        placeholder="Enter paragraph text (instructions, tips, etc.)..."
        rows={3}
      />
    </div>
  )
}

export default TextBlockEditor
