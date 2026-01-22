/**
 * Clean and filter recipe blocks before submission
 * - Removes empty image blocks
 * - Removes empty text and subtitle blocks
 * - Filters out empty list items
 * - Removes the 'id' field used for React keys
 * 
 * @param {Array} blocks - Array of recipe blocks
 * @returns {Array} Cleaned blocks ready for API submission
 */
export function cleanRecipeBlocks(blocks) {
  return blocks
    .map(({ id, ...block }) => block) // Remove id field used for React keys
    .filter(block => {
      // Remove empty image blocks
      if (block.type === 'image' && (!block.url || block.url.trim() === '')) {
        return false
      }
      // Remove empty text blocks
      if (block.type === 'text' && (!block.text || block.text.trim() === '')) {
        return false
      }
      // Remove empty subtitle blocks
      if (block.type === 'subtitle' && (!block.text || block.text.trim() === '')) {
        return false
      }
      // Remove empty list blocks or lists with no valid items
      if (block.type === 'list') {
        const validItems = block.items.filter(item => item && item.trim() !== '')
        if (validItems.length === 0) {
          return false
        }
        // Update block with only valid items
        block.items = validItems
      }
      return true
    })
}

/**
 * Group consecutive image blocks together for grid display
 * Non-image blocks remain individual
 * 
 * @param {Array} blocks - Array of recipe blocks
 * @returns {Array} Blocks with consecutive images grouped
 */
export function groupImageBlocks(blocks) {
  const grouped = []
  let imageGroup = []
  
  blocks.forEach((block, index) => {
    if (block.type === 'image') {
      imageGroup.push({ ...block, originalIndex: index })
    } else {
      // If we have accumulated images, add them as a group
      if (imageGroup.length > 0) {
        grouped.push({ type: 'image-group', blocks: imageGroup })
        imageGroup = []
      }
      // Add the non-image block
      grouped.push({ ...block, originalIndex: index })
    }
  })
  
  // Don't forget remaining images
  if (imageGroup.length > 0) {
    grouped.push({ type: 'image-group', blocks: imageGroup })
  }
  
  return grouped
}

/**
 * Extract Cloudinary public_id from image URL
 * @param {string} url - Cloudinary image URL
 * @returns {string|null} public_id or null
 */
export function getPublicIdFromUrl(url) {
  if (!url) return null
  const parts = url.split('/')
  return parts.slice(parts.indexOf('recipe-app')).join('/').split('.')[0]
}
