import { useState } from "react";
import { Bookmark, Heart, PlusCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image from "next/image";
import MemeCard from "./MemeCard";

export default function ProfileTable() {
  const [activeTab, setActiveTab] = useState("favorites");
  const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);
  const uploadedMemes = useSelector(
    (state: RootState) => state.memes.uploadedMemes
  );

  return (
    <div>
      <div className="flex space-x-4 pb-2 justify-between">
        <button
          className={`flex items-center space-x-2 p-2 ${
            activeTab === "favorites"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-white"
          }`}
          onClick={() => setActiveTab("favorites")}
        >
          <Heart className="w-6 h-6" />
          <span>Favorites</span>
        </button>

        <button
          className={`flex items-center space-x-2 p-2 ${
            activeTab === "bookmarks"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-white"
          }`}
          onClick={() => setActiveTab("bookmarks")}
        >
          <Bookmark className="w-6 h-6" />
          <span>Bookmarks</span>
        </button>

        <button
          className={`flex items-center space-x-2 p-2 ${
            activeTab === "add"
              ? "text-green-500 border-b-2 border-green-500"
              : "text-white"
          }`}
          onClick={() => setActiveTab("add")}
        >
          <PlusCircle className="w-6 h-6" />
          <span>Posts</span>
        </button>
      </div>

      <div className="p-4 h-full">
        {activeTab === "favorites" && (
          <div>
            {activeTab === "favorites" && (
              <div>
                {likedMemes.length === 0 ? (
                  <p className="text-center text-gray-500">No posts yet.</p>
                ) : (
                  <div className="grid sm:grid-cols-4 grid-cols-1 gap-1 md:gap-4 mt-4">
                    {likedMemes.map((meme) => (
                      <div key={meme.id} className="relative group">
                        <div className="bg-white rounded-lg p-5 flex flex-col gap-5">
                          <Image
                            width={150}
                            height={150}
                            src={meme.url}
                            alt={meme.name}
                            className="h-80 w-80 object-cover rounded-lg shadow-lg"
                          />
                          <span>{meme.name}</span>
                        </div>
                        <div className="absolute rounded-lg shadow-lg inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 flex items-center justify-center">
                          <p className="text-white font-bold opacity-0 group-hover:opacity-100 transition duration-300">
                            {meme.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === "bookmarks" && (
          <div className="">
            {" "}
            <p className="text-white">Yet to be implemented here...</p>
          </div>
        )}
        {activeTab === "add" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
              {uploadedMemes.map((meme) => (
                <MemeCard key={meme.id} meme={meme} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
