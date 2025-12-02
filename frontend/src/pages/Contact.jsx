import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import AuthModal from '../components/AuthModal';
import Toast from '../components/Toast';

const Contact = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toast, setToast] = useState(null);

  const handleAuthSuccess = (message) => {
    setToast({ message, type: 'success' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar onLoginClick={() => setShowAuthModal(true)} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-700">
          This is a generic contact page. More content coming soon!
        </p>
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

export default Contact;
