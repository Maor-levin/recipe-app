/**
 * ErrorAlert - Reusable error display component
 * Used for consistent error messaging throughout the app
 */
function ErrorAlert({ 
  message, 
  title = null,
  actionText = null, 
  onAction = null,
  variant = "error",  // error, warning, info
  className = "" 
}) {
  const variantStyles = {
    error: "bg-red-50 border-red-200 text-red-600",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-600"
  }

  const buttonStyles = {
    error: "bg-red-500 hover:bg-red-600",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-500 hover:bg-blue-600"
  }

  const styles = variantStyles[variant] || variantStyles.error
  const buttonStyle = buttonStyles[variant] || buttonStyles.error

  return (
    <div className={`${styles} border px-4 py-3 rounded-lg ${className}`}>
      {title && (
        <h3 className="font-semibold mb-1">{title}</h3>
      )}
      {typeof message === 'string' ? (
        <p>{message}</p>
      ) : (
        message
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className={`mt-4 px-4 py-2 ${buttonStyle} text-white rounded-lg transition`}
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default ErrorAlert

