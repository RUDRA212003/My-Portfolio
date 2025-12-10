import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";

export default function CardsGrid() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Share function
  const handleShare = async (card) => {
    const shareId = card.uuid_id || card.id;
    const url = `${window.location.origin}/card/${shareId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: "Check out this item!",
          url,
        });
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Explore
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card) => {
            const routeId = card.uuid_id || card.id; // UUID preferred

            return (
              <div
                key={routeId}
                className="relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* MAIN CLICK AREA */}
                <Link to={`/card/${routeId}`}>
                  {card.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={card.image_url}
                        alt={card.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500 uppercase">
                      {card.type}
                    </p>
                  </div>
                </Link>

                {/* SHARE BUTTON */}
                <button
                  onClick={() => handleShare(card)}
                  className="absolute top-2 right-2 bg-white/90 px-3 py-1 
                  rounded-full text-xs shadow hover:bg-blue-600 hover:text-white 
                  transition-all duration-200"
                >
                  Share
                </button>
              </div>
            );
          })}
        </div>

        {cards.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No cards available yet.
          </div>
        )}
      </div>
    </section>
  );
}
