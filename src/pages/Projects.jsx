import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../supabase/supabaseClient";

/* --------------------------------------------
   Animations
-------------------------------------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* --------------------------------------------
   Skeletons
-------------------------------------------- */
function HeaderSkeleton() {
  return (
    <div className="animate-pulse mb-16">
      <div className="h-10 bg-slate-300 w-72 mx-auto rounded-lg"></div>
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="bg-white/70 rounded-xl shadow-md border border-slate-200 p-6 animate-pulse backdrop-blur"
        >
          <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------------------
   MAIN COMPONENT
-------------------------------------------- */
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Parallax Grid Layers
  const gridLayer1 = useRef(null);
  const gridLayer2 = useRef(null);
  const pointer = useRef({ x: 0.5, y: 0.5 });
  const scroll = useRef(0);

  /* --------------------------------------------
     Fetch Projects + Delay
  -------------------------------------------- */
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);

    try {
      const req = supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      const delay = new Promise((res) => setTimeout(res, 800));

      const [{ data, error }] = await Promise.all([req, delay]);

      if (error) throw error;

      setProjects(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------
     3D Parallax Grid Animation
  -------------------------------------------- */
  useEffect(() => {
    function onPointerMove(e) {
      pointer.current.x = e.clientX / window.innerWidth;
      pointer.current.y = e.clientY / window.innerHeight;
    }

    function onScroll() {
      scroll.current = window.scrollY;
    }

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("scroll", onScroll);

    function animate() {
      const x = (pointer.current.x - 0.5) * 2;

      if (gridLayer1.current) {
        gridLayer1.current.style.transform = `translate3d(${x * 12}px, ${
          scroll.current * 0.03
        }px, 0)`;
      }

      if (gridLayer2.current) {
        gridLayer2.current.style.transform = `translate3d(${x * 6}px, ${
          scroll.current * 0.015
        }px, 0)`;
      }

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* --------------------------------------------
     Submit Feedback
  -------------------------------------------- */
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);

    try {
      const { error } = await supabase.from("project_feedback").insert({
        project_id: selectedProject.id,
        ...feedbackForm,
      });
      if (error) throw error;

      alert("Feedback submitted!");
      setShowFeedbackForm(false);
      setFeedbackForm({ name: "", email: "", message: "" });
    } catch (err) {
      alert("Error submitting feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  /* --------------------------------------------
     LOADING VIEW
  -------------------------------------------- */
  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-50 py-20 overflow-hidden">

        <div ref={gridLayer1} className="grid-layer-1"></div>
        <div ref={gridLayer2} className="grid-layer-2"></div>

        <div className="max-w-7xl mx-auto px-4">
          <HeaderSkeleton />
          <ProjectCardSkeleton />
        </div>

        <style>{GRID_CSS}</style>
      </div>
    );
  }

  /* --------------------------------------------
     MAIN PAGE
  -------------------------------------------- */
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-white to-blue-50 py-20 overflow-hidden">

      {/* 3D Grid Layers */}
      <div ref={gridLayer1} className="grid-layer-1"></div>
      <div ref={gridLayer2} className="grid-layer-2"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        <motion.h1
          className="text-5xl lg:text-6xl font-bold text-center mb-16 text-slate-800"
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
        >
          My Projects
        </motion.h1>

        {/* Projects Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group"
            >
              <div
                onClick={() => {
                  setSelectedProject(project);
                  setShowFeedbackForm(false);
                }}
                className="bg-white/90 shadow-xl rounded-xl border border-slate-200 hover:border-blue-500 transition cursor-pointer overflow-hidden"
              >
                {project.image_url && (
                  <div className="h-48 overflow-hidden">
                    <motion.img
                      src={project.image_url}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.07 }}
                    />
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">
                    {project.title}
                  </h3>

                  <p className="text-slate-600 mt-2 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex gap-3 mt-4">
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-900"
                      >
                        GitHub
                      </a>
                    )}

                    {project.demo_link && (
                      <a
                        href={project.demo_link}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal */}
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur flex justify-center items-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-3xl font-bold">{selectedProject.title}</h2>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-2xl text-slate-600 hover:text-black"
                >
                  ×
                </button>
              </div>

              {selectedProject.image_url && (
                <img
                  src={selectedProject.image_url}
                  className="w-full h-64 object-cover rounded mb-6"
                />
              )}

              <p className="text-slate-700 whitespace-pre-line mb-6">
                {selectedProject.description}
              </p>

              <div className="flex gap-4 mb-6">
                {selectedProject.github_link && (
                  <a
                    href={selectedProject.github_link}
                    target="_blank"
                    className="bg-slate-800 text-white px-6 py-3 rounded"
                  >
                    GitHub
                  </a>
                )}

                {selectedProject.demo_link && (
                  <a
                    href={selectedProject.demo_link}
                    target="_blank"
                    className="bg-blue-600 text-white px-6 py-3 rounded"
                  >
                    Live Demo
                  </a>
                )}
              </div>

              <button
                onClick={() => setShowFeedbackForm(true)}
                className="bg-emerald-600 text-white px-6 py-3 rounded"
              >
                Leave Feedback
              </button>

              {showFeedbackForm && (
                <form
                  onSubmit={handleFeedbackSubmit}
                  className="mt-6 space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    className="w-full border px-4 py-2 rounded"
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        name: e.target.value,
                      })
                    }
                  />

                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    className="w-full border px-4 py-2 rounded"
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        email: e.target.value,
                      })
                    }
                  />

                  <textarea
                    placeholder="Your Message"
                    required
                    rows={4}
                    className="w-full border px-4 py-2 rounded"
                    onChange={(e) =>
                      setFeedbackForm({
                        ...feedbackForm,
                        message: e.target.value,
                      })
                    }
                  ></textarea>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3 rounded"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>

      <style>{GRID_CSS}</style>
    </div>
  );
}

/* --------------------------------------------
   ⭐ GRID CSS (Subtle 3D Tech Grid)
-------------------------------------------- */
const GRID_CSS = `
.grid-layer-1,
.grid-layer-2 {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: -1 !important;
  will-change: transform;
}

/* Nearer grid */
.grid-layer-1 {
  background-image:
    linear-gradient(rgba(59,130,246,0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.12) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.45;
}

/* Further grid */
.grid-layer-2 {
  background-image:
    linear-gradient(rgba(99,102,241,0.10) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99,102,241,0.10) 1px, transparent 1px);
  background-size: 38px 38px;
  opacity: 0.28;
}

.grid-layer-1::before,
.grid-layer-2::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 20%, rgba(255,255,255,0.05), transparent 60%);
}
`;
