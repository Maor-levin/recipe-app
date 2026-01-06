/**
 * RecipeBlockRenderer - Displays recipe content blocks
 * Used in both CreateRecipe (preview) and RecipeDetail (view)
 */
function RecipeBlockRenderer({ blocks, className = "" }) {
  if (!blocks || blocks.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        No recipe content available.
      </p>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {blocks.map((block, index) => (
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

          {/* Image Block */}
          {block.type === 'image' && block.url && (
            <div className="my-6 rounded-lg overflow-hidden">
              <img
                src={block.url}
                alt="Recipe step"
                className="w-full h-auto"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default RecipeBlockRenderer

