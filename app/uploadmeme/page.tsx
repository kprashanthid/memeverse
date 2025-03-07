"use client";
import MemeUpload from "@/components/MemeUpload";
import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { motion } from "framer-motion";
import { AnimatedBackground } from "animated-backgrounds";
import Sidebar from "@/components/SideBar";
import clsx from "clsx";

export default function MemeUploadPage() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  return (
    <motion.div
      className={clsx(
        darkMode
          ? "min-h-screen flex sm:flex-row flex-col items-center relative"
          : "min-h-screen flex sm:flex-row flex-col items-center relative bg-gradient-to-r from-[#4158D0] via-[#C850C0] to-[#FFCC70] bg-[length:200%_200%] animate-gradient"
      )}
    >
      {darkMode && (
        <AnimatedBackground animationName="starryNight" blendMode="Overlay" />
      )}
      <div className="hidden sm:block sm:min-w-80 h-screen">
        <Sidebar />
      </div>

      <div className="block sm:hidden w-full">
        <Navbar />
      </div>
      <div className="h-screen flex flex-1  flex-row items-center justify-center sm:mx-0 mx-4">
        <MemeUpload />
      </div>
    </motion.div>
  );
}
