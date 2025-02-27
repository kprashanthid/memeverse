"use client";
import { useState, useEffect } from "react";

export default function CommentSection({ memeId }: { memeId: string }) {
  const [comments, setComments] = useState<string[]>([]);
  const [input, setInput] = useState("");

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
    <div className="mt-4 bg-gray-100 p-4 rounded-lg">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={addComment}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Comment
      </button>
      {comments.map((c, i) => (
        <p key={i} className="p-2">
          {c}
        </p>
      ))}
    </div>
  );
}
