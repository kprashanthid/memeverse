import { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadMeme } from "../store/slices/memeSlice";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";

export default function MemeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState<string | null>(null);
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

  const handleUpload = () => {
    if (!file) return alert("Please select a file!");
    if (!name.trim()) return alert("Please enter a meme name!");

    const reader = new FileReader();
    reader.onloadend = () => {
      if (!reader.result) return alert("Failed to read file!");

      const newMeme = {
        id: uuidv4(),
        name,
        url: reader.result as string,
      };

      console.log("🚀 Dispatching Upload Meme:", newMeme);
      dispatch(uploadMeme(newMeme));
      setFile(null);
      setName("");
      setImage(null);
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
        className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 dark:text-white"
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
