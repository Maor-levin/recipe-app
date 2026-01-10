import { useState } from "react";

/**
 * Custom hook for managing recipe content blocks
 * Handles all block operations: add, update, remove, move, and list item management
 *
 * @param {Array} initialBlocks - Initial blocks to load (for edit mode)
 * @returns {Object} Block state and operations
 */
export function useRecipeBlocks(initialBlocks = []) {
  const [blocks, setBlocks] = useState(initialBlocks);

  // ============================================
  // BASIC BLOCK OPERATIONS
  // ============================================

  /**
   * Add a new block of specified type
   * Each block type has different default properties
   */
  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(), // Unique ID for React keys
      type: type,
    };

    // Set default properties based on block type
    switch (type) {
      case "subtitle":
      case "text":
        newBlock.text = "";
        break;
      case "list":
        newBlock.items = ["", ""]; // Start with 2 empty items
        break;
      case "image":
        newBlock.url = "";
        break;
      default:
        break;
    }

    setBlocks([...blocks, newBlock]);
  };

  /**
   * Update a single field in a block
   * @param {number} id - Block ID
   * @param {string} field - Field name to update (e.g., 'text', 'url')
   * @param {any} value - New value for the field
   */
  const updateBlock = (id, field, value) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, [field]: value } : block
      )
    );
  };

  /**
   * Remove a block completely
   * @param {number} id - Block ID to remove
   */
  const removeBlock = (id) => {
    setBlocks(blocks.filter((block) => block.id !== id));
  };

  // ============================================
  // BLOCK MOVEMENT OPERATIONS
  // ============================================

  /**
   * Move a block up in the list (swap with previous block)
   * @param {number} id - Block ID to move
   */
  const moveBlockUp = (id) => {
    const index = blocks.findIndex((block) => block.id === id);

    // Can't move up if already at the top
    if (index > 0) {
      const newBlocks = [...blocks];
      // Swap current block with previous block
      [newBlocks[index - 1], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[index - 1],
      ];
      setBlocks(newBlocks);
    }
  };

  /**
   * Move a block down in the list (swap with next block)
   * @param {number} id - Block ID to move
   */
  const moveBlockDown = (id) => {
    const index = blocks.findIndex((block) => block.id === id);

    // Can't move down if already at the bottom
    if (index < blocks.length - 1) {
      const newBlocks = [...blocks];
      // Swap current block with next block
      [newBlocks[index], newBlocks[index + 1]] = [
        newBlocks[index + 1],
        newBlocks[index],
      ];
      setBlocks(newBlocks);
    }
  };

  // ============================================
  // LIST BLOCK OPERATIONS
  // ============================================

  /**
   * Update a specific item in a list block
   * @param {number} blockId - List block ID
   * @param {number} itemIndex - Index of item to update
   * @param {string} value - New value for the item
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
    setBlocks(
      blocks.map((block) => {
        if (block.id === blockId) {
          return { ...block, items: [...block.items, ""] };
        }
        return block;
      })
    );
  };

  /**
   * Remove an item from a list block
   * If last item is removed, the entire block is deleted
   * @param {number} blockId - List block ID
   * @param {number} itemIndex - Index of item to remove
   */
  const removeListItem = (blockId, itemIndex) => {
    setBlocks(
      blocks
        .map((block) => {
          if (block.id === blockId) {
            const newItems = block.items.filter(
              (_, index) => index !== itemIndex
            );

            // If no items left, mark block for removal
            if (newItems.length === 0) {
              return null;
            }

            return { ...block, items: newItems };
          }
          return block;
        })
        .filter((block) => block !== null)
    ); // Remove null blocks
  };

  // ============================================
  // RETURN ALL OPERATIONS
  // ============================================

  return {
    // State
    blocks,
    setBlocks,

    // Basic operations
    addBlock,
    updateBlock,
    removeBlock,

    // Movement operations
    moveBlockUp,
    moveBlockDown,

    // List operations
    updateListItem,
    addListItem,
    removeListItem,
  };
}
