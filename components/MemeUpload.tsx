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
      const response = await axios.post("/api/generateCaption", {
        memeName: name,
      });

      setCaption(response.data.caption);
    } catch (error) {
      console.error("Error generating AI caption:", error);
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
    <div className="p-6 border rounded-2xl shadow-lg bg-white dark:bg-gray-900 max-w-2xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Meme Preview (Only visible when image is selected) */}
      {image && (
        <div className="md:w-1/2 flex justify-center items-center">
          <div className="border rounded-xl overflow-hidden shadow-md w-full">
            <Image
              src={image}
              alt="Meme Preview"
              width={300}
              height={300}
              className="w-full object-cover"
            />
            <div className="p-2 bg-gray-100 dark:bg-gray-800">
              <p className="text-center font-medium text-gray-800 dark:text-white">
                {caption || "Your meme caption will appear here"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
          Upload Meme 📸
        </h2>

        {/* Meme Name */}
        <input
          type="text"
          placeholder="Enter Meme Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-xl mb-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
        />

        {/* AI Caption Generator */}
        <button
          onClick={generateAICaption}
          disabled={loadingCaption}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold p-3 rounded-xl transition-all duration-300 shadow-md"
        >
          {loadingCaption ? "Generating..." : "Generate AI Caption 🤖"}
        </button>

        {/* Caption Input */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-xl mb-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="AI-generated caption will appear here..."
        />

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 p-4 rounded-xl text-center mb-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-blue-500 hover:text-blue-600"
          >
            Click to upload an image 📤
          </label>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold p-3 rounded-xl transition-all duration-300 shadow-lg"
        >
          Upload Meme 🚀
        </button>
      </div>
    </div>
  );
}
