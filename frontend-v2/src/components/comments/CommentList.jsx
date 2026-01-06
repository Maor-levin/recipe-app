import { useState } from 'react'
import CommentItem from './CommentItem'

function CommentList({ comments, currentUser, onDelete, onUpdate }) {
    const [displayCount, setDisplayCount] = useState(10)

    if (comments.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No comments yet. Be the first to comment!
            </div>
        )
    }

    const visibleComments = comments.slice(0, displayCount)
    const remainingCount = comments.length - displayCount

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 10)
    }

    return (
        <div>
            <div className="space-y-0">
                {visibleComments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUser={currentUser}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                    />
                ))}
            </div>

            {remainingCount > 0 && (
                <div className="text-center mt-6">
                    <button
                        onClick={handleLoadMore}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                        Load More Comments ({remainingCount} remaining)
                    </button>
                </div>
            )}
        </div>
    )
}

export default CommentList

