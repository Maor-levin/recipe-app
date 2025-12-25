function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Recipe App v2
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Built with React, Tailwind & Modern Best Practices
        </p>
        <div className="space-x-4">
          <a 
            href="/recipes" 
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Browse Recipes
          </a>
          <a 
            href="/login" 
            className="inline-block px-6 py-3 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home

