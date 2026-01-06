import { useState } from 'react'
import ConfirmModal from '../modals/ConfirmModal'
import { commentAPI } from '../../utils/api'
import { formatDateTime } from '../../utils/dateUtils'

function CommentItem({ comment, currentUser, onDelete, onUpdate }) {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(comment.content)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const maxLength = 2000

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true)
    }

    const handleConfirmDelete = async () => {
        setDeleting(true)
        try {
            await onDelete(comment.id)
            setShowDeleteConfirm(false)
        } catch (err) {
            console.error('Error deleting comment:', err)
            // Error state will be handled by parent component
        } finally {
            setDeleting(false)
        }
    }

    const handleEditClick = () => {
        setIsEditing(true)
        setEditContent(comment.content)
        setError('')
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        setEditContent(comment.content)
        setError('')
    }

    const handleSaveEdit = async () => {
        if (!editContent.trim()) {
            setError('Comment cannot be empty')
            return
        }

        if (editContent.trim() === comment.content) {
            setIsEditing(false)
            return
        }

        setSaving(true)
        setError('')

        try {
            const response = await commentAPI.update(comment.id, editContent.trim())
            onUpdate(response.data)
            setIsEditing(false)
        } catch (err) {
            console.error('Error updating comment:', err)
            setError('Failed to update comment')
        } finally {
            setSaving(false)
        }
    }

    const isOwnComment = currentUser && comment.author_name &&
        comment.author_name.toLowerCase() === currentUser.toLowerCase()

    return (
        <>
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Comment?"
                message="Are you sure you want to delete this comment? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                confirmButtonText="Delete"
                confirmButtonColor="red"
                isDanger={true}
            />

            <div className="border-b border-gray-200 py-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">
                            {comment.author_name}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">
                            {formatDateTime(comment.created_at)}
                        </span>
                    </div>

                    {isOwnComment && !isEditing && (
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleEditClick}
                                className="text-blue-500 hover:text-blue-700 text-sm transition font-medium"
                                title="Edit comment"
                            >
                                Edit
                            </button>
                            <button
                                onClick={handleDeleteClick}
                                disabled={deleting}
                                className="text-red-500 hover:text-red-700 text-sm transition font-medium disabled:opacity-50"
                                title="Delete comment"
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="mt-2">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            maxLength={maxLength}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <span className={`text-sm ${editContent.length > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                                {editContent.length}/{maxLength}
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                    className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm transition disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={saving || !editContent.trim()}
                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <p className="text-sm text-red-600 mt-1">{error}</p>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-700 whitespace-pre-wrap break-words">
                        {comment.content}
                    </p>
                )}
            </div>
        </>
    )
}

export default CommentItem

