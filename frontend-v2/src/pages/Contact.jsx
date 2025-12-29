function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Contact Us</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-700 text-lg mb-6 text-center">
            Have a question or feedback? We'd love to hear from you!
          </p>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Email</h2>
              <p className="text-gray-600">contact@recipeapp.com</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">We're here to help</h2>
              <p className="text-gray-600">
                Feel free to reach out with any questions, suggestions, or issues you might have.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

