import { useEffect, useState } from 'react'
import { supabase } from '../../supabase/supabaseClient'
import { useFileUpload } from '../../hooks/useFileUpload'
import ImageUpload from '../../components/ImageUpload'

export default function ProjectsManager() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    github_link: '',
    demo_link: '',
  })
  const [uploading, setUploading] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [feedback, setFeedback] = useState([])
  const { uploadFile } = useFileUpload()

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

  const fetchFeedback = async (projectId) => {
    try {
      const { data, error } = await supabase
        .from('project_feedback')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFeedback(data || [])
    } catch (error) {
      console.error('Error fetching feedback:', error)
    }
  }

  const handleImageUpload = async (file) => {
    if (!file) return

    setUploading(true)
    try {
      const fileName = `project-${Date.now()}.${file.name.split('.').pop()}`
      const { url, error } = await uploadFile(file, 'project_images', fileName)

      if (error) throw error

      setFormData({ ...formData, image_url: url })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(formData)
          .eq('id', editingProject.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from('projects').insert(formData)
        if (error) throw error
      }

      alert('Project saved successfully!')
      setShowForm(false)
      setEditingProject(null)
      setFormData({ title: '', description: '', image_url: '', github_link: '', demo_link: '' })
      fetchProjects()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Failed to save project')
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description || '',
      image_url: project.image_url || '',
      github_link: project.github_link || '',
      demo_link: project.demo_link || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const { error } = await supabase.from('projects').delete().eq('id', id)
      if (error) throw error

      alert('Project deleted successfully!')
      fetchProjects()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  const handleViewFeedback = (project) => {
    setSelectedProject(project)
    fetchFeedback(project.id)
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => {
                setSelectedProject(null)
                setFeedback([])
              }}
              className="text-blue-600 hover:text-blue-800 mb-2"
            >
              ← Back to Projects
            </button>
            <h2 className="text-2xl font-bold text-gray-800">
              Feedback for: {selectedProject.title}
            </h2>
          </div>
        </div>

        <div className="space-y-4">
          {feedback.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No feedback yet.</div>
          ) : (
            feedback.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.email}</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-gray-700 mt-2">{item.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manage Projects</h2>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingProject(null)
            setFormData({ title: '', description: '', image_url: '', github_link: '' })
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Project
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingProject ? 'Edit Project' : 'Add New Project'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Link
              </label>
              <input
                type="url"
                value={formData.github_link}
                onChange={(e) =>
                  setFormData({ ...formData, github_link: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Demo Link
              </label>
              <input
                type="url"
                value={formData.demo_link}
                onChange={(e) =>
                  setFormData({ ...formData, demo_link: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-demo-link.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              <ImageUpload
                onUpload={handleImageUpload}
                currentImage={formData.image_url}
                uploading={uploading}
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                {editingProject ? 'Update' : 'Create'} Project
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingProject(null)
                  setFormData({ title: '', description: '', image_url: '', github_link: '', demo_link: '' })
                }}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {project.image_url && (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-semibold text-gray-800">{project.title}</h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {project.description}
            </p>
            {project.github_link && (
              <a
                href={project.github_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm"
              >
                GitHub →
              </a>
            )}
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => handleEdit(project)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleViewFeedback(project)}
                className="text-green-600 hover:text-green-800 text-sm"
              >
                View Feedback
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center text-gray-500 py-8">No projects yet.</div>
      )}
    </div>
  )
}
