import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
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

export default function ProjectsSection() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState(null)
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [hoverTimer, setHoverTimer] = useState(null)

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
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-600">
          Loading...
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-bold text-slate-800">Projects</h2>

          {/* ⭐ FIXED VIEW ALL — Using Link instead of <a> */}
          <Link to="/projects">
            <motion.div
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center cursor-pointer"
              whileHover={{ x: 5 }}
            >
              View All →
            </motion.div>
          </Link>
        </motion.div>

        {/* Horizontal Scroll Section */}
        <motion.div
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          style={{ scrollSnapType: "x mandatory" }}
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              className="group relative"
              style={{ scrollSnapAlign: "start" }}

              onMouseEnter={() => {
                const timer = setTimeout(() => {
                  setSelectedProject(project)
                  setShowFeedbackForm(false)
                }, 500)
                setHoverTimer(timer)
              }}
              onMouseLeave={() => clearTimeout(hoverTimer)}

              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
            >
              <div className="bg-white rounded-xl border border-slate-200 shadow-lg hover:shadow-2xl cursor-pointer transition-all hover:border-blue-300 min-w-[300px] max-w-[300px] h-[420px] flex flex-col overflow-hidden">

                {project.image_url && (
                  <div className="h-40 overflow-hidden flex-shrink-0 relative">
                    <motion.img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}

                <div className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {project.title}
                    </h3>

                    <p className="text-slate-600 text-sm mt-2 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex gap-3 mt-4">
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-900"
                      >
                        GitHub
                      </a>
                    )}

                    {project.demo_link && (
                      <a
                        href={project.demo_link}
                        target="_blank"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 shadow-md"
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

        {/* If no projects */}
        {projects.length === 0 && (
          <motion.div
            className="text-center text-slate-500 py-12 bg-white/50 rounded-xl mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No projects available yet.
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
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
                className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl my-8"
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

                    <motion.p
                      className="text-slate-700 text-lg leading-relaxed whitespace-pre-line mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {selectedProject.description}
                    </motion.p>

                    <div className="flex gap-4 mb-6">
                      {selectedProject.github_link && (
                        <a
                          href={selectedProject.github_link}
                          target="_blank"
                          className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-900"
                        >
                          GitHub
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
                      className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700"
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
                      className="bg-blue-600 text-white w-full py-3 rounded-lg"
                    >
                      Submit
                    </button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
