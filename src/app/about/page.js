"use client";

import Header from "@/components/Header";

export default function About() {
  return (
    <>
      <Header />
      <main className="relative z-10 min-h-screen p-24">
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-white text-center">
            About
          </h1>
          <div className="max-w-2xl text-center text-white">
            <p className="text-lg">Your about content goes here...</p>
          </div>
        </div>
      </main>
    </>
  );
}
