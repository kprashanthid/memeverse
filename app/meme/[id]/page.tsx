"use client";

import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { toggleLike, addFetchedMeme } from "@/store/slices/memeSlice";
import CommentSection from "@/components/CommentSection";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
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
    <div
      className={clsx(
        darkMode
          ? "min-h-screen flex sm:flex-row flex-col  items-center justify-center py-6 sm:px-20 px-10"
          : "min-h-screen flex sm:flex-row flex-col  items-center justify-center py-6 sm:px-20 px-10 bg-gradient-to-r from-[#4158D0] via-[#C850C0] to-[#FFCC70] bg-[length:200%_200%] animate-gradient"
      )}
    >
      {darkMode && (
        <AnimatedBackground animationName="starryNight" blendMode="Overlay" />
      )}
      <div className="hidden sm:block sm:min-w-80 h-screen">
        <Sidebar />
      </div>

      <div className="block sm:hidden w-full">
        <Navbar />
      </div>

      {/* Meme Card */}
      <div className="relative bg-white shadow-lg rounded-xl w-full max-w-md lg:max-w-lg lg:w-2/3">
        <div className="flex items-center p-4 border-b border-gray-300 dark:border-gray-700">
          <Image
            src={profile?.avatar || zoro}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover aspect-square"
          />
          <div className="ml-3">
            <p className="font-semibold text-gray-800 dark:text-white">
              Meme Creator
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Meme Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Image
            src={meme?.url || zoro}
            alt={meme?.name || "Meme Image"}
            width={500}
            height={500}
            className="w-full rounded-md"
          />
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center p-4 relative">
          <button
            onClick={() => dispatch(toggleLike(meme))}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-red-500 transition"
          >
            <Heart
              size={24}
              className={isLiked ? "fill-red-500 text-red-500" : ""}
            />
            <span>{isLiked ? "Liked" : "Like"}</span>
          </button>

          <button className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-500 transition">
            <MessageCircle size={24} />
            <span>Comment</span>
          </button>

          {/* Share Button & Menu */}
          <div className="relative">
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="text-gray-500 dark:text-white hover:text-gray-800 transition"
            >
              <Share2 size={24} />
            </button>

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
          </div>
        </div>

        <p className="px-4 pb-4 text-gray-800 dark:text-white font-semibold">
          {meme?.name}
        </p>
      </div>

      {/* Comment Section */}
      <div className="lg:w-1/3 w-full lg:mt-0 lg:ml-6">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-4 lg:h-[80vh] overflow-y-auto">
          <CommentSection memeId={String(meme?.id || "")} />
        </div>
      </div>
    </div>
  );
}
