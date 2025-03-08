"use client";
import Link from "next/link";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <section className="flex flex-col items-center justify-center min-h-screen bg-white font-serif p-10">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-black inset-0 flex items-center justify-center">
            404
          </h1>
          <Image
            height={500}
            width={500}
            alt="Loading"
            src={
              "https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
            }
          />
          <div className="mt-[-50px]">
            <h3 className="text-3xl font-semibold text-gray-800">
              Look like you&apos;re lost
            </h3>
            <p className="text-gray-600 mt-2">
              The page you are looking for is not available!
            </p>
            <Link href="/">
              <button className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition">
                Go to Home
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
