import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function CardDetail() {
  const { id } = useParams()
  const [card, setCard] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCardData()
  }, [id])

  const fetchCardData = async () => {
    try {
      const [cardRes, itemsRes] = await Promise.all([
        supabase.from('cards').select('*').eq('id', id).single(),
        supabase
          .from('card_items')
          .select('*')
          .eq('card_id', id)
          .order('created_at', { ascending: false }),
      ])

      if (cardRes.error) throw cardRes.error
      if (itemsRes.error) throw itemsRes.error

      setCard(cardRes.data)
      setItems(itemsRes.data || [])
    } catch (error) {
      console.error('Error fetching card data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 flex items-center justify-center">
        <div className="text-slate-600 text-xl">Loading...</div>
      </div>
    )
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16 flex items-center justify-center">
        <div className="text-center text-slate-500">Card not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white rounded-xl shadow-2xl p-8 mb-12 border border-slate-200"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {card.image_url && (
            <motion.img
              src={card.image_url}
              alt={card.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          )}
          <motion.h1
            className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {card.title}
          </motion.h1>
          <motion.p
            className="text-lg text-blue-600 uppercase font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {card.type}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-300 border border-slate-200 hover:border-blue-300"
            >
              {item.image_url && (
                <div className="h-48 overflow-hidden relative">
                  <motion.img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 mb-4">{item.description}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                  >
                    View More →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {items.length === 0 && (
          <motion.div
            className="text-center text-slate-500 py-12 bg-white/50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No items available for this card yet.
          </motion.div>
        )}
      </div>
    </div>
  )
}
