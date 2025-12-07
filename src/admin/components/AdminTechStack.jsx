import { useEffect, useState } from "react";
import supabase from "../../supabase/supabaseClient"


export default function AdminTechStack() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data } = await supabase.from("techstack").select("*");
    setItems(data || []);
  }

  async function addItem(e) {
    e.preventDefault();

    const { error } = await supabase.from("techstack").insert([
      { name, logo_url: logoUrl },
    ]);

    if (!error) {
      setName("");
      setLogoUrl("");
      fetchItems();
    }
  }

  async function deleteItem(id) {
    await supabase.from("techstack").delete().eq("id", id);
    fetchItems();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Tech Stack</h1>

      {/* Add New */}
      <form onSubmit={addItem} className="mb-6 space-y-3">
        <input
          type="text"
          placeholder="Tech Name (HTML, CSS)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Logo URL"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Tech Stack
        </button>
      </form>

      {/* Display List */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border p-3 rounded"
          >
            <div className="flex items-center gap-4">
              <img src={item.logo_url} className="w-12 h-12 object-contain" />
              <span className="font-semibold">{item.name}</span>
            </div>
            <button
              onClick={() => deleteItem(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
