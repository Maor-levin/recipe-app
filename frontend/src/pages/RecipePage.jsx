import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import AuthModal from "../components/AuthModal";
import Toast from "../components/Toast";
import api from "../utils/api";

const RecipePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [toast, setToast] = useState(null);

    const handleAuthSuccess = (message) => {
        setToast({ message, type: 'success' });
    };

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const { data } = await api.get(`/recipes/${id}`);
                setRecipe(data);
            } catch (err) {
                setError(err.response?.data?.detail || "Failed to load recipe");
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-amber-50">
                <NavBar onLoginClick={() => setShowAuthModal(true)} />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
                        <p className="mt-4 text-amber-800 font-medium">Loading recipe...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-amber-50">
                <NavBar onLoginClick={() => setShowAuthModal(true)} />
                <main className="flex-1 flex items-center justify-center p-8">
                    <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md">
                        <div className="text-6xl mb-4">🍳</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate("/")}
                            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-full transition"
                        >
                            Back to Recipes
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const blocks = Array.isArray(recipe?.recipe) ? recipe.recipe : [];

    return (
        <div className="flex flex-col min-h-screen bg-amber-50">
            <NavBar onLoginClick={() => setShowAuthModal(true)} />
            
            {/* Header Section */}
            <div className="relative">
                <div className="h-32 md:h-40 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-4 left-8 text-6xl">🍽️</div>
                        <div className="absolute top-8 right-16 text-5xl">🥗</div>
                        <div className="absolute bottom-4 left-1/4 text-5xl">🍲</div>
                    </div>
                </div>
                
                {/* Back Button */}
                <button
                    onClick={() => navigate("/")}
                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 font-medium px-4 py-2 rounded-full shadow-lg transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>
            </div>

            {/* Recipe Content */}
            <main className="flex-1 -mt-12 relative z-10">
                <div className="max-w-4xl mx-auto px-4 pb-12">
                    {/* Title Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-serif">
                            {recipe.title}
                        </h1>
                        {recipe.description && (
                            <p className="text-lg text-gray-600 italic border-l-4 border-amber-400 pl-4">
                                {recipe.description}
                            </p>
                        )}
                        
                        {/* Recipe Meta */}
                        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">Recipe #{id}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-amber-500 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-sm">Save Recipe</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-amber-500 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                <span className="text-sm">Share</span>
                            </div>
                        </div>
                    </div>

                    {/* Recipe Blocks */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                        {blocks.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <div className="text-4xl mb-3">📝</div>
                                <p>No recipe content yet</p>
                            </div>
                        ) : (
                            <div className="recipe-content space-y-6">
                                {blocks.map((b, i) => {
                                    if (!b || !b.type) return null;
                                    
                                    switch (b.type) {
                                        case "subtitle":
                                            return (
                                                <h2 
                                                    key={`sub-${i}`} 
                                                    className="text-2xl font-bold text-gray-800 font-serif flex items-center gap-3 pt-4 first:pt-0"
                                                >
                                                    <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0">
                                                        {b.value.toLowerCase().includes('ingredient') ? '🥘' : 
                                                         b.value.toLowerCase().includes('instruction') ? '👨‍🍳' :
                                                         b.value.toLowerCase().includes('step') ? '📋' : '✨'}
                                                    </span>
                                                    {b.value}
                                                </h2>
                                            );

                                        case "list":
                                            return (
                                                <ul key={`list-${i}`} className="space-y-2 pl-2">
                                                    {(Array.isArray(b.value) ? b.value : []).map((item, j) => (
                                                        <li 
                                                            key={`li-${i}-${j}`}
                                                            className="flex items-start gap-3 text-gray-700"
                                                        >
                                                            <span className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-sm font-medium flex-shrink-0 mt-0.5">
                                                                {j + 1}
                                                            </span>
                                                            <span className="leading-relaxed">{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            );

                                        case "text":
                                            return (
                                                <p 
                                                    key={`text-${i}`} 
                                                    className="text-gray-700 leading-relaxed text-lg"
                                                >
                                                    {String(b.value)}
                                                </p>
                                            );

                                        case "img":
                                            return (
                                                <figure key={`img-${i}`} className="my-4 flex justify-center">
                                                    <img
                                                        src={String(b.value)}
                                                        alt=""
                                                        loading="lazy"
                                                        className="max-w-[60%] max-h-[400px] object-contain rounded-xl shadow-md"
                                                    />
                                                </figure>
                                            );

                                        default:
                                            return null;
                                    }
                                })}
                            </div>
                        )}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-center text-white">
                        <h3 className="text-xl font-bold mb-2">Enjoyed this recipe?</h3>
                        <p className="opacity-90 mb-4">Share it with your friends or save it for later!</p>
                        <div className="flex justify-center gap-3 flex-wrap">
                            <button className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full font-medium transition">
                                ❤️ Save
                            </button>
                            <button className="bg-white/20 hover:bg-white/30 px-5 py-2 rounded-full font-medium transition">
                                📤 Share
                            </button>
                            <button 
                                onClick={() => navigate("/")}
                                className="bg-white text-amber-600 hover:bg-amber-50 px-5 py-2 rounded-full font-medium transition"
                            >
                                Browse More
                            </button>
                        </div>
                    </div>
                </div>
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

export default RecipePage;
