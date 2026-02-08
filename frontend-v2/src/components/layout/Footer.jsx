function Footer() {
    const currentYear = new Date().getFullYear()
    
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="text-center text-gray-600 text-sm">
                    <p>© {currentYear} Foody Bubble. All rights reserved.</p>
                    <p className="mt-1">Developed by Maor Levin</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
