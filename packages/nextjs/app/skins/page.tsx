"use client";

import { useState } from "react";
import Link from "next/link";

const DEFAULT_SKINS = [
  {
    id: 1,
    name: "Classic Bird",
    image: "/img/bird-flat.png",
  },
  {
    id: 2,
    name: "Golden Bird",
    image: "/img/bird-up.png",
  },
  {
    id: 3,
    name: "Shadow Bird",
    image: "/img/bird-down.png",
  },
];

interface SkinCardProps {
  id: number;
  name: string;
  image: string;
  isPurchase?: boolean;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}

const SkinCard = ({ id, name, image, isPurchase = false, isSelected = false, onSelect }: SkinCardProps) => {
  if (isPurchase) {
    return (
      <Link href={"/eggs"}>
        <div className="relative flex flex-col items-center justify-center h-48 rounded-lg bg-blue-500/20 border-2 border-blue-500/40 p-4 hover:bg-blue-500/30 transition-all cursor-pointer">
          <div className="text-6xl text-blue-500">+</div>
          <span className="mt-2 text-lg font-semibold text-blue-500">Purchase</span>
        </div>
      </Link>
    );
  }

  return (
    <div
      onClick={() => onSelect?.(id)}
      className={`relative flex flex-col h-48 rounded-lg p-4 transition-all cursor-pointer overflow-hidden
        ${
          isSelected
            ? "bg-primary/30 border-2 border-primary shadow-lg scale-105"
            : "bg-gray-400/20 border-2 border-gray-800/20 hover:bg-gray-400/30"
        }`}
    >
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-32 h-32">
          <img src={image} alt={name} className="absolute inset-0 w-full h-full object-contain" />
        </div>
      </div>
      <div className="mt-2 text-center font-medium">{name}</div>
    </div>
  );
};

export default function Home() {
  const [selectedSkinId, setSelectedSkinId] = useState<number>(1);
  const [activeSkin, setActiveSkin] = useState(DEFAULT_SKINS[0]);

  const handleSkinSelect = (id: number) => {
    setSelectedSkinId(id);
    const newActiveSkin = DEFAULT_SKINS.find(skin => skin.id === id);
    if (newActiveSkin) {
      setActiveSkin(newActiveSkin);
      localStorage.setItem("selectedSkin", JSON.stringify(newActiveSkin));
    }
  };

  return (
    <div className="w-full flex flex-col items-center my-24 max-w-7xl mx-auto px-4">
      <div className="w-full mb-8">
        <div className="bg-gray-800/40 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Active Skin</h3>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 relative flex items-center justify-center bg-gray-700/20 rounded-lg">
              <div className="w-24 h-24 relative">
                <img
                  src={activeSkin.image}
                  alt={activeSkin.name}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <p className="font-medium text-lg">{activeSkin.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <h2 className="text-2xl font-bold mb-4">Available Skins</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DEFAULT_SKINS.map(skin => (
            <SkinCard key={skin.id} {...skin} isSelected={selectedSkinId === skin.id} onSelect={handleSkinSelect} />
          ))}
          <SkinCard id={0} name="Purchase" image="" isPurchase />
        </div>
      </div>
    </div>
  );
}
