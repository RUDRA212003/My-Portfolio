import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabase/supabaseClient'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/rudresh-manjunath21/',
      icon: 'https://cdn-icons-png.flaticon.com/512/174/174857.png',
    },
    {
      name: 'X',
      href: 'https://x.com/yo_rudra',
      icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968958.png',
    },
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/yoyorudra_offical/?hl=en',
      icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png',
    },
    {
      name: 'YouTube',
      href: 'https://www.youtube.com/@yoyorudraandroidtech',
      icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
    },
    {
      name: 'Email',
      href: 'mailto:rudreshmanjunath15@gmail.com',
      icon: 'https://cdn-icons-png.flaticon.com/512/732/732200.png',
    },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      })

      if (error) throw error

      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error('Error submitting contact form:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-100 to-white overflow-hidden">

      {/* Floating Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-purple-400 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-400 rounded-full opacity-10 blur-3xl"></div>
      </div>

      {/* Title */}
      <div className="text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-5xl font-extrabold text-slate-800 drop-shadow-sm"
        >
          Get in Touch
        </motion.h2>
        <p className="text-slate-500 mt-3 text-lg">
          Feel free to contact me anytime ✨
        </p>
      </div>

      {/* Wrapper */}
      <div className="max-w-3xl mx-auto px-6">

        {/* Success Message */}
        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-10 text-center border border-slate-200 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.6 }}
              className="text-5xl text-green-500 mb-4"
            >
              ✓
            </motion.div>

            <h3 className="text-xl font-semibold text-green-600 mb-3">
              Message Sent!
            </h3>
            <p className="text-slate-600">
              Thank you! I'll get back to you soon.
            </p>

            {/* Heading for Social */}
            <p className="text-slate-700 font-medium text-lg mt-8 mb-3">
              Find me on my other social platforms:
            </p>

            {/* Social Icons */}
            <div className="flex justify-center gap-5">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                  title={s.name}
                >
                  <img src={s.icon} className="w-10 h-10 drop-shadow-md" />
                </a>
              ))}
            </div>
          </motion.div>
        ) : (

          /* Form */
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200 p-10 space-y-8"
          >

            {/* Name */}
            <div className="relative">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none peer"
              />
              <label className="absolute left-4 top-2 text-slate-500 text-sm transition-all peer-focus:text-blue-500 peer-focus:-translate-y-4 peer-focus:scale-90">
                Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none peer"
              />
              <label className="absolute left-4 top-2 text-slate-500 text-sm transition-all peer-focus:text-blue-500 peer-focus:-translate-y-4 peer-focus:scale-90">
                Email
              </label>
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                rows="6"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-4 border-2 border-slate-300 rounded-xl bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-200 outline-none peer resize-none"
              />
              <label className="absolute left-4 top-2 text-slate-500 text-sm transition-all peer-focus:text-blue-500 peer-focus:-translate-y-4 peer-focus:scale-90">
                Message
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Send Message"}
            </motion.button>

            {/* Social Heading */}
            <p className="text-slate-600 text-center font-medium">
              Connect with me on:
            </p>

            {/* Social Icons Row */}
            <div className="flex justify-center gap-6">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:scale-110 transition-transform"
                >
                  <img src={s.icon} className="w-9 h-9 drop-shadow" />
                </a>
              ))}
            </div>
          </motion.form>
        )}
      </div>
    </section>
  )
}
