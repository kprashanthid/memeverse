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
import Sidebar from "@/components/SideBar";
import ThreeDotsWave from "@/components/ThreeDotWave";
import clsx from "clsx";

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

  const fetchMemes = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("https://api.imgflip.com/get_memes");
      const data = await res.json();
      const newMemes = data.data.memes.slice(page * 10 - 10, page * 10);

      if (newMemes.length > 0) {
        const uniqueMemes = [...memes, ...newMemes].reduce((acc, meme) => {
          if (!acc.some((item: { id: string }) => item.id === meme.id)) {
            acc.push(meme);
          }
          return acc;
        }, [] as Meme[]);

        setMemes(uniqueMemes);
        dispatch(setFetchedMemes(uniqueMemes));
      }
    } catch (error) {
      console.error("Failed to fetch memes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemes();
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !loading
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query.toLowerCase());
    }, 300),
    []
  );

  const sortedMemes = [...memes].sort((a, b) => {
    if (sortBy === "likes") return (b.likes || 0) - (a.likes || 0);
    if (sortBy === "date") return (b.date || "").localeCompare(a.date || "");
    if (sortBy === "comments") return (b.comments || 0) - (a.comments || 0);
    return 0;
  });

  const filteredMemes = sortedMemes.filter((meme) =>
    meme.name.toLowerCase().includes(searchQuery)
  );

  return (
    <div
      className={clsx(
        darkMode
          ? "min-h-screen  flex relative sm:flex-row flex-col"
          : "min-h-screen bg-gradient-to-r from-[#4158D0] via-[#C850C0] to-[#FFCC70] bg-[length:200%_200%] animate-gradient flex relative sm:flex-row flex-col"
      )}
    >
      {/* <Navbar
        onSearch={handleSearch}
        onSortChange={() => {
          dispatch(toggleDarkMode());
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      /> */}
      <div className="hidden sm:block sm:min-w-80">
        <Sidebar
          onSearch={handleSearch}
          onSortChange={() => {
            dispatch(toggleDarkMode());
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
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
      {/* <div className="absolute inset-0 w-full h-full transition-colors -z-10" /> */}
      <div className="flex flex-col sm:gap-10 gap-5 sm:px-20 px-5">
        <h1
          className={`text-3xl font-bold mt-14 relative z-10 sm:mt-10 ${
            darkMode && "text-white"
          }`}
        >
          🔥 Trending Memes
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
          {uploadedMemes.length > 0 &&
            uploadedMemes.map((meme) => <MemeCard key={meme.id} meme={meme} />)}
          {filteredMemes.map((meme) => (
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
