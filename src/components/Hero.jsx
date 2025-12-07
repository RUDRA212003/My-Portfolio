import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabase/supabaseClient'

export default function Hero() {
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHero()
  }, [])

  const fetchHero = async () => {
    try {
      const { data, error } = await supabase
        .from('hero')
        .select('*')
        .single()

      if (error) throw error
      setHero(data)
    } catch (error) {
      console.error('Error fetching hero:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
      {/* Animated Background Mesh */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile Image */}
          <motion.div
            className="flex justify-center lg:justify-start"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative"
            >
              {hero?.photo_url ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                  <img
                    src={hero.photo_url}
                    alt="Profile"
                    className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full object-cover border-4 border-white/20 shadow-2xl"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/20 shadow-2xl">
                  <span className="text-6xl">👤</span>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Name and Designation */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="text-6xl lg:text-8xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {hero?.name || 'Your Name'}
            </motion.h1>
            <motion.p
              className="text-2xl lg:text-3xl text-blue-200 font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {hero?.designation || 'Your Designation'}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center text-white/70"
        >
          <span className="text-sm mb-2">Scroll</span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
