// Home.tsx
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Body */}
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 bg-white">
          <h1 className="text-2xl font-bold">Home Page</h1>
        </main>
      </div>
    </div>
  );
}
