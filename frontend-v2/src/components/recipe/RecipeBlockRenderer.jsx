import { useState } from 'react'
import ImageModal from '../modals/ImageModal'

/**
 * RecipeBlockRenderer - Displays recipe content blocks
 * Used in both CreateRecipe (preview) and RecipeDetail (view)
 */
function RecipeBlockRenderer({ blocks, className = "" }) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleImageClick = (imageUrl, imageAlt) => {
    setSelectedImage({ url: imageUrl, alt: imageAlt })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedImage(null)
  }

  if (!blocks || blocks.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No recipe content available.
      </p>
    )
  }

  // Group consecutive image blocks for grid display
  const groupedBlocks = []
  let imageGroup = []

  blocks.forEach((block, index) => {
    if (block.type === 'image' && block.url) {
      imageGroup.push(block)
    } else {
      // If we have accumulated images, add them as a group
      if (imageGroup.length > 0) {
        groupedBlocks.push({ type: 'image-group', images: imageGroup })
        imageGroup = []
      }
      // Add the non-image block
      groupedBlocks.push(block)
    }
  })

  // Don't forget remaining images
  if (imageGroup.length > 0) {
    groupedBlocks.push({ type: 'image-group', images: imageGroup })
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {groupedBlocks.map((block, index) => (
        <div key={index}>
          {/* Subtitle Block */}
          {block.type === 'subtitle' && (
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-orange-500">
              {block.text}
            </h2>
          )}

          {/* Text Block */}
          {block.type === 'text' && (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {block.text}
            </p>
          )}

          {/* List Block */}
          {block.type === 'list' && block.items && (
            <ul className="space-y-2">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start">
                  <span className="text-orange-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Image Group - Grid Layout (up to 4 per row) */}
          {block.type === 'image-group' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 my-6">
              {block.images.map((img, imgIndex) => (
                <div
                  key={imgIndex}
                  onClick={() => handleImageClick(img.url, `Recipe step ${imgIndex + 1}`)}
                  className="rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-gray-100 cursor-pointer hover:scale-105 transition-transform"
                >
                  <img
                    src={img.url}
                    alt={`Recipe step ${imgIndex + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={selectedImage?.url}
        imageAlt={selectedImage?.alt}
        onClose={closeModal}
      />
    </div>
  )
}

export default RecipeBlockRenderer

