import { useState } from 'react'

function CommentForm({ recipeId, currentUser, onCommentAdded, onAuthRequired }) {
    const [content, setContent] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    const maxLength = 2000

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!currentUser) {
            onAuthRequired()
            return
        }

        if (!content.trim()) {
            setError('Comment cannot be empty')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            await onCommentAdded(content.trim())
            setContent('') // Clear form on success
        } catch (err) {
            console.error('Error posting comment:', err)
            setError('Failed to post comment. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (e) => {
        setContent(e.target.value)
        if (error) setError('')
    }

    if (!currentUser) {
        return (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-3">
                    Please log in to leave a comment
                </p>
                <button
                    onClick={onAuthRequired}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                    Login to Comment
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-2">
                <textarea
                    value={content}
                    onChange={handleChange}
                    placeholder="Add a comment..."
                    rows={3}
                    maxLength={maxLength}
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100"
                />
            </div>

            <div className="flex justify-between items-center">
                <span className={`text-sm ${content.length > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                    {content.length}/{maxLength}
                </span>

                <button
                    type="submit"
                    disabled={submitting || !content.trim()}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Posting...' : 'Post Comment'}
                </button>
            </div>

            {error && (
                <div className="mt-2 text-sm text-red-600">
                    {error}
                </div>
            )}
        </form>
    )
}

export default CommentForm

