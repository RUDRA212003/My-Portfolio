import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

export default function ItemDetail() {
  const { cardId, itemId } = useParams();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const isUUID = /^[0-9a-fA-F-]{36}$/.test(itemId);

  useEffect(() => {
    fetchItem();
  }, [itemId]);

  const fetchItem = async () => {
    try {
      const query = isUUID
        ? supabase.from("card_items").select("*").eq("uuid_id", itemId).single()
        : supabase.from("card_items").select("*").eq("id", itemId).single();

      const { data, error } = await query;
      if (error) throw error;

      setItem(data);
    } catch (err) {
      console.error("Error loading item:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-xl">Loading item...</div>;

  if (!item)
    return (
      <div className="text-center mt-20 text-slate-500">Item not found.</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* TOP BUTTON */}
        <div className="mb-8">
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            ← View Full Portfolio
          </Link>
        </div>

        {/* CONTENT WRAPPER */}
        <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col md:flex-row gap-10 border border-slate-200">

          {/* LEFT: IMAGE */}
          <div className="md:w-1/2 w-full flex justify-center items-center">
            <img
              src={item.image_url}
              alt={item.title}
              className="rounded-xl w-full max-h-[500px] object-contain shadow-md"
            />
          </div>

          {/* RIGHT: DETAILS */}
          <div className="md:w-1/2 w-full flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-slate-800 mb-6">
              {item.title}
            </h1>

            <p className="text-lg text-slate-700 leading-relaxed whitespace-pre-line">
              {item.description}
            </p>

            {/* Optional External Link */}
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                Visit Resource →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
