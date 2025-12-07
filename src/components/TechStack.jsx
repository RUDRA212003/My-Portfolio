import { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";

export default function TechStack() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("techstack").select("*");
      setItems(data || []);
    }
    load();
  }, []);

  return (
    <div className="w-full py-16 bg-white">
      <h2 className="text-center text-3xl font-bold text-gray-800 mb-10">
        Known Technologies
      </h2>

      {/* CENTERED FLEX ROW */}
      <div className="w-full flex justify-center">
        <div className="flex gap-16 flex-wrap justify-center">

          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center group transition-all duration-300"
            >
              {/* logo */}
              <img
                src={item.logo_url}
                alt={item.name}
                className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-125"
              />

              {/* only visible on hover */}
              <p className="mt-2 text-sm font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.name}
              </p>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
