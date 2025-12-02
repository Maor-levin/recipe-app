import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import RecipesList from '../components/RecipesList';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import Toast from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = (message) => {
    setToast({ message, type: 'success' });
  };

  const handleShareRecipeClick = () => {
    if (user) {
      navigate('/create-recipe');
    } else {
      sessionStorage.setItem('redirectAfterLogin', '/create-recipe');
      setShowAuthModal(true);
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-amber-50'>
      <NavBar onLoginClick={() => setShowAuthModal(true)} />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 py-16 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-[10%] text-8xl animate-bounce" style={{animationDuration: '3s'}}>🍕</div>
          <div className="absolute top-12 right-[15%] text-7xl animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}>🥗</div>
          <div className="absolute bottom-8 left-[20%] text-6xl animate-bounce" style={{animationDuration: '2.8s', animationDelay: '0.2s'}}>🍰</div>
          <div className="absolute bottom-4 right-[25%] text-8xl animate-bounce" style={{animationDuration: '3.2s', animationDelay: '0.8s'}}>🍜</div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to <span className="font-serif italic">Foody Bubble</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Discover, share, and cook amazing recipes from our community of food lovers
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#recipes" 
              className="bg-white text-amber-600 hover:bg-amber-50 font-bold px-8 py-3 rounded-full shadow-lg transition transform hover:scale-105"
            >
              Explore Recipes
            </a>
            <button 
              onClick={handleShareRecipeClick}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-3 rounded-full backdrop-blur-sm transition transform hover:scale-105"
            >
              Share Your Recipe
            </button>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-center gap-8 md:gap-16 text-center">
          <div>
            <div className="text-2xl md:text-3xl font-bold text-amber-500">🍳</div>
            <div className="text-sm text-gray-600">Easy Recipes</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-amber-500">👨‍🍳</div>
            <div className="text-sm text-gray-600">Community Chefs</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-amber-500">❤️</div>
            <div className="text-sm text-gray-600">Made with Love</div>
          </div>
          <div>
            <div className="text-2xl md:text-3xl font-bold text-amber-500">🌍</div>
            <div className="text-sm text-gray-600">Global Cuisines</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main id="recipes" className='flex-1'>
        <RecipesList className='w-full' />
      </main>
      
      <Footer className='bg-gray-800 text-white mt-auto' />

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

export default Home;
