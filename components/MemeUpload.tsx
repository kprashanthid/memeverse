"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { uploadMeme } from "../store/slices/memeSlice";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

export default function MemeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loadingCaption, setLoadingCaption] = useState(false);
  const dispatch = useDispatch();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const generateAICaption = async () => {
    if (!name.trim()) return alert("Please enter a meme name first!");

    try {
      setLoadingCaption(true);
      // Make API call to generate AI caption
      const response = await axios.post("/api/generateCaption", {
        memeName: name,
      });

      // Log the response to check the data
      console.log("Caption Response:", response.data);

      // Set the generated caption
      setCaption(response.data.caption);
    } catch (error: any) {
      // Handle errors and display them
      console.error(
        "Error generating AI caption:",
        error.response?.data || error.message
      );
      alert("Failed to generate AI caption.");
    } finally {
      setLoadingCaption(false);
    }
  };

  const handleUpload = () => {
    if (!file) return alert("Please select a file!");
    if (!name.trim()) return alert("Please enter a meme name!");
    if (!caption.trim()) return alert("Please add a funny caption!");

    const reader = new FileReader();
    reader.onloadend = () => {
      if (!reader.result) return alert("Failed to read file!");

      const newMeme = {
        id: uuidv4(),
        name,
        url: reader.result as string,
        caption,
      };

      dispatch(uploadMeme(newMeme));
      setFile(null);
      setName("");
      setImage(null);
      setCaption("");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
        Upload Your Meme
      </h2>
      <input
        type="text"
        placeholder="Meme Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 text-gray-800 dark:text-white"
      />
      <button
        onClick={generateAICaption}
        disabled={loadingCaption}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold p-2 rounded-lg transition-all duration-300 mb-3"
      >
        {loadingCaption ? "Generating..." : "Generate AI Caption 🤖"}
      </button>
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 text-gray-800 dark:text-white"
        rows={3}
        placeholder="AI-generated caption will appear here..."
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3"
      />
      {image && (
        <Image
          src={image}
          alt="Meme Preview"
          width={300}
          height={300}
          className="w-full rounded-lg mb-3 border border-gray-300 dark:border-gray-600"
        />
      )}
      <button
        onClick={handleUpload}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold p-3 rounded-lg transition-all duration-300"
      >
        Upload Meme 🚀
      </button>
    </div>
  );
}
