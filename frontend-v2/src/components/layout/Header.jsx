function Header() {
    return (
        <div className="bg-gray-50 py-4 border-b border-gray-200">
            <div className="container mx-auto px-4 text-center">
                {/* Logo */}
                <div className="flex justify-center mb-2">
                    <img 
                        src="/foody_bubble_logo.png" 
                        alt="Foody Bubble Logo" 
                        className="w-64 h-auto object-contain"
                    />
                </div>

                {/* Quote/tagline */}
                <p className="text-gray-600 text-lg italic">
                    "Good food, good mood"
                </p>
            </div>
        </div>
    )
}

export default Header

