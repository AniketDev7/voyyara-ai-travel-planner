import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-transparent backdrop-blur-sm border-t border-gray-200/50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              ✈️ Voyyara
            </h3>
            <p className="text-gray-600 mb-4">
              Plan your perfect trip with AI-powered itineraries. Get personalized recommendations in seconds.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/destinations" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/planner" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                  Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-purple-600 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} AI Travel Planner. Powered by AI and Contentstack.
        </div>
      </div>
    </footer>
  );
}

