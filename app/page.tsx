"use client";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "@/store/themeSlice";
import { RootState } from "@/store";
import MemeCard from "../components/MemeCard";
import { setFetchedMemes } from "@/store/slices/memeSlice";
import debounce from "lodash.debounce";
import Navbar from "@/components/Navbar";
import { AnimatedBackground } from "animated-backgrounds";

import ThreeDotsWave from "@/components/ThreeDotWave";
import clsx from "clsx";
import Sidebar from "@/components/SideBar";

export type Meme = {
  id: string;
  name: string;
  url: string;
  likes?: number;
  date?: string;
  comments?: number;
};

export default function HomePage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState<"likes" | "date" | "comments">("likes");
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const uploadedMemes = useSelector(
    (state: RootState) => state.memes.uploadedMemes
  );

  // Fetch all memes once on component mount
  const fetchMemes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.imgflip.com/get_memes");
      const data = await res.json();
      const allFetchedMemes = data.data.memes;
      setMemes(allFetchedMemes);
      dispatch(setFetchedMemes(allFetchedMemes));
    } catch (error) {
      console.error("Failed to fetch memes:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchMemes();
  }, [fetchMemes]);

  // Reset page when search query or sort changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy]);

  // Combine uploaded and fetched memes, deduplicate
  const allMemes = [...uploadedMemes, ...memes].reduce((acc: Meme[], meme) => {
    if (!acc.some((item) => item.id === meme.id)) {
      acc.push(meme);
    }
    return acc;
  }, []);

  // Sort memes
  const sortedMemes = [...allMemes].sort((a, b) => {
    if (sortBy === "likes") return (b.likes || 0) - (a.likes || 0);
    if (sortBy === "date") return (b.date || "").localeCompare(a.date || "");
    if (sortBy === "comments") return (b.comments || 0) - (a.comments || 0);
    return 0;
  });

  // Filter memes based on search query
  const filteredMemes = sortedMemes.filter((meme) =>
    meme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate filtered memes
  const displayedMemes = filteredMemes.slice(0, page * 10);

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !loading &&
      displayedMemes.length < filteredMemes.length
    ) {
      setPage((prev) => prev + 1);
    }
  }, [loading, displayedMemes.length, filteredMemes.length]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Search handler
  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query.toLowerCase());
    }, 300),
    []
  );

  return (
    <div
      className={clsx(
        darkMode
          ? "min-h-screen flex relative sm:flex-row flex-col"
          : "min-h-screen bg-gradient-to-r from-[#4158D0] via-[#C850C0] to-[#FFCC70] bg-[length:200%_200%] animate-gradient flex relative sm:flex-row flex-col"
      )}
    >
      <div className="hidden sm:block sm:min-w-80">
        <Sidebar onSearch={handleSearch} />
      </div>
      <div className="block sm:hidden w-full">
        <Navbar
          onSearch={handleSearch}
          onSortChange={() => {
            dispatch(toggleDarkMode());
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>

      {darkMode && (
        <AnimatedBackground animationName="starryNight" blendMode="Overlay" />
      )}
      <div className="flex flex-col sm:gap-10 gap-5 sm:px-20 px-5">
        <h1
          className={`text-3xl font-bold mt-14 relative z-10 sm:mt-10 text-white ${
            darkMode && "text-white"
          }`}
        >
          🔥 Trending Memes
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
          {displayedMemes.map((meme) => (
            <MemeCard key={meme.id} meme={meme} />
          ))}
        </div>
        {loading && (
          <div className="h-full w-full">
            <ThreeDotsWave />
          </div>
        )}
      </div>
    </div>
  );
}
