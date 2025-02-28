"use client";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "@/store/slices/memeSlice";
import { RootState } from "@/store";
import Link from "next/link";
import Image from "next/image";
import { FaXTwitter, FaFacebookF } from "react-icons/fa6";

type Meme = {
  id: string;
  name: string;
  url: string;
};

export default function MemeCard({ meme }: { meme: Meme }) {
  const dispatch = useDispatch();
  const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);
  const isLiked = likedMemes.some((m) => m.id === meme.id);

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    meme.url
  )}&text=Check%20out%20this%20meme!`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    meme.url
  )}`;

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
          width={300}
          height={300}
          className="w-full h-80 rounded-md cursor-pointer"
        />
      </Link>
      <p className="text-center mt-2 font-semibold">{meme.name}</p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => dispatch(toggleLike(meme))}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
            isLiked
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-300 dark:bg-gray-600 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-700"
          }`}
        >
          {isLiked ? "❤️ Liked" : "🤍 Like"}
        </button>
        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-500 text-white text-center px-4 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center"
        >
          <FaXTwitter size={20} />
        </a>
        <a
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-blue-700 text-white text-center px-4 py-2 rounded-md hover:bg-blue-800 flex items-center justify-center"
        >
          <FaFacebookF size={20} />
        </a>
      </div>
    </motion.div>
  );
}
