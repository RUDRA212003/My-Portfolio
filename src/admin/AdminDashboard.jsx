import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeroManager from './components/HeroManager'
import AboutManager from './components/AboutManager'
import CardsManager from './components/CardsManager'
import ProjectsManager from './components/ProjectsManager'
import ResumeManager from './components/ResumeManager'
import ContactManager from './components/ContactManager'
import AdminTechStack from './components/AdminTechStack'   // ⭐ NEW

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('hero')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    navigate('/admin/login')
  }

  const tabs = [
    { id: 'hero', label: 'Hero' },
    { id: 'about', label: 'About' },
    { id: 'cards', label: 'Cards' },
    { id: 'projects', label: 'Projects' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact Messages' },
    { id: 'techstack', label: 'Tech Stack' }, // ⭐ NEW
  ]

  useEffect(() => {
    const scrollElement = document.getElementById("scrollTabs")
    const rightFade = document.getElementById("rightFade")
    if (scrollElement && rightFade) {
      rightFade.style.opacity =
        scrollElement.scrollWidth > scrollElement.clientWidth ? "1" : "0"
    }
  }, [])

  const handleTabScroll = (e) => {
    const element = e.target
    const leftFade = document.getElementById("leftFade")
    const rightFade = document.getElementById("rightFade")

    if (!leftFade || !rightFade) return

    leftFade.style.opacity = element.scrollLeft > 5 ? "1" : "0"
    rightFade.style.opacity =
      element.scrollWidth - element.clientWidth - element.scrollLeft > 5 ? "1" : "0"
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>

            <div className="flex items-center space-x-4">
              <a href="/" target="_blank" className="text-blue-600 hover:text-blue-800">
                View Site
              </a>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="relative border-b border-gray-200">

            <div id="leftFade" className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-slate-200 to-transparent opacity-0 transition-opacity duration-300" />

            <nav
              id="scrollTabs"
              className="flex gap-2 overflow-x-auto scrollbar-hide px-2 py-1"
              onScroll={handleTabScroll}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap px-6 py-3 text-sm font-medium border-b-2 rounded-t-md transition-all
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div id="rightFade" className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-slate-200 to-transparent opacity-100 transition-opacity duration-300" />

          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === 'hero' && <HeroManager />}
          {activeTab === 'about' && <AboutManager />}
          {activeTab === 'cards' && <CardsManager />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'resume' && <ResumeManager />}
          {activeTab === 'contact' && <ContactManager />}

          {/* ⭐ NEW */}
          {activeTab === 'techstack' && <AdminTechStack />}
        </div>
      </div>
    </div>
  )
}
