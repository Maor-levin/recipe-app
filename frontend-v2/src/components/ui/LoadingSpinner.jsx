/**
 * LoadingSpinner - Reusable loading state display
 * Used throughout the app for consistent loading UX
 */
function LoadingSpinner({ message = "Loading...", size = "large", className = "" }) {
  const sizeClasses = {
    small: "py-4 text-sm",
    medium: "py-8 text-base",
    large: "py-12 text-lg"
  }

  const spinnerSizes = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  }

  return (
    <div className={`text-center ${sizeClasses[size] || sizeClasses.large} ${className}`}>
      <div className={`${spinnerSizes[size] || spinnerSizes.large} mx-auto mb-4 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin`}></div>
      <p className="text-gray-500">{message}</p>
    </div>
  )
}

export default LoadingSpinner

