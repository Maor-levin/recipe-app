import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import AuthModal from '../components/AuthModal';
import Toast from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [blocks, setBlocks] = useState([]);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleAuthSuccess = (message) => {
    setToast({ message, type: 'success' });
  };

  const addBlock = (type) => {
    const newBlock = { type, value: type === 'list' ? [''] : '' };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (index, value) => {
    const updated = [...blocks];
    updated[index].value = value;
    setBlocks(updated);
  };

  const updateListItem = (blockIndex, itemIndex, value) => {
    const updated = [...blocks];
    updated[blockIndex].value[itemIndex] = value;
    setBlocks(updated);
  };

  const addListItem = (blockIndex) => {
    const updated = [...blocks];
    updated[blockIndex].value.push('');
    setBlocks(updated);
  };

  const removeListItem = (blockIndex, itemIndex) => {
    const updated = [...blocks];
    updated[blockIndex].value.splice(itemIndex, 1);
    setBlocks(updated);
  };

  const removeBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    const updated = [...blocks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setBlocks(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Blocks:', blocks);
    
    if (!title.trim()) {
      setToast({ message: 'Please enter a title', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      console.log('Sending request to /recipes/...');
      const { data } = await api.post('/recipes/', {
        title,
        description,
        thumbnail: thumbnail || null,
        recipe: blocks,
      });
      console.log('Response:', data);
      setToast({ message: 'Recipe created successfully!', type: 'success' });
      setTimeout(() => navigate(`/recipes/${data.id}`), 1000);
    } catch (err) {
      console.error('Error creating recipe:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response);
      console.error('Error status:', err.response?.status);
      console.error('Error data:', JSON.stringify(err.response?.data, null, 2));
      
      let errorMsg = 'Failed to create recipe';
      if (err.response?.data?.detail) {
        errorMsg = typeof err.response.data.detail === 'string' 
          ? err.response.data.detail 
          : JSON.stringify(err.response.data.detail);
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setToast({
        message: errorMsg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavBar onLoginClick={() => setShowAuthModal(true)} />

      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6">Create New Recipe</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="My Amazing Recipe"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 h-24 resize-none"
              placeholder="A brief description of your recipe..."
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Thumbnail Image
            </label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="https://example.com/your-recipe-image.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This image will be shown as the recipe card preview
                </p>
              </div>
              {thumbnail && (
                <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                  <img 
                    src={thumbnail} 
                    alt="Thumbnail preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Recipe Blocks */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Recipe Content
            </label>

            {/* Block List */}
            <div className="space-y-4 mb-4">
              {blocks.map((block, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-500 uppercase">
                      {block.type}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveBlock(index, -1)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => moveBlock(index, 1)}
                        disabled={index === blocks.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeBlock(index)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {block.type === 'subtitle' && (
                    <input
                      type="text"
                      value={block.value}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Section title..."
                    />
                  )}

                  {block.type === 'text' && (
                    <textarea
                      value={block.value}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 h-20 resize-none"
                      placeholder="Write your text here..."
                    />
                  )}

                  {block.type === 'img' && (
                    <input
                      type="url"
                      value={block.value}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  )}

                  {block.type === 'list' && (
                    <div className="space-y-2">
                      {block.value.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2">
                          <span className="text-gray-400 py-2">•</span>
                          <input
                            type="text"
                            value={item}
                            onChange={(e) =>
                              updateListItem(index, itemIndex, e.target.value)
                            }
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="List item..."
                          />
                          <button
                            type="button"
                            onClick={() => removeListItem(index, itemIndex)}
                            className="text-red-400 hover:text-red-600 px-2"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addListItem(index)}
                        className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                      >
                        + Add item
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add Block Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => addBlock('subtitle')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
                + Subtitle
              </button>
              <button
                type="button"
                onClick={() => addBlock('text')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
                + Text
              </button>
              <button
                type="button"
                onClick={() => addBlock('list')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
                + List
              </button>
              <button
                type="button"
                onClick={() => addBlock('img')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
              >
                + Image
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CreateRecipe;

