import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabase/supabaseClient'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  // ⭐ UPDATED SORTING LOGIC
  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })     // MAIN SORT
        .order('created_at', { ascending: false })    // fallback

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    if (!selectedProject) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from('project_feedback').insert({
        project_id: selectedProject.id,
        name: feedbackForm.name,
        email: feedbackForm.email,
        message: feedbackForm.message,
      })

      if (error) throw error

      setSubmitted(true)
      setFeedbackForm({ name: '', email: '', message: '' })

      setTimeout(() => {
        setSubmitted(false)
        setShowFeedbackForm(false)
      }, 3000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 py-16 flex items-center justify-center">
        <div className="text-slate-600 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <motion.h1
          className="text-5xl lg:text-6xl font-bold text-center mb-16 text-slate-800"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          My Projects
        </motion.h1>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              className="group relative"
            >
              <div
                onClick={() => setSelectedProject(project)}
                className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-200/30"
              >
                
                {/* Card Image */}
                {project.image_url && (
                  <div className="h-48 overflow-hidden relative">
                    <motion.img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-slate-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900"
                      >
                        GitHub
                      </a>
                    )}

                    {project.demo_link && (
                      <a
                        href={project.demo_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-md"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Projects */}
        {projects.length === 0 && (
          <motion.div
            className="text-center text-slate-500 py-12 bg-white/50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No projects available yet.
          </motion.div>
        )}

        {/* Modal */}
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setSelectedProject(null)
              setShowFeedbackForm(false)
            }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-3xl w-full my-8 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Content */}
              {!showFeedbackForm ? (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold text-slate-800">
                      {selectedProject.title}
                    </h2>
                    <button
                      onClick={() => {
                        setSelectedProject(null)
                        setShowFeedbackForm(false)
                      }}
                      className="text-slate-500 hover:text-slate-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>

                  {selectedProject.image_url && (
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <img
                        src={selectedProject.image_url}
                        alt={selectedProject.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </motion.div>
                  )}

                  <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line mb-6">
                    {selectedProject.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-6">
                    {selectedProject.github_link && (
                      <a
                        href={selectedProject.github_link}
                        target="_blank"
                        className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-900"
                      >
                        View on GitHub
                      </a>
                    )}
                    {selectedProject.demo_link && (
                      <a
                        href={selectedProject.demo_link}
                        target="_blank"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-lg"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>

                  <motion.button
                    onClick={() => setShowFeedbackForm(true)}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-all"
                  >
                    Leave Feedback
                  </motion.button>
                </>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={feedbackForm.name}
                    onChange={(e) =>
                      setFeedbackForm({ ...feedbackForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border"
                  />

                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={feedbackForm.email}
                    onChange={(e) =>
                      setFeedbackForm({ ...feedbackForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border"
                  />

                  <textarea
                    required
                    rows="4"
                    placeholder="Message"
                    value={feedbackForm.message}
                    onChange={(e) =>
                      setFeedbackForm({ ...feedbackForm, message: e.target.value })
                    }
                    className="w-full px-3 py-2 border"
                  />

                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg w-full"
                  >
                    Submit
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}

      </div>
    </div>
  )
}
