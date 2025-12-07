import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import SmoothScroll from './SmoothScroll'

export default function Layout() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  const content = (
    <div className="min-h-screen bg-gray-50">
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-slate-200"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className="text-xl font-bold text-slate-800 hover:text-blue-600 transition-colors"
              >
                Rudresh M
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/projects"
                className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Projects
              </Link>
              <Link
                to="/resume"
                className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Resume
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>
      <main className="pt-16">
        <Outlet />
      </main>
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2024 Portfolio. All rights reserved.</p>
            <Link
              to="/admin/login"
              className="text-slate-400 hover:text-slate-300 text-sm mt-2 md:mt-0 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )

  // Only wrap viewer pages with SmoothScroll, not admin pages
  if (isAdminRoute) {
    return content
  }

  return <SmoothScroll>{content}</SmoothScroll>
}
