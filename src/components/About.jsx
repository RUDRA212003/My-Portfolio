import { useEffect, useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { supabase } from '../supabase/supabaseClient'

export default function About() {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [heroImage, setHeroImage] = useState(null)
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const imageOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 1, 0.8])

  useEffect(() => {
    fetchAbout()
    fetchHeroImage()
  }, [])

  const fetchAbout = async () => {
    try {
      const { data, error } = await supabase
        .from('about')
        .select('*')
        .single()

      if (error) throw error
      setAbout(data)
    } catch (error) {
      console.error('Error fetching about:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHeroImage = async () => {
    try {
      const { data } = await supabase.from('hero').select('photo_url').single()
      if (data?.photo_url) {
        setHeroImage(data.photo_url)
      }
    } catch (error) {
      console.error('Error fetching hero image:', error)
    }
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 py-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Sticky Profile Image */}
          <motion.div
            className="sticky top-20 hidden lg:block"
            style={{ y: imageY, opacity: imageOpacity }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              {heroImage ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-2xl opacity-20"></div>
                  <img
                    src={heroImage}
                    alt="Profile"
                    className="relative w-64 h-64 rounded-full object-cover border-4 border-blue-200 shadow-2xl mx-auto"
                  />
                </div>
              ) : (
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-200 to-cyan-200 flex items-center justify-center border-4 border-blue-200 shadow-2xl mx-auto">
                  <span className="text-6xl">👤</span>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* About Content */}
          <motion.div
            className="lg:pl-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-5xl font-bold mb-8 text-slate-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              About Me
            </motion.h2>

            {about?.content ? (
              <motion.div
                className="prose prose-lg max-w-none text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: about.content }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            ) : (
              <motion.p
                className="text-slate-600 text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                No content available yet.
              </motion.p>
            )}
          </motion.div>

          {/* Mobile Profile Image */}
          <motion.div
            className="lg:hidden flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {heroImage ? (
              <img
                src={heroImage}
                alt="Profile"
                className="w-48 h-48 rounded-full object-cover border-4 border-blue-200 shadow-xl"
              />
            ) : (
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-200 to-cyan-200 flex items-center justify-center border-4 border-blue-200 shadow-xl">
                <span className="text-5xl">👤</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
