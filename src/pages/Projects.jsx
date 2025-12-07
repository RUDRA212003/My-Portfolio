import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabase/supabaseClient'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
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

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

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
        <motion.h1
          className="text-5xl lg:text-6xl font-bold text-center mb-16 text-slate-800"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          My Projects
        </motion.h1>

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
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-600 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors"
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
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-blue-500/50"
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

        {projects.length === 0 && (
          <motion.div
            className="text-center text-slate-500 py-12 bg-white/50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No projects available yet.
          </motion.div>
        )}

        {/* Project Detail Modal */}
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

                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
                      {selectedProject.description}
                    </p>
                  </motion.div>

                  <motion.div
                    className="flex flex-wrap gap-4 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {selectedProject.github_link && (
                      <a
                        href={selectedProject.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-900 transition-colors inline-flex items-center"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        View on GitHub
                      </a>
                    )}
                    {selectedProject.demo_link && (
                      <a
                        href={selectedProject.demo_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/50 inline-flex items-center"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        View Live Demo
                      </a>
                    )}
                  </motion.div>

                  <motion.button
                    onClick={() => setShowFeedbackForm(true)}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Leave Feedback
                  </motion.button>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">
                      Feedback for {selectedProject.title}
                    </h2>
                    <button
                      onClick={() => {
                        setShowFeedbackForm(false)
                        setFeedbackForm({ name: '', email: '', message: '' })
                      }}
                      className="text-slate-500 hover:text-slate-700 text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  {submitted ? (
                    <motion.div
                      className="text-emerald-600 text-center py-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      Thank you for your feedback!
                    </motion.div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={feedbackForm.name}
                          onChange={(e) =>
                            setFeedbackForm({ ...feedbackForm, name: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          required
                          value={feedbackForm.email}
                          onChange={(e) =>
                            setFeedbackForm({
                              ...feedbackForm,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Message
                        </label>
                        <textarea
                          required
                          value={feedbackForm.message}
                          onChange={(e) =>
                            setFeedbackForm({
                              ...feedbackForm,
                              message: e.target.value,
                            })
                          }
                          rows="4"
                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowFeedbackForm(false)
                            setFeedbackForm({ name: '', email: '', message: '' })
                          }}
                          className="flex-1 bg-slate-300 text-slate-700 py-2 px-4 rounded-md hover:bg-slate-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
