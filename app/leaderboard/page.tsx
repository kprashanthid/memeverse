"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import { toggleDarkMode } from "@/store/themeSlice";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

type Meme = {
  id: string;
  name: string;
  url: string;
  likes: number;
};

export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);
  const [leaderboard, setLeaderboard] = useState<Meme[]>([]);

  useEffect(() => {
    const storedLeaderboard = localStorage.getItem("leaderboard");
    if (storedLeaderboard) {
      setLeaderboard(JSON.parse(storedLeaderboard));
    }
  }, []);

  useEffect(() => {
    const updatedLeaderboard: Meme[] = [...leaderboard];

    likedMemes.forEach((meme) => {
      const existingMeme = updatedLeaderboard.find((m) => m.id === meme.id);
      if (existingMeme) {
        existingMeme.likes += 1;
      } else {
        updatedLeaderboard.push({ ...meme, likes: 1 });
      }
    });

    const sortedLeaderboard = updatedLeaderboard
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 10);
    setLeaderboard(sortedLeaderboard);
    localStorage.setItem("leaderboard", JSON.stringify(sortedLeaderboard));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center relative"
    >
      <Navbar onSearch={() => {}} onSortChange={() => {}} />
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
      <h1 className="text-3xl font-bold mt-20">🏆 Leaderboard</h1>
      <p className="text-gray-600 dark:text-gray-400">
        Top 10 Most Liked Memes
      </p>

      {leaderboard.length === 0 ? (
        <p className="mt-4">No likes yet! Start liking memes!</p>
      ) : (
        <div className="mt-6 w-full max-w-lg">
          {leaderboard.map((meme, index) => (
            <div
              key={meme.id}
              className="flex items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-md mb-2"
            >
              <span className="text-xl font-bold w-8">{index + 1}.</span>
              <Image
                src={meme.url}
                alt={meme.name}
                width={60}
                height={60}
                className="rounded-md"
              />
              <p className="flex-1 text-center">{meme.name}</p>
              <span className="text-red-500 font-semibold">
                ❤️ {meme.likes}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
