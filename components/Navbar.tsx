"use client";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "@/store/themeSlice";
import { RootState } from "@/store";
import debounce from "lodash.debounce";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

type NavbarProps = {
  onSearch: (query: string) => void;
  onSortChange: (sortBy: "likes" | "date" | "comments") => void;
};

export default function Navbar({ onSearch, onSortChange }: NavbarProps) {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"likes" | "date" | "comments">("likes");
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query.toLowerCase());
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md py-3 px-6 flex justify-between items-center fixed top-0 z-50">
      <Link href="/">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          MemeVerse 🔥
        </h1>
      </Link>
      {pathname === "/" && (
        <div className="hidden md:flex items-center gap-4">
          <input
            type="text"
            placeholder="Search memes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
          />
          <select
            value={sortBy}
            onChange={(e) => {
              const newSort = e.target.value as "likes" | "date" | "comments";
              setSortBy(newSort);
              onSortChange(newSort);
            }}
            className="p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white"
          >
            <option value="likes">Most Liked</option>
            <option value="date">Newest</option>
            <option value="comments">Most Commented</option>
          </select>
        </div>
      )}

      <button
        className="md:hidden text-gray-800 dark:text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <div className="hidden md:flex items-center gap-6">
        <Link href="/leaderboard" className="text-gray-700 dark:text-white">
          Leaderboard
        </Link>
        <Link href="/uploadmeme" className="text-gray-700 dark:text-white">
          Upload Meme
        </Link>
        <Link href="/profile" className="text-gray-700 dark:text-white">
          Profile
        </Link>
        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-md shadow-md"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-14 right-0 bg-white dark:bg-gray-900 shadow-md w-full md:hidden flex flex-col items-center py-4">
          <input
            type="text"
            placeholder="Search memes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white w-11/12 mb-2"
          />
          <select
            value={sortBy}
            onChange={(e) => {
              const newSort = e.target.value as "likes" | "date" | "comments";
              setSortBy(newSort);
              onSortChange(newSort);
            }}
            className="p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white w-11/12 mb-4"
          >
            <option value="likes">Most Liked</option>
            <option value="date">Newest</option>
            <option value="comments">Most Commented</option>
          </select>

          <Link
            href="/leaderboard"
            className="text-gray-700 dark:text-white py-2"
          >
            Leaderboard
          </Link>
          <Link
            href="/uploadmeme"
            className="text-gray-700 dark:text-white py-2"
          >
            Upload Meme
          </Link>
          <Link href="/profile" className="text-gray-700 dark:text-white py-2">
            Profile
          </Link>
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-md shadow-md mt-4"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      )}
    </nav>
  );
}
