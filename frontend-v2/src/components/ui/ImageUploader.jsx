import { useState, useRef } from 'react'
import { uploadAPI } from '../../utils/api'

/**
 * ImageUploader - A drag-and-drop image uploader
 * 
 * Features:
 * - Drag & drop or click to browse
 * - Image preview
 * - Upload progress
 * - File validation (type, size)
 * - Shows current image when editing
 * 
 * Props:
 * - value: current image URL (optional)
 * - onChange: callback(url) when upload completes
 * - onError: callback(errorMessage) on upload failure
 * - height: Tailwind height class (default: 'h-64')
 */
function ImageUploader({ value, onChange, onError, height = 'h-64' }) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [previewUrl, setPreviewUrl] = useState(value || '')
    const fileInputRef = useRef(null)

    // Allowed file types
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB

    // Helper to extract public_id from Cloudinary URL
    const getPublicIdFromUrl = (url) => {
        if (!url || !url.includes('cloudinary.com')) return null
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
        return match ? match[1] : null
    }

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Invalid file type. Please upload JPEG, PNG, GIF, or WebP images.'
        }
        if (file.size > MAX_SIZE) {
            return 'File too large. Maximum size is 5MB.'
        }
        return null
    }

    const uploadImage = async (file) => {
        const validationError = validateFile(file)
        if (validationError) {
            onError?.(validationError)
            return
        }

        try {
            setIsUploading(true)
            setUploadProgress(20)

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => setPreviewUrl(e.target.result)
            reader.readAsDataURL(file)

            setUploadProgress(40)

            // Upload to backend
            const response = await uploadAPI.uploadImage(file)
            setUploadProgress(100)

            // Call onChange with the uploaded image URL
            onChange(response.data.url)
            setPreviewUrl(response.data.url)

        } catch (error) {
            const errorMsg = error.response?.data?.detail || 'Failed to upload image'
            onError?.(errorMsg)
            setPreviewUrl(value || '')
        } finally {
            setIsUploading(false)
            setUploadProgress(0)
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file) {
            uploadImage(file)
        }
    }

    const handleFileSelect = (e) => {
        const file = e.target.files[0]
        if (file) {
            uploadImage(file)
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleRemove = async () => {
        // Delete from Cloudinary if it's a Cloudinary URL
        const publicId = getPublicIdFromUrl(previewUrl)
        if (publicId) {
            try {
                await uploadAPI.deleteImage(publicId)
            } catch (err) {
                console.error('Failed to delete image from Cloudinary:', err)
                // Continue anyway - clear from UI even if delete fails
            }
        }

        setPreviewUrl('')
        onChange('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
            />

            {previewUrl ? (
                // Image Preview
                <div className="relative group">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className={`w-full ${height} object-cover rounded-lg border-2 border-gray-300`}
                    />

                    {/* Overlay with actions on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={handleClick}
                            disabled={isUploading}
                            className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 font-medium"
                        >
                            Change
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={isUploading}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
                        >
                            Remove
                        </button>
                    </div>

                    {/* Upload Progress Overlay */}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex flex-col items-center justify-center">
                            <div className="w-3/4 bg-gray-700 rounded-full h-3 mb-2">
                                <div
                                    className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <span className="text-white text-sm">Uploading... {uploadProgress}%</span>
                        </div>
                    )}
                </div>
            ) : (
                // Upload Zone
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClick}
                    className={`
            w-full ${height} border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center gap-3
            cursor-pointer transition-all
            ${isDragging
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-300 bg-gray-50 hover:border-orange-400 hover:bg-orange-25'
                        }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
                >
                    {isUploading ? (
                        <>
                            <div className="w-16 h-16 border-4 border-gray-300 border-t-orange-500 rounded-full animate-spin" />
                            <span className="text-gray-600 font-medium">Uploading...</span>
                            <div className="w-3/4 bg-gray-300 rounded-full h-2">
                                <div
                                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Upload Icon */}
                            <svg
                                className="w-16 h-16 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                            <div className="text-center">
                                <p className="text-gray-700 font-medium">
                                    Drag & drop an image here, or click to browse
                                </p>
                                <p className="text-gray-500 text-sm mt-1">
                                    JPEG, PNG, GIF, WebP • Max 5MB
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default ImageUploader
