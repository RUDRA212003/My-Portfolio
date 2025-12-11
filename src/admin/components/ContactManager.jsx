import { useEffect, useState } from 'react'
import { supabase } from '../../supabase/supabaseClient'

export default function ContactManager() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('Message deleted successfully!')
      fetchMessages()
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Failed to delete message')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Contact Messages</h2>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No messages yet.</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{message.name}</p>
                  <p className="text-sm text-gray-600">{message.email}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-gray-500">
                    {new Date(message.created_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => handleDelete(message.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}





