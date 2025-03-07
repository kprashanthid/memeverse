"use client";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "@/store/themeSlice";
import { RootState } from "@/store";
import debounce from "lodash.debounce";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

type SidebarProps = {
  onSearch?: (query: string) => void;
  onSortChange?: (sortBy: "likes" | "date" | "comments") => void;
};

export default function Sidebar({ onSearch, onSortChange }: SidebarProps) {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"likes" | "date" | "comments">("likes");
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const debouncedSearch = useMemo(
    () => debounce((query: string) => onSearch?.(query.toLowerCase()), 300),
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
    <>
      <div className="sm:hidden visible">
        <button
          className="fixed top-4 left-4 z-50 text-gray-800 dark:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <div className="fixed top-0 left-0 h-full z-50 sm:w-72 dark:bg-gray-900 shadow-2xl flex flex-col items-center py-6 px-4">
        <h1 className="text-xl font-bold  text-white mb-10 ml-4">
          <Link href="/" className=" text-white py-2 text-[30px]">
            MemeVerse 🔥
          </Link>
        </h1>
        {pathname == "/" && (
          <>
            <input
              type="text"
              placeholder="Search memes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white w-full mb-4"
            />
            {/* <select
              value={sortBy}
              onChange={(e) => {
                const newSort = e.target.value as "likes" | "date" | "comments";
                setSortBy(newSort);
                onSortChange?.(newSort);
              }}
              className="p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white w-full mb-4"
            >
              <option value="likes">Most Liked</option>
              <option value="date">Newest</option>
              <option value="comments">Most Commented</option>
            </select> */}
          </>
        )}

        <nav className="flex flex-col w-full gap-10 font-semibold">
          <Link
            href="/leaderboard"
            className=" text-white py-2 hover:bg-white hover:text-black rounded-md text-center"
          >
            Leaderboard
          </Link>
          <Link
            href="/uploadmeme"
            className=" text-white py-2 hover:bg-white hover:text-black rounded-md text-center"
          >
            Upload Meme
          </Link>
          <Link
            href="/profile"
            className=" text-white py-2 hover:bg-white hover:text-black rounded-md text-center"
          >
            Profile
          </Link>
        </nav>

        <button
          onClick={() => dispatch(toggleDarkMode())}
          className="mt-6 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-md shadow-md w-full"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </>
  );
}
