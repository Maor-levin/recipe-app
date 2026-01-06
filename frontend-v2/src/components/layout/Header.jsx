function Header() {
    return (
        <div className="bg-gray-50 py-8 border-b border-gray-200">
            <div className="container mx-auto px-4 text-center">
                {/* Logo placeholder - replace with your image */}
                <div className="flex justify-center mb-3">
                    <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-4xl">R</span>
                    </div>
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

