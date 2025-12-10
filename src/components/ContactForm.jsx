import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, User, MessageSquare } from 'lucide-react'
import { supabase } from '../supabase/supabaseClient'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(false)

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

      setToast(true)
      setFormData({ name: '', email: '', message: '' })

      setTimeout(() => setToast(false), 4000)
    } catch (error) {
      alert("Failed to send message")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-slate-100 to-white">

      {/* Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 w-[550px] h-[550px] bg-indigo-400 opacity-10 blur-[120px] rounded-full"></div>
      </div>

      {/* Main Title */}
      <div className="text-center mb-14">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-slate-800 tracking-tight"
        >
          Get in Touch ✨
        </motion.h2>
        <p className="text-slate-500 mt-3 text-lg">I'd love to hear from you!</p>
      </div>

      <div className="max-w-3xl mx-auto px-6">

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="
            backdrop-blur-xl bg-white/30 border border-white/40 
            p-10 rounded-3xl shadow-2xl space-y-8
          "
        >

          {/* Input + Icon Wrapper */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="
                w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 
                shadow-inner border border-slate-300 
                focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition outline-none
              "
              placeholder="Your Name"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="
                w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 
                border border-slate-300 shadow-inner 
                focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition outline-none
              "
              placeholder="Your Email"
            />
          </div>

          {/* Message */}
          <div className="relative">
            <MessageSquare className="absolute left-4 top-6 text-slate-500 w-5 h-5" />
            <textarea
              rows="6"
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="
                w-full pl-12 pr-4 py-4 rounded-xl bg-white/60 
                border border-slate-300 shadow-inner resize-none
                focus:border-blue-500 focus:ring-4 focus:ring-blue-200 transition outline-none
              "
              placeholder="Your Message"
            ></textarea>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={submitting}
            className="
              w-full py-4 text-lg font-semibold text-white rounded-xl 
              bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg
              hover:shadow-blue-500/40 transition disabled:opacity-50
            "
          >
            {submitting ? "Sending..." : "Send Message"}
          </motion.button>
        </motion.form>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="
                fixed bottom-6 right-6 bg-white shadow-2xl 
                p-4 rounded-xl border border-slate-200 backdrop-blur-md 
                flex items-center gap-3 z-50
              "
            >
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <p className="text-slate-700 font-medium">Message sent successfully!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
