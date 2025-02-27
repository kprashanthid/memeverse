"use client";
import { useState } from "react";

export default function ShareButtons({ memeUrl }: { memeUrl: string }) {
  const [copied, setCopied] = useState(false);
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
    memeUrl
  )}&text=Check%20out%20this%20meme!`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    memeUrl
  )}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(memeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 flex gap-3">
      <a
        href={twitterShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Share on Twitter
      </a>
      <a
        href={facebookShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Share on Facebook
      </a>

      <button
        onClick={copyToClipboard}
        className="bg-gray-500 text-white px-4 py-2 rounded-md"
      >
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
}
