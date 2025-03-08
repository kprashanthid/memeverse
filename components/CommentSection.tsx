"use client";
import { useState, useEffect } from "react";
import zoro from "../app/profile/zoro.jpg";
import Image from "next/image";

export default function CommentSection({ memeId }: { memeId: string }) {
  const [comments, setComments] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const savedProfile = localStorage.getItem("userProfile");
  const [user, setUser] = useState<{ name: string; avatar: string } | null>(
    savedProfile ? JSON.parse(savedProfile) : null
  );

  useEffect(() => {
    const storedComments = JSON.parse(
      localStorage.getItem(`comments-${memeId}`) || "[]"
    );
    setComments(storedComments);
  }, [memeId]);

  const addComment = () => {
    if (!input.trim()) return;
    const updatedComments = [...comments, input];
    setComments(updatedComments);
    localStorage.setItem(`comments-${memeId}`, JSON.stringify(updatedComments));
    setInput("");
  };

  return (
    <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
      <div className="flex items-center space-x-2 border-b pb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 text-sm border-none outline-none"
        />
        <button
          onClick={addComment}
          className="text-blue-500 font-semibold hover:text-blue-600"
        >
          Post
        </button>
      </div>

      <div className="mt-2 space-y-2">
        {comments.map((c, i) => (
          <div key={i} className="flex items-start space-x-2">
            <Image
              src={user?.avatar && user?.avatar !== "" ? user.avatar : zoro}
              alt="User"
              className="w-6 h-6 rounded-full"
            />
            <div className="bg-gray-100 p-2 rounded-lg text-sm w-full">
              <p className="font-semibold">{user?.name || "You"}</p>
              <p>{c}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
