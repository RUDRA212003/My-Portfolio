import { useEffect, useState } from 'react'
import { supabase } from '../../supabase/supabaseClient'

export default function ContactManager() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
    markAllAsRead()
  }, [])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) setMessages(data || [])
    setLoading(false)
  }

  // ✅ Mark all unread messages as read
  const markAllAsRead = async () => {
    await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('is_read', false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (!error) fetchMessages()
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Contact Messages</h2>

      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet.</p>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded border ${
              msg.is_read ? 'bg-gray-50' : 'bg-blue-50'
            }`}
          >
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{msg.name}</p>
                <p className="text-sm text-gray-600">{msg.email}</p>
              </div>
              <button
                onClick={() => handleDelete(msg.id)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>

            <p className="mt-2 whitespace-pre-wrap">{msg.message}</p>
          </div>
        ))
      )}
    </div>
  )
}
