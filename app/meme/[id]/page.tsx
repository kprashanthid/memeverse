"use client";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import { toggleLike, addFetchedMeme } from "@/store/slices/memeSlice";
import CommentSection from "@/components/CommentSection";
import ShareButtons from "@/components/ShareButtons";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Image from "next/image";
import zoro from "../../profile/zoro.jpg";

type Profile = {
  avatar: string;
};

export default function MemeDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const memes = useSelector((state: RootState) => [
    ...state.memes.fetchedMemes,
    ...state.memes.uploadedMemes,
    ...state.memes.likedMemes,
  ]);

  const [profile, setProfile] = useState<Profile>({
    avatar: "/profile/zoro.jpg",
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const [loading, setLoading] = useState(true);
  const meme = memes.find((m) => String(m.id) === id);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

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

  if (loading) return <p className="text-center mt-8">🔄 Loading...</p>;
  if (!meme) return <p className="text-center mt-8">⚠️ Meme not found!</p>;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{
        background: darkMode
          ? "linear-gradient(to bottom, #111827, #1f2937, #374151)"
          : "linear-gradient(to bottom, #ffffff, #f3f4f6, #e5e7eb)",
      }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col lg:flex-row items-center lg:items-start justify-center bg-gray-100 dark:bg-black py-6  sm:px-20 px-10"
    >
      <Navbar onSearch={() => {}} onSortChange={() => {}} />

      <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg w-full max-w-md lg:max-w-lg lg:w-2/3 sm:mt-32 mt-12">
        <div className="flex items-center p-4 border-b border-gray-300 dark:border-gray-700">
          <Image
            src={profile?.avatar || zoro}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Image
            src={meme.url}
            alt={meme.name}
            width={500}
            height={500}
            className="w-full rounded-md"
          />
        </motion.div>
        <div className="flex justify-between p-4">
          <button
            onClick={() => dispatch(toggleLike(meme))}
            className="text-2xl"
          >
            {meme.liked ? "❤️" : "🤍"}
          </button>
          <ShareButtons memeUrl={meme.url} />
        </div>
        <p className="px-4 text-gray-800 dark:text-white font-semibold">
          {meme.name}
        </p>
      </div>

      <div className="lg:w-1/3 w-full lg:mt-0 lg:ml-6 ">
        <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 lg:h-[80vh] overflow-y-auto sm:mt-32 mt-12">
          <CommentSection memeId={String(meme.id)} />
        </div>
      </div>
    </motion.div>
  );
}
