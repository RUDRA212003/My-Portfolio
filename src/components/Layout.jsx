import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import SmoothScroll from './SmoothScroll'
import { useEffect, useState } from 'react'

export default function Layout() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  const [scrolled, setScrolled] = useState(false)

  // Detect Scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)   // Change navbar color after 80px scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navbarBg = scrolled
    ? "bg-white/90 backdrop-blur-md shadow-md border-b border-slate-200"
    : "bg-transparent"

  const navText = scrolled ? "text-slate-800" : "text-white"
  const navHover = scrolled ? "hover:text-blue-600" : "hover:text-blue-300"

  const content = (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navbarBg}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                to="/"
                className={`text-xl font-bold transition-colors ${navText} ${navHover}`}
              >
                Rudresh M
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`${navText} ${navHover} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Home
              </Link>
              <Link
                to="/projects"
                className={`${navText} ${navHover} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Projects
              </Link>
              <Link
                to="/resume"
                className={`${navText} ${navHover} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Resume
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* PAGE CONTENT */}
      <main className={location.pathname === "/" ? "" : "pt-16"}>
        <Outlet />
      </main>


      {/* FOOTER */}
      {/* FOOTER */}
<footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-10 mt-16">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Top: Social Icons */}
    <div className="flex flex-wrap justify-center gap-6 mb-6">

      {/* LinkedIn */}
      <a
        href="https://www.linkedin.com/in/rudresh-manjunath21/"
        target="_blank"
        className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
      >
        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" className="w-5 h-5" />
        <span className="text-sm">LinkedIn</span>
      </a>

      {/* GitHub */}
      <a
        href="https://github.com/RUDRA212003"
        target="_blank"
        className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
      >
        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" className="w-5 h-5" />
        <span className="text-sm">GitHub</span>
      </a>

      {/* X (Twitter) */}
      <a
        href="https://x.com/yo_rudra"
        target="_blank"
        className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
      >
        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg" className="w-5 h-5" />
        <span className="text-sm">X</span>
      </a>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/yoyorudra_offical/?hl=en"
        target="_blank"
        className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
      >
        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" className="w-5 h-5" />
        <span className="text-sm">Instagram</span>
      </a>

      {/* YouTube */}
      <a
        href="https://www.youtube.com/@yoyorudraandroidtech"
        target="_blank"
        className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
      >
        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" className="w-5 h-5" />
        <span className="text-sm">YouTube</span>
      </a>

      {/* Gmail */}
      <a
        href="mailto:rudreshmanjunath15@gmail.com"
        className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
      >
        <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg" className="w-5 h-5" />
        <span className="text-sm">Email</span>
      </a>

    </div>

    {/* Divider */}
    <div className="border-t border-white/20 my-6"></div>

    {/* Bottom: Rights + Admin */}
    <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-90">
      <p>&copy; 2025 Rudresh M Portfolio. All rights reserved.</p>

      <Link
        to="/admin/login"
        className="text-slate-300 hover:text-white mt-3 md:mt-0 transition"
      >
        Admin
      </Link>
    </div>

  </div>
</footer>

    </div>
  )

  if (isAdminRoute) return content

  return <SmoothScroll>{content}</SmoothScroll>
}
