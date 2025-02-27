"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const memes = [
  {
    url: "/404-meme1.jpg",
    caption: "When you realize this page doesn't exist... 😭",
  },
  { url: "/404-meme2.jpg", caption: "404? More like 4-oh-no! 😂" },
  {
    url: "/404-meme3.jpg",
    caption: "This page is as lost as me in math class. 🤯",
  },
];

export default function NotFoundPage() {
  const router = useRouter();
  const [randomMeme, setRandomMeme] = useState(memes[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * memes.length);
    setRandomMeme(memes[randomIndex]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold"
      >
        404 - Page Not Found
      </motion.h1>

      <motion.img
        src={randomMeme.url}
        alt="404 Meme"
        className="w-80 mt-6 rounded-lg shadow-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      />

      <p className="text-lg mt-4">{randomMeme.caption}</p>

      <motion.button
        onClick={() => router.push("/")}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg rounded-md shadow-md"
      >
        Go Back Home 🏠
      </motion.button>
    </div>
  );
}
