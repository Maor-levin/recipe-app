/**
 * RecipeBlockEditor Component
 * 
 * Main editor interface for recipe content blocks
 * Handles rendering of different block types (subtitle, text, list, image)
 * and delegates editing functionality to specialized block editor components
 */

import { groupImageBlocks } from '../../utils/recipeBlockUtils'
import SubtitleBlockEditor from './blockEditors/SubtitleBlockEditor'
import TextBlockEditor from './blockEditors/TextBlockEditor'
import ListBlockEditor from './blockEditors/ListBlockEditor'
import ImageBlockGroup from './blockEditors/ImageBlockGroup'

function RecipeBlockEditor({
  blocks,
  onUpdateBlock,
  onRemoveBlock,
  onMoveBlockUp,
  onMoveBlockDown,
  onUpdateListItem,
  onAddListItem,
  onRemoveListItem,
  onImageError
}) {
  // Group consecutive image blocks together for grid display
  const groupedBlocks = groupImageBlocks(blocks)

  /**
   * Renders the appropriate editor component based on block type
   */
  const renderBlock = (block, groupIndex) => {
    const blockIndex = block.originalIndex
    const isFirst = blockIndex === 0
    const isLast = blockIndex === blocks.length - 1

    const commonProps = {
      block,
      onUpdate: (field, value) => onUpdateBlock(block.id, field, value),
      onRemove: () => onRemoveBlock(block.id),
      onMoveUp: () => onMoveBlockUp(block.id),
      onMoveDown: () => onMoveBlockDown(block.id),
      canMoveUp: !isFirst,
      canMoveDown: !isLast
    }

    switch (block.type) {
      case 'subtitle':
        return <SubtitleBlockEditor key={block.id} {...commonProps} />
      
      case 'text':
        return <TextBlockEditor key={block.id} {...commonProps} />
      
      case 'list':
        return (
          <ListBlockEditor
            key={block.id}
            {...commonProps}
            onUpdateItem={onUpdateListItem}
            onAddItem={onAddListItem}
            onRemoveItem={onRemoveListItem}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {groupedBlocks.map((group, groupIndex) => {
        // Handle grouped image blocks
        if (group.type === 'image-group') {
          return (
            <ImageBlockGroup
              key={`group-${groupIndex}`}
              imageBlocks={group.blocks}
              onUpdate={onUpdateBlock}
              onRemove={onRemoveBlock}
              onMoveUp={onMoveBlockUp}
              onMoveDown={onMoveBlockDown}
              onError={onImageError}
              totalBlockCount={blocks.length}
            />
          )
        }

        // Handle individual blocks
        return renderBlock(group, groupIndex)
      })}
    </div>
  )
}

export default RecipeBlockEditor
