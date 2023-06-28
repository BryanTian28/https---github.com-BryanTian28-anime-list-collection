import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import { Routes, Route } from "react-router-dom";
import AnimeDetailPage from "./pages/AnimeDetailPage";

const App: React.FC = () => {
  return (
    <div className="bg-[#222] max-h-full">
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/detail/:id" element={<AnimeDetailPage />} />
      </Routes>
    </div>
  );
};

export default App;
