/**
 * ImageModal - Display an image in a centered modal overlay
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {string} imageUrl - URL of the image to display
 * @param {string} imageAlt - Alt text for the image
 * @param {Function} onClose - Callback to close the modal
 */
function ImageModal({ isOpen, imageUrl, imageAlt, onClose }) {
  if (!isOpen) return null

  // Close modal when clicking outside the image
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Close modal on Escape key
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Modal Content */}
      <div className="relative max-w-[50vw] max-h-[90vh] p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 bg-white text-gray-700 hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center shadow-lg font-bold text-xl z-10 transition-colors"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Image */}
        <img
          src={imageUrl}
          alt={imageAlt}
          className="max-w-full max-h-[90vh] rounded-lg shadow-2xl object-contain"
        />
      </div>
    </div>
  )
}

export default ImageModal

