import React from 'react'

const RecipeCard = ({ r }) => {
    const { title, description, thumbnail, recipe, created_at } = r
    
    // Use thumbnail field, or fall back to first image in recipe blocks
    const displayImage = thumbnail || recipe?.find(b => b.type === 'img')?.value;
    
    // Format date if available
    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <article className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Thumbnail */}
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-200 via-orange-200 to-red-200">
                {displayImage ? (
                    <img 
                        src={displayImage} 
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl opacity-50 group-hover:scale-110 transition-transform duration-300">
                            🍽️
                        </span>
                    </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                
                {/* Date badge */}
                {created_at && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-600">
                        {formatDate(created_at)}
                    </div>
                )}
            </div>
            
            {/* Content */}
            <div className="p-4">
                <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors">
                    {title}
                </h2>
                
                {description && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {description}
                    </p>
                )}
                
                {/* Recipe preview info */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                        {recipe?.some(b => b.type === 'list') && (
                            <span className="flex items-center gap-1">
                                <span>📝</span>
                                <span>{recipe.filter(b => b.type === 'list').reduce((acc, b) => acc + (b.value?.length || 0), 0)} items</span>
                            </span>
                        )}
                    </div>
                    <span className="text-amber-500 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        View Recipe 
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            </div>
        </article>
    )
}

export default RecipeCard

