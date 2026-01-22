import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { commentAPI } from '../../utils/api'
import CommentForm from './CommentForm'
import CommentList from './CommentList'

function CommentsSection({ recipeId, onAuthRequired }) {
    const { user } = useAuth()
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        // Fetch comments
        fetchComments()
    }, [recipeId])

    const fetchComments = async () => {
        try {
            setLoading(true)
            const response = await commentAPI.getForRecipe(recipeId)
            setComments(response.data)
            setError(null)
        } catch (err) {
            console.error('Error fetching comments:', err)
            setError('Failed to load comments')
        } finally {
            setLoading(false)
        }
    }

    const handleCommentAdded = async (content) => {
        const response = await commentAPI.create(recipeId, content)
        // Add new comment to the top of the list
        setComments([response.data, ...comments])
    }

    const handleCommentUpdated = (updatedComment) => {
        // Update the comment in the list
        setComments(comments.map(c =>
            c.id === updatedComment.id ? updatedComment : c
        ))
    }

    const handleCommentDeleted = async (commentId) => {
        await commentAPI.delete(commentId)
        // Remove comment from list
        setComments(comments.filter(c => c.id !== commentId))
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Comments ({comments.length})
            </h2>

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading comments...</p>
                </div>
            ) : error ? (
                <div className="text-center py-8 bg-red-50 rounded-lg">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={fetchComments}
                        className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <CommentList
                    comments={comments}
                    currentUser={user?.username}
                    onDelete={handleCommentDeleted}
                    onUpdate={handleCommentUpdated}
                />
            )}

            {/* Divider */}
            {!loading && !error && <div className="border-t border-gray-200 my-6"></div>}

            {/* Comment Form */}
            <CommentForm
                recipeId={recipeId}
                currentUser={user?.username}
                onCommentAdded={handleCommentAdded}
                onAuthRequired={onAuthRequired}
            />
        </div>
    )
}

export default CommentsSection

