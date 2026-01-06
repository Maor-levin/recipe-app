import { useState } from 'react'
import { recipeAPI, userAPI } from '../../utils/api'

function BulkUploadRecipes() {
    const [uploadStatus, setUploadStatus] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState('')

    const handleFileUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Check file type
        if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
            setError('Please upload a JSON file')
            setUploadStatus(null)
            return
        }

        setUploading(true)
        setError('')
        setUploadStatus(null)

        try {
            // Read file content
            const fileContent = await file.text()
            const recipes = JSON.parse(fileContent)

            // Validate that it's an array
            if (!Array.isArray(recipes)) {
                throw new Error('JSON file must contain an array of recipes')
            }

            // Validate each recipe has required fields
            for (const recipe of recipes) {
                if (!recipe.title || !recipe.recipe) {
                    throw new Error('Each recipe must have a title and recipe content')
                }
            }

            // Get current user's recipes to check for duplicates
            let existingTitles = new Set()
            try {
                const userResponse = await userAPI.getMe()
                const userId = userResponse.data.id
                const userRecipesResponse = await recipeAPI.getByUser(userId)
                const userRecipes = userRecipesResponse.data
                existingTitles = new Set(userRecipes.map(r => r.title.toLowerCase()))
            } catch (err) {
                console.warn('Could not fetch existing recipes for duplicate check:', err)
            }

            // Process recipes one by one
            const results = {
                added: [],
                skipped: []
            }

            for (const recipe of recipes) {
                const titleLower = recipe.title.toLowerCase()

                // Check if duplicate
                if (existingTitles.has(titleLower)) {
                    results.skipped.push(recipe.title)
                    continue
                }

                try {
                    // Create recipe using existing endpoint
                    await recipeAPI.create(recipe)
                    results.added.push(recipe.title)
                    existingTitles.add(titleLower) // Add to set to prevent duplicates in same batch
                } catch (err) {
                    // If creation fails, skip it
                    console.warn(`Failed to create recipe "${recipe.title}":`, err)
                    results.skipped.push(recipe.title)
                }
            }

            setUploadStatus({
                success: true,
                added: results.added.length,
                skipped: results.skipped.length,
                total: recipes.length,
                addedTitles: results.added,
                skippedTitles: results.skipped
            })

            // Clear file input
            e.target.value = ''
        } catch (err) {
            console.error('Error uploading recipes:', err)
            const errorMessage = err.response?.data?.detail || err.message || 'Failed to upload recipes'
            setError(errorMessage)
            setUploadStatus(null)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Bulk Upload Recipes</h2>
            <p className="text-sm text-gray-600 mb-4">
                Upload multiple recipes from a JSON file. Duplicates (by title) will be automatically skipped.
            </p>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {uploadStatus && uploadStatus.success && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
                    <div className="font-semibold mb-2">✅ Upload Complete!</div>
                    <div className="text-sm">
                        <p>Added: {uploadStatus.added} recipe(s)</p>
                        {uploadStatus.skipped > 0 && (
                            <p className="mt-1">Skipped: {uploadStatus.skipped} duplicate(s)</p>
                        )}
                        {uploadStatus.skippedTitles && uploadStatus.skippedTitles.length > 0 && (
                            <details className="mt-2">
                                <summary className="cursor-pointer text-green-700 hover:text-green-900">
                                    View skipped recipes ({uploadStatus.skippedTitles.length})
                                </summary>
                                <ul className="list-disc list-inside mt-1 text-xs">
                                    {uploadStatus.skippedTitles.map((title, idx) => (
                                        <li key={idx}>{title}</li>
                                    ))}
                                </ul>
                            </details>
                        )}
                    </div>
                </div>
            )}

            <div className="flex items-center gap-4">
                <label className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer font-medium disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {uploading ? 'Uploading...' : '📁 Upload JSON File'}
                    <input
                        type="file"
                        accept=".json,application/json"
                        onChange={handleFileUpload}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
                {uploading && (
                    <span className="text-sm text-gray-600">Processing recipes...</span>
                )}
            </div>
        </div>
    )
}

export default BulkUploadRecipes

