"use client";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toggleLike } from "@/store/slices/memeSlice";
import { RootState } from "@/store";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  MessageCircle,
  Share2,
  Twitter,
  Facebook,
  Clipboard,
} from "lucide-react";
import { useState } from "react";

type Meme = {
  id: string;
  name: string;
  url: string;
};

export default function MemeCard({ meme }: { meme: Meme }) {
  const dispatch = useDispatch();
  const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);
  const isLiked = likedMemes.some((m) => m.id === meme.id);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    meme.url
  )}&text=Check%20out%20this%20meme!`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    meme.url
  )}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(meme.url);
    alert("Link copied!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-black dark:border-white dark:border-2 rounded-lg shadow-md w-full max-w-md mx-auto"
    >
      <div className="p-3 flex items-center justify-between">
        <p className="font-semibold">{meme.name}</p>
      </div>
      <Link href={`/meme/${meme.id}`}>
        <div className="px-1 rounded-md">
          <Image
            src={meme.url}
            alt={meme.name}
            width={500}
            height={500}
            className="w-full h-52 cursor-pointer sm:h-[300px] rounded-md"
          />
        </div>
      </Link>
      <div className="p-3 flex items-center gap-4 relative">
        <button onClick={() => dispatch(toggleLike(meme))}>
          <Heart
            size={24}
            className={
              isLiked
                ? "text-red-500 fill-red-500"
                : "text-gray-500 hover:text-gray-800"
            }
          />
        </button>
        <MessageCircle
          size={24}
          className="text-gray-500 hover:text-gray-800 dark:text-white"
        />
        <button onClick={() => setShowShareOptions(!showShareOptions)}>
          <Share2
            size={24}
            className="text-gray-500 dark:text-white hover:text-gray-800"
          />
        </button>
        {showShareOptions && (
          <div className="absolute top-10 left-20 bg-white dark:bg-gray-900 shadow-md rounded-md p-2 flex gap-2">
            <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer">
              <Twitter
                size={20}
                className="text-blue-500 hover:text-blue-600"
              />
            </a>
            <a
              href={facebookShareUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook
                size={20}
                className="text-blue-700 hover:text-blue-800"
              />
            </a>
            <button onClick={copyToClipboard}>
              <Clipboard
                size={20}
                className="text-gray-500 hover:text-gray-700"
              />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
