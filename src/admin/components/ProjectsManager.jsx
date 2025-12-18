import { useEffect, useState } from 'react'
import { supabase } from '../../supabase/supabaseClient'
import { useFileUpload } from '../../hooks/useFileUpload'
import ImageUpload from '../../components/ImageUpload'

export default function ProjectsManager() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)

  const [feedback, setFeedback] = useState([])
  const [feedbackCounts, setFeedbackCounts] = useState({})

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    github_link: '',
    demo_link: '',
    sort_order: 1,
  })

  const { uploadFile } = useFileUpload()
  const [uploading, setUploading] = useState(false)

  /* ----------------------------------
     INITIAL LOAD + REALTIME
  ---------------------------------- */
  useEffect(() => {
    fetchProjects()
    fetchUnreadFeedbackCounts()

    const channel = supabase
      .channel('project-feedback-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'project_feedback' },
        () => fetchUnreadFeedbackCounts()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  /* ----------------------------------
     FETCH PROJECTS
  ---------------------------------- */
  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (!error) setProjects(data || [])
    setLoading(false)
  }

  /* ----------------------------------
     FEEDBACK LOGIC
  ---------------------------------- */
  const fetchFeedback = async (projectId) => {
    const { data, error } = await supabase
      .from('project_feedback')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (!error) setFeedback(data || [])
  }

  const fetchUnreadFeedbackCounts = async () => {
    const { data, error } = await supabase
      .from('project_feedback')
      .select('project_id')
      .eq('is_read', false)

    if (error) return

    const counts = {}
    data.forEach((item) => {
      counts[item.project_id] = (counts[item.project_id] || 0) + 1
    })

    setFeedbackCounts(counts)
  }

  const handleViewFeedback = async (project) => {
    setSelectedProject(project)
    fetchFeedback(project.id)

    await supabase
      .from('project_feedback')
      .update({ is_read: true })
      .eq('project_id', project.id)
      .eq('is_read', false)

    fetchUnreadFeedbackCounts()
  }

  /* ----------------------------------
     IMAGE UPLOAD
  ---------------------------------- */
  const handleImageUpload = async (file) => {
    if (!file) return
    setUploading(true)

    const fileName = `project-${Date.now()}.${file.name.split('.').pop()}`
    const { url } = await uploadFile(file, 'project_images', fileName)

    setFormData({ ...formData, image_url: url })
    setUploading(false)
  }

  /* ----------------------------------
     CREATE / UPDATE
  ---------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (editingProject) {
      await supabase
        .from('projects')
        .update(formData)
        .eq('id', editingProject.id)
    } else {
      await supabase.from('projects').insert(formData)
    }

    setShowForm(false)
    setEditingProject(null)
    setFormData({
      title: '',
      description: '',
      image_url: '',
      github_link: '',
      demo_link: '',
      sort_order: 1,
    })

    fetchProjects()
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData(project)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete project?')) return
    await supabase.from('projects').delete().eq('id', id)
    fetchProjects()
  }

  /* ----------------------------------
     LOADING
  ---------------------------------- */
  if (loading) return <div className="text-center py-8">Loading...</div>

  /* ----------------------------------
     FEEDBACK VIEW
  ---------------------------------- */
  if (selectedProject) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setSelectedProject(null)
            setFeedback([])
          }}
          className="text-blue-600"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold">
          Feedback for {selectedProject.title}
        </h2>

        {feedback.length === 0 ? (
          <p className="text-gray-500">No feedback yet.</p>
        ) : (
          feedback.map((item) => (
            <div key={item.id} className="border p-4 rounded bg-gray-50">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">{item.email}</p>
              <p className="mt-2">{item.message}</p>
            </div>
          ))
        )}
      </div>
    )
  }

  /* ----------------------------------
     MAIN VIEW
  ---------------------------------- */
  return (
    <div className="space-y-6">

      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Manage Projects</h2>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingProject(null)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Project
        </button>
      </div>

      {/* PROJECT GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="border p-4 rounded">

            <h3 className="font-semibold">{project.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {project.description}
            </p>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleEdit(project)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => handleViewFeedback(project)}
                className="relative text-green-600 text-sm"
              >
                View Feedback
                {feedbackCounts[project.id] > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 rounded-full">
                    {feedbackCounts[project.id]}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-gray-500 text-center">No projects yet.</p>
      )}
    </div>
  )
}
