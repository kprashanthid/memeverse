"use client";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "@/store/slices/memeSlice";
import { RootState } from "@/store";
import Link from "next/link";
import Image from "next/image";

type Meme = {
  id: string;
  name: string;
  url: string;
};

export default function MemeCard({ meme }: { meme: Meme }) {
  const dispatch = useDispatch();
  const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);
  const isLiked = likedMemes.some((m) => m.id === meme.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-md transition-all hover:scale-105"
    >
      <Link href={`/meme/${meme.id}`}>
        <Image
          src={meme.url}
          alt={meme.name}
          className="w-full h-80 rounded-md cursor-pointer"
        />
      </Link>
      <p className="text-center mt-2 font-semibold">{meme.name}</p>
      <button
        onClick={() => dispatch(toggleLike(meme))}
        className={`w-full mt-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
          isLiked
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-300 dark:bg-gray-600 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700"
        }`}
      >
        {isLiked ? "❤️ Liked" : "🤍 Like"}
      </button>
    </motion.div>
  );
}
