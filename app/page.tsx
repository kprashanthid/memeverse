"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, useAnimation } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "@/store/themeSlice";
import { RootState } from "@/store";
import MemeCard from "../components/MemeCard";
import { setFetchedMemes } from "@/store/slices/memeSlice";
import debounce from "lodash.debounce";
import Navbar from "@/components/Navbar";

export type Meme = {
  id: string;
  name: string;
  url: string;
  likes?: number;
  date?: string;
  comments?: number;
};

export default function HomePage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState<"likes" | "date" | "comments">("likes");

  const controls = useAnimation();
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const uploadedMemes = useSelector(
    (state: RootState) => state.memes.uploadedMemes
  );

  useEffect(() => {
    fetchMemes();
  }, [page]);

  const fetchMemes = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("https://api.imgflip.com/get_memes");
      const data = await res.json();
      const newMemes = data.data.memes.slice(page * 10 - 10, page * 10);

      if (newMemes.length > 0) {
        const uniqueMemes = [...memes, ...newMemes].reduce((acc, meme) => {
          if (!acc.some((item: { id: string }) => item.id === meme.id)) {
            acc.push(meme);
          }
          return acc;
        }, [] as Meme[]);

        setMemes(uniqueMemes);
        dispatch(setFetchedMemes(uniqueMemes));
      }
    } catch (error) {
      console.error("Failed to fetch memes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !loading
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query.toLowerCase());
    }, 300),
    []
  );

  const sortedMemes = [...memes].sort((a, b) => {
    if (sortBy === "likes") return (b.likes || 0) - (a.likes || 0);
    if (sortBy === "date") return (b.date || "").localeCompare(a.date || "");
    if (sortBy === "comments") return (b.comments || 0) - (a.comments || 0);
    return 0;
  });

  const filteredMemes = sortedMemes.filter((meme) =>
    meme.name.toLowerCase().includes(searchQuery)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center relative"
    >
      <Navbar
        onSearch={handleSearch}
        onSortChange={() => {
          dispatch(toggleDarkMode());
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          background: darkMode
            ? "linear-gradient(to bottom, #111827, #1f2937, #374151)"
            : "linear-gradient(to bottom, #ffffff, #f3f4f6, #e5e7eb)",
        }}
        transition={{ duration: 1 }}
        className="absolute inset-0 w-full h-full transition-colors -z-10"
      />
      <button
        onClick={() => {
          dispatch(toggleDarkMode());
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className="fixed top-4 right-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-md shadow-md z-10 hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <h1
        className={`text-3xl font-bold mt-14 relative z-10 sm:mt-20 ${
          darkMode && "text-white"
        }`}
      >
        🔥 Trending Memes
      </h1>
      <motion.div
        animate={controls}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:p-10 p-5 relative z-10"
      >
        {uploadedMemes.length > 0 &&
          uploadedMemes.map((meme) => <MemeCard key={meme.id} meme={meme} />)}
        {filteredMemes.map((meme) => (
          <MemeCard key={meme.id} meme={meme} />
        ))}
      </motion.div>

      {loading && <p className="mt-4 relative z-10">Loading more memes...</p>}
    </motion.div>
  );
}
