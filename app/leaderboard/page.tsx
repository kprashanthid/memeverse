"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { AnimatedBackground } from "animated-backgrounds";
import Sidebar from "@/components/SideBar";
import clsx from "clsx";

type Meme = {
  id: string;
  name: string;
  url: string;
  likes: number;
};

export default function LeaderboardPage() {
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
    <div
      className={clsx(
        darkMode
          ? "min-h-screen flex sm:flex-row flex-col items-center relative"
          : "min-h-screen flex sm:flex-row flex-col items-center relative bg-gradient-to-r from-[#4158D0] via-[#C850C0] to-[#FFCC70] bg-[length:200%_200%] animate-gradient"
      )}
    >
      <div className="hidden sm:block sm:min-w-80 h-screen">
        <Sidebar />
      </div>
      <div className="block sm:hidden w-full">
        <Navbar />
      </div>
      {darkMode && (
        <AnimatedBackground animationName="starryNight" blendMode="Overlay" />
      )}
      <div className="flex flex-col w-full h-screen items-center">
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
                className="flex items-center bg-white dark:bg-gray-800 p-3 rounded-lg shadow-2xl mb-2"
              >
                <span className="text-xl font-bold w-8">{index + 1}.</span>
                <Image
                  src={meme.url}
                  alt={meme.name}
                  width={60}
                  height={60}
                  className="rounded-md h-20 w-20"
                />
                <p className="flex-1 text-center">{meme.name}</p>
                <span className="text-red-500 font-semibold">
                  ❤️ {meme.likes}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
