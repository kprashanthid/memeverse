"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Image, { StaticImageData } from "next/image";
import { toggleDarkMode } from "@/store/themeSlice";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import zoro from "./zoro.jpg";

export default function ProfilePage() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);

  const [profile, setProfile] = useState<{
    name: string;
    bio: string;
    avatar: StaticImageData | string;
  }>({
    name: "",
    bio: "",
    avatar: zoro,
  });
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const updateProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    alert("Profile Details Saved");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        avatar: reader.result as string,
      }));
    };
    alert("Profile Details Saved");
  };

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
      <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center w-full max-w-md mt-20">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <Image
            src={profile.avatar}
            alt="Profile Avatar"
            width={100}
            height={100}
            className="rounded-full mx-auto border-2 border-gray-300"
          />
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Your Name"
          className="mt-3 w-full px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-700"
        />
        <textarea
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Write your bio..."
          className="mt-3 w-full px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-700"
        />
        <button
          onClick={updateProfile}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
        >
          Save Profile
        </button>
      </div>
      <h3 className="text-xl font-bold mt-6">❤️ Liked Memes</h3>
      {likedMemes.length === 0 ? (
        <p>No liked memes yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {likedMemes.map((meme) => (
            <div
              key={meme.id}
              className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow-md"
            >
              <Image
                src={meme.url}
                alt={meme.name}
                className="sm:w-full rounded-md sm:h-60 h-40 w-full"
              />
              <p className="text-center mt-2 sm:text-lg text-xs">{meme.name}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
