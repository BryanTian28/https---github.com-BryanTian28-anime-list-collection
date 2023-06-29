import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import AnimeDetailPage from "./pages/AnimeDetailPage";
import CollectionPage from "./pages/CollectionPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";

const App: React.FC = () => {
  return (
    <div className="bg-[#222] max-h-full">
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/detail/:id" element={<AnimeDetailPage />} />
        <Route path="/collections" element={<CollectionPage />} />
        <Route path="/collections/:name" element={<CollectionDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;
