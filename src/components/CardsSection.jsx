import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function CardsSection() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCards(data || [])
    } catch (error) {
      console.error('Error fetching cards:', error)
    } finally {
      setLoading(false)
    }
  }

  // 📌 SHARE FUNCTION (optional but useful)
  const handleShare = async (card) => {
    const shareId = card.uuid_id || card.id
    const url = `${window.location.origin}/card/${shareId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: "Check out this card:",
          url,
        })
      } catch (err) {
        console.log("Share canceled", err)
      }
    } else {
      await navigator.clipboard.writeText(url)
      alert("Link copied to clipboard!")
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-600">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-5xl lg:text-6xl font-bold text-center mb-16 text-slate-800"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Explore
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {cards.map((card) => {
            const routeId = card.uuid_id || card.id

            return (
              <motion.div
                key={routeId}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  y: -5,
                  transition: { duration: 0.3 },
                }}
                className="group"
              >
                <div className="relative">
                  {/* MAIN CARD */}
                  <Link
                    to={`/card/${routeId}`}
                    className="block bg-white rounded-xl shadow-lg overflow-hidden 
                    hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-300 
                    border border-slate-200 hover:border-blue-300"
                  >
                    {card.image_url && (
                      <div className="h-48 overflow-hidden relative">
                        <motion.img
                          src={card.image_url}
                          alt={card.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-sm text-blue-600 uppercase font-semibold">
                        {card.type}
                      </p>
                    </div>
                  </Link>

                  {/* SHARE BUTTON */}
                  <button
                    onClick={() => handleShare(card)}
                    className="absolute top-2 right-2 bg-white/90 backdrop-blur px-3 py-1 
                    text-xs rounded-full shadow hover:bg-blue-600 hover:text-white 
                    transition-all duration-200"
                  >
                    Share
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {cards.length === 0 && (
          <motion.div
            className="text-center text-slate-500 py-12 bg-white/50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No cards available yet.
          </motion.div>
        )}
      </div>
    </section>
  )
}
