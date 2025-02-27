"use client";
import MemeUpload from "@/components/MemeUpload";
import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion } from "framer-motion";

export default function MemeUploadPage() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center relative"
    >
      <Navbar onSearch={() => {}} onSortChange={() => {}} />

      <motion.div
        initial={{ opacity: 1 }}
        animate={{
          background: darkMode
            ? "linear-gradient(to bottom, #111827, #1f2937, #374151)"
            : "linear-gradient(to bottom, #ffffff, #f3f4f6, #e5e7eb)",
        }}
        transition={{ duration: 1 }}
        className="absolute inset-0 w-full h-full transition-colors -z-10"
      />

      <div className="h-screen flex flex-1 items-center justify-center">
        <MemeUpload />
      </div>
    </motion.div>
  );
}
