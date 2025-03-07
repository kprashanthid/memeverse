"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Image, { StaticImageData } from "next/image";
import Navbar from "@/components/Navbar";
import { User } from "lucide-react";
import { clsx } from "clsx";
import { Settings } from "lucide-react";
import ProfileTable from "@/components/profile-tab";
import { AnimatedBackground } from "animated-backgrounds";
import Sidebar from "@/components/SideBar";

export default function ProfilePage() {
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [edit, setEdit] = useState(false);

  const [profile, setProfile] = useState<{
    name: string;
    bio: string;
    avatar: StaticImageData | string;
  }>({
    name: "Prashanth",
    bio: "I am a funny guy meme page creating",
    avatar: "",
  });
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const updateProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setEdit(!edit);
    alert("Profile Details Saved");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        avatar: reader.result as string,
      }));
    };
    alert("Profile Details Saved");
  };

  return (
    <>
      <div
        className={clsx(
          darkMode
            ? "min-h-screen w-full"
            : "min-h-screen  bg-gradient-to-r from-[#4158D0] via-[#C850C0] to-[#FFCC70] bg-[length:200%_200%] animate-gradient"
        )}
      >
        <div className="flex flex-row flex-1 w-full">
          <div className="hidden sm:block sm:min-w-80 h-screen">
            <Sidebar />
          </div>
          <div className="block sm:hidden w-full">
            <Navbar />
          </div>
          {darkMode && (
            <AnimatedBackground
              animationName="starryNight"
              blendMode="Overlay"
            />
          )}
          <div className=" p-6 text-center w-full">
            <div className="flex flex-1 items-center sm:gap-24 gap-5 justify-center">
              <label htmlFor="avatar-upload" className="cursor-pointer">
                {profile.avatar ? (
                  <Image
                    src={profile.avatar}
                    alt="Profile Avatar"
                    width={150}
                    height={150}
                    className="rounded-full mx-auto border-2 border-gray-300 object-cover aspect-square"
                  />
                ) : (
                  <User className="sm:w-40 sm:h-40 w-24 h-24 text-white bg-gray-300 rounded-full p-2" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />

              <div className="flex flex-col items-start">
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  readOnly={!edit}
                  placeholder="Your Name"
                  className={clsx(
                    !edit
                      ? "bg-transparent dark:text-white sm:text-[30px] text-[18px]"
                      : "mt-3 w-full px-3 py-2 rounded-md dark:bg-gray-700 outline-none bg-gray-100"
                  )}
                />
                <textarea
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  readOnly={!edit}
                  placeholder="Write your bio..."
                  className={clsx(
                    !edit
                      ? "mt-3 w-full bg-transparent dark:text-white resize-none sm:text-[18px] text-[12px]"
                      : "mt-3 w-full px-3 py-2 rounded-md border-none outline-none dark:bg-gray-700 resize-none bg-gray-100"
                  )}
                />
                {!edit ? (
                  <span
                    onClick={() => {
                      setEdit(!edit);
                    }}
                    className="text-blue-600 dark:mt-2 sm:text-[16px] text-[12px] flex flex-row gap-1 items-center"
                  >
                    Edit profile <Settings className="sm:h-4 sm:w-4 h-3 w-3" />
                  </span>
                ) : (
                  <button
                    onClick={updateProfile}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
                  >
                    Save Profile
                  </button>
                )}
              </div>
            </div>
            <div className="h-5 sm:h-10" />
            <ProfileTable />
          </div>
        </div>
      </div>
    </>
  );
}

// <motion.div
//   initial={{ opacity: 0 }}
//   animate={{ opacity: 1 }}
//   transition={{ duration: 0.5 }}
//   className="min-h-screen flex flex-col items-center relative"
// >
//   <Navbar onSearch={() => {}} onSortChange={() => {}} />
//   <motion.div
//     initial={{ opacity: 1 }}
//     animate={{
//       background: darkMode
//         ? "linear-gradient(to bottom, #111827, #1f2937, #374151)"
//         : "linear-gradient(to bottom, #ffffff, #f3f4f6, #e5e7eb)",
//     }}
//     transition={{ duration: 1 }}
//     className="absolute inset-0 w-full h-full transition-colors -z-10 sm:px-0 px-4"
//   />
//   <button
//     onClick={() => {
//       dispatch(toggleDarkMode());
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }}
//     className="fixed top-4 right-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-md shadow-md z-10 hover:bg-gray-300 dark:hover:bg-gray-600"
//   >
//     {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
//   </button>
//   <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-md text-center w-full max-w-md mt-20 ">
//     <label htmlFor="avatar-upload" className="cursor-pointer">
//       <Image
//         src={profile.avatar || zoro}
//         alt="Profile Avatar"
//         width={100}
//         height={100}
//         className="rounded-full mx-auto border-2 border-gray-300"
//       />
//     </label>
//     <input
//       id="avatar-upload"
//       type="file"
//       accept="image/*"
//       className="hidden"
//       onChange={handleImageUpload}
//     />
//     <input
//       type="text"
//       value={profile.name}
//       onChange={(e) => setProfile({ ...profile, name: e.target.value })}
//       placeholder="Your Name"
//       className="mt-3 w-full px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-700"
//     />
//     <textarea
//       value={profile.bio}
//       onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
//       placeholder="Write your bio..."
//       className="mt-3 w-full px-3 py-2 rounded-md border bg-gray-100 dark:bg-gray-700"
//     />
//     <button
//       onClick={updateProfile}
//       className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md w-full"
//     >
//       Save Profile
//     </button>
//   </div>
//   <h3 className="text-xl font-bold mt-6">❤️ Liked Memes</h3>
//   {likedMemes.length === 0 ? (
//     <p>No liked memes yet.</p>
//   ) : (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
//       {likedMemes.map((meme) => (
//         <div
//           key={meme.id}
//           className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg shadow-md"
//         >
//           <Image
//             width={300}
//             height={300}
//             src={meme.url}
//             alt={meme.name}
//             className="sm:w-full rounded-md sm:h-60 h-40 w-full"
//           />
//           <p className="text-center mt-2 sm:text-lg text-xs">{meme.name}</p>
//         </div>
//       ))}
//     </div>
//   )}
// </motion.div>
