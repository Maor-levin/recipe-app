import { useState } from "react";

/**
 * Custom hook for managing recipe content blocks
 * Handles creating, updating, removing, and reordering blocks
 *
 * @param {Array} initialBlocks - Initial blocks to load (for edit mode)
 * @returns {Object} Block state and operations
 */
export function useRecipeBlocks(initialBlocks = []) {
  const [blocks, setBlocks] = useState(initialBlocks);

  // ============================================
  // BLOCK OPERATIONS
  // ============================================

  /**
   * Add a new block of specified type
   * @param {string} type - Block type: 'subtitle' | 'text' | 'list' | 'image'
   */
  const addBlock = (type) => {
    const newBlock = { id: Date.now(), type };

    // Set default properties based on type
    if (type === "subtitle" || type === "text") {
      newBlock.text = "";
    } else if (type === "list") {
      newBlock.items = ["", ""];
    } else if (type === "image") {
      newBlock.url = "";
    }

    setBlocks([...blocks, newBlock]);
  };

  /**
   * Update a single field in a block
   * @param {number} id - Block ID
   * @param {string} field - Field name to update
   * @param {any} value - New value
   */
  const updateBlock = (id, field, value) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, [field]: value } : block)));
  };

  /**
   * Remove a block
   * @param {number} id - Block ID to remove
   */
  const removeBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  // ============================================
  // REORDERING
  // ============================================

  /**
   * Move a block up in the list
   * @param {number} id - Block ID to move
   */
  const moveBlockUp = (id) => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index <= 0) return;

    const copy = [...blocks];
    [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
    setBlocks(copy);
  };

  /**
   * Move a block down in the list
   * @param {number} id - Block ID to move
   */
  const moveBlockDown = (id) => {
    const index = blocks.findIndex((block) => block.id === id);
    if (index >= blocks.length - 1) return;

    const copy = [...blocks];
    [copy[index], copy[index + 1]] = [copy[index + 1], copy[index]];
    setBlocks(copy);
  };

  // ============================================
  // LIST ITEMS
  // ============================================

  /**
   * Update a specific item in a list block
   * @param {number} blockId - List block ID
   * @param {number} itemIndex - Index of item to update
   * @param {string} value - New value
   */
  const updateListItem = (blockId, itemIndex, value) => {
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          const newItems = [...block.items];
          newItems[itemIndex] = value;
          return { ...block, items: newItems };
        }
        return block;
      })
    );
  };

  /**
   * Add a new empty item to a list block
   * @param {number} blockId - List block ID
   */
  const addListItem = (blockId) => {
    setBlocks(blocks.map((block) => (block.id === blockId ? { ...block, items: [...block.items, ""] } : block)));
  };

  /**
   * Remove an item from a list block
   * @param {number} blockId - List block ID
   * @param {number} itemIndex - Index of item to remove
   */
  const removeListItem = (blockId, itemIndex) => {
    setBlocks(
      blocks
        .map((block) => {
          if (block.id === blockId) {
            const newItems = block.items.filter((_, i) => i !== itemIndex);
            // Remove block if no items left
            return newItems.length === 0 ? null : { ...block, items: newItems };
          }
          return block;
        })
        .filter(Boolean)
    );
  };

  return {
    blocks,
    setBlocks,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlockUp,
    moveBlockDown,
    updateListItem,
    addListItem,
    removeListItem,
  };
}
