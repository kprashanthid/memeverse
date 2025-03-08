"use client";

import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { toggleLike, addFetchedMeme } from "@/store/slices/memeSlice";
import CommentSection from "@/components/CommentSection";
import Navbar from "@/components/Navbar";
import { LayoutGroup, motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import {
  Facebook,
  Heart,
  MessageCircle,
  Share2,
  Twitter,
  Clipboard,
} from "lucide-react";
import zoro from "../../profile/zoro.jpg";
import { AnimatedBackground } from "animated-backgrounds";
import Sidebar from "@/components/SideBar";
import clsx from "clsx";

type Profile = {
  avatar: string | StaticImageData;
};

export default function MemeDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const memes = useSelector((state: RootState) => [
    ...state.memes.fetchedMemes,
    ...state.memes.uploadedMemes,
    ...state.memes.likedMemes,
  ]);

  const [profile, setProfile] = useState<Profile>({ avatar: zoro });
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);
  const meme = memes.find((m) => String(m.id) === id) || null;
  const isLiked = meme ? likedMemes.some((m) => m.id === meme.id) : false;

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  useEffect(() => {
    if (!meme) {
      fetch(`https://api.imgflip.com/get_memes`)
        .then((res) => res.json())
        .then((data) => {
          const foundMeme = data.data.memes.find(
            (m: { id: string }) => String(m.id) === id
          );
          if (foundMeme) {
            dispatch(addFetchedMeme(foundMeme));
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, meme, dispatch]);

  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    meme?.url || ""
  )}&text=Check%20out%20this%20meme!`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    meme?.url || ""
  )}`;

  const copyToClipboard = () => {
    if (meme?.url) {
      navigator.clipboard.writeText(meme.url);
      alert("Link copied!");
    }
  };

  if (loading) return <p className="text-center mt-8">🔄 Loading...</p>;
  if (!meme) return <p className="text-center mt-8">⚠️ Meme not found!</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={clsx(
        darkMode
          ? "min-h-screen flex sm:flex-row flex-col w-full items-center justify-center py-6"
          : "min-h-screen flex sm:flex-row flex-col w-full items-center justify-center py-6 bg-gradient-to-r from-[#4158D0] via-[#C850C0] to-[#FFCC70] bg-[length:200%_200%] animate-gradient"
      )}
    >
      {darkMode && (
        <AnimatedBackground animationName="starryNight" blendMode="Overlay" />
      )}

      <motion.div
        className="hidden sm:block sm:min-w-80 h-screen"
        initial={{ x: -50 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <Sidebar />
      </motion.div>

      <div className="block sm:hidden w-full">
        <Navbar />
      </div>
      <LayoutGroup>
        <div className="sm:px-20 px-5 sm:flex sm:flex-row">
          <motion.div
            className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-2xl w-full max-w-md lg:max-w-lg lg:w-2/3 overflow-hidden"
            layout
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <motion.div
              className="flex items-center p-4 border-b border-gray-300 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-full shadow-lg"
              >
                <Image
                  src={profile?.avatar || zoro}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover aspect-square"
                />
              </motion.div>
              <motion.div className="ml-3" layout>
                <p className="font-bold text-gray-800 dark:text-white">
                  Meme Creator
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {new Date().toLocaleDateString()}
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden"
            >
              <Image
                src={meme?.url || zoro}
                alt={meme?.name || "Meme Image"}
                width={500}
                height={500}
                className="w-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
            <motion.div
              className="flex justify-between items-center p-4 bg-white dark:bg-gray-800"
              layout
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(toggleLike(meme))}
                className="flex items-center space-x-2 group"
              >
                <motion.div
                  animate={{ scale: isLiked ? 1.2 : 1 }}
                  transition={{ type: "spring" }}
                >
                  <Heart
                    size={24}
                    className={clsx(
                      "transition-colors",
                      isLiked
                        ? "fill-red-500 text-red-500"
                        : "text-gray-700 dark:text-gray-300 group-hover:text-red-400"
                    )}
                  />
                </motion.div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {isLiked ? "Liked" : "Like"}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 group"
              >
                <MessageCircle
                  size={24}
                  className="text-gray-700 dark:text-gray-300 group-hover:text-blue-500"
                />
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Comment
                </span>
              </motion.button>
              <motion.div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Share2
                    size={20}
                    className="text-gray-700 dark:text-gray-300"
                  />

                  {showShareOptions && (
                    <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-gray-900 shadow-md rounded-md p-2 flex gap-3 z-10 max-w-[150px]">
                      <a
                        href={twitterShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on Twitter"
                      >
                        <Twitter
                          size={20}
                          className="text-blue-500 hover:text-blue-600"
                        />
                      </a>
                      <a
                        href={facebookShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Share on Facebook"
                      >
                        <Facebook
                          size={20}
                          className="text-blue-700 hover:text-blue-800"
                        />
                      </a>
                      <button onClick={copyToClipboard} aria-label="Copy link">
                        <Clipboard
                          size={20}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                        />
                      </button>
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Meme Title */}
            <motion.p
              className="px-4 pb-4 text-gray-800 dark:text-white font-bold text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {meme?.name}
            </motion.p>
          </motion.div>

          {/* Comment Section */}
          <motion.div
            className="lg:w-1/3 w-full lg:mt-0 lg:ml-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-4 lg:h-[80vh] overflow-y-auto  sm:mt-0 mt-10"
              whileHover={{ scale: 1.02 }}
            >
              <CommentSection memeId={String(meme?.id || "")} />
            </motion.div>
          </motion.div>
        </div>
      </LayoutGroup>
    </motion.div>
  );
}
