/**
 * EmptyState - Reusable empty state display
 * Used when there's no content to show (no recipes, favorites, etc.)
 */
function EmptyState({
  icon = "📋",
  title,
  message,
  actionText,
  onAction,
  className = ""
}) {
  return (
    <div className={`text-center py-16 bg-white rounded-lg shadow ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-xl text-gray-600 mb-2">{title}</p>
      {message && (
        <p className="text-gray-500 mb-6">
          {message}
        </p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState

