import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabase/supabaseClient'

export default function Resume() {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResume()
  }, [])

  const fetchResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resume')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      setResume(data)
    } catch (error) {
      console.error('Error fetching resume:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (resume?.file_url) {
      window.open(resume.file_url, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 flex items-center justify-center">
        <div className="text-slate-600 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white rounded-xl shadow-2xl p-8 border border-slate-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl lg:text-5xl font-bold text-center mb-8 text-slate-800"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Resume
          </motion.h1>

          {resume?.file_url ? (
            <motion.div
              className="text-center space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 bg-gradient-to-br from-slate-50 to-blue-50">
                <p className="text-slate-600 mb-4 text-lg">
                  Click below to view or download the resume
                </p>
                <div className="flex justify-center space-x-4">
                  <motion.button
                    onClick={handleDownload}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/50 font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View/Download Resume
                  </motion.button>
                  <motion.a
                    href={resume.file_url}
                    download
                    className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-900 transition-colors font-medium inline-block"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Direct Download
                  </motion.a>
                </div>
              </div>
              <iframe
                src={resume.file_url}
                className="w-full h-screen border-2 border-slate-200 rounded-lg shadow-lg"
                title="Resume Preview"
              />
            </motion.div>
          ) : (
            <motion.div
              className="text-center text-slate-500 py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Resume not available yet.
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
