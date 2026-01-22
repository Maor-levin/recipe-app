import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { noteAPI } from '../utils/api'

function NotesSection({ recipeId, onAuthRequired, isFavorited }) {
    const { isAuthenticated } = useAuth()
    const [note, setNote] = useState(null)
    const [content, setContent] = useState('')
    const [originalContent, setOriginalContent] = useState('')
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const saveTimeoutRef = useRef(null)

    const maxLength = 5000

    const fetchNote = useCallback(async () => {
        try {
            setLoading(true)
            const response = await noteAPI.getForRecipe(recipeId)
            if (response.data) {
                setNote(response.data)
                setContent(response.data.content)
                setOriginalContent(response.data.content)
            } else {
                setContent('')
                setOriginalContent('')
            }
        } catch (err) {
            // 404 is expected when no note exists
            if (err.response?.status !== 404) {
                console.error('Error fetching note:', err)
            }
            setContent('')
            setOriginalContent('')
        } finally {
            setLoading(false)
        }
    }, [recipeId])

    useEffect(() => {
        if (isAuthenticated) {
            fetchNote()
        } else {
            setLoading(false)
        }
    }, [recipeId, isAuthenticated, fetchNote])

    // Refetch note when favorited status changes to true
    useEffect(() => {
        if (isAuthenticated && isFavorited) {
            fetchNote()
        }
    }, [isFavorited, isAuthenticated, fetchNote])

    const saveNote = async (noteContent) => {
        setSaving(true)
        setError('')

        try {
            if (!noteContent.trim()) {
                // Delete note if content is empty
                if (note) {
                    await noteAPI.delete(recipeId)
                    setNote(null)
                    setOriginalContent('')
                }
            } else {
                // Save or update note
                const response = await noteAPI.saveOrUpdate(recipeId, noteContent.trim())
                setNote(response.data)
                setOriginalContent(response.data.content)
            }
        } catch (err) {
            console.error('Error saving note:', err)
            setError('Failed to save note')
        } finally {
            setSaving(false)
        }
    }

    // Auto-save with debounce
    useEffect(() => {
        if (!isFavorited || !isAuthenticated) return

        // Clear existing timeout
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        // Don't save if content hasn't changed
        if (content.trim() === originalContent.trim()) {
            return
        }

        // Set new timeout to save after 1.5 seconds of inactivity
        saveTimeoutRef.current = setTimeout(() => {
            saveNote(content)
        }, 1500)

        // Cleanup timeout on unmount
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current)
            }
        }
    }, [content, isFavorited, isAuthenticated])

    if (loading) {
        return null // Don't show anything while loading
    }

    return (
        <div className="h-full">
            <div
                className="relative rounded-lg overflow-hidden h-full flex flex-col"
                style={{
                    background: 'linear-gradient(to bottom, #fef9e7 0%, #fef3c7 100%)',
                    backgroundImage: `
            repeating-linear-gradient(
              transparent,
              transparent 31px,
              #e8d4a0 31px,
              #e8d4a0 32px
            )
          `,
                    backgroundSize: '100% 32px',
                    backgroundPosition: '0 16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 -2px 4px -1px rgba(0, 0, 0, 0.1), -2px 0 4px -1px rgba(0, 0, 0, 0.1)'
                }}
            >
                {/* Red vertical margin line */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-400"
                    style={{ left: '48px' }}
                />

                {/* Content area */}
                <div className="relative pl-16 pr-6 pb-6 flex-1 flex flex-col" style={{ paddingTop: '16px' }}>
                    <div className="flex justify-between items-start" style={{ height: '32px', marginBottom: '0', paddingTop: '4px' }}>
                        <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Georgia, serif', lineHeight: '32px', margin: 0, padding: 0 }}>
                            My Notes
                        </h3>
                    </div>

                    <div className="flex-1 flex flex-col">
                        {!isAuthenticated ? (
                            <div className="text-center py-6 flex-1 flex items-center justify-center">
                                <p className="text-gray-600 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                                    Please register to use notes
                                </p>
                            </div>
                        ) : !isFavorited ? (
                            <div className="text-center py-6 flex-1 flex items-center justify-center">
                                <p className="text-gray-600 mb-2 text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                                    ⭐ Favorite to add notes
                                </p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    maxLength={maxLength}
                                    placeholder="Add your personal notes here..."
                                    className="w-full px-3 py-0 border-0 bg-transparent focus:outline-none resize-none text-base flex-1"
                                    style={{
                                        fontFamily: 'Georgia, serif',
                                        lineHeight: '32px',
                                        paddingLeft: '0',
                                        paddingRight: '0',
                                        paddingTop: '4px'
                                    }}
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <span className={`text-xs ${content.length > maxLength * 0.9 ? 'text-red-600' : 'text-gray-600'}`}>
                                        {content.length}/{maxLength}
                                    </span>
                                    <span className="text-xs text-gray-500" style={{ fontFamily: 'Georgia, serif' }}>
                                        {saving ? '💾 Saving...' : content.trim() === originalContent.trim() ? '✓ Saved' : '✎ Editing...'}
                                    </span>
                                </div>
                                {error && (
                                    <p className="text-red-600 text-xs mt-1">{error}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotesSection

