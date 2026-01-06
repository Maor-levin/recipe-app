/**
 * Generic confirmation modal without password
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {string} title - Modal title
 * @param {string} message - Main message
 * @param {Function} onConfirm - Callback when user confirms
 * @param {Function} onCancel - Callback when user cancels
 * @param {string} confirmButtonText - Text for confirm button (default: "Continue")
 * @param {string} confirmButtonColor - Button color (default: "orange")
 * @param {boolean} isDanger - Whether this is a dangerous action (default: false)
 */
function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonText = 'Continue',
  confirmButtonColor = 'orange',
  isDanger = false
}) {
  if (!isOpen) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h3 className={`text-xl font-bold mb-3 ${isDanger ? 'text-red-600' : 'text-gray-900'}`}>
          {title}
        </h3>

        {/* Message */}
        <div className="text-gray-600 mb-6">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 bg-${confirmButtonColor}-500 text-white rounded-lg hover:bg-${confirmButtonColor}-600 transition`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal

