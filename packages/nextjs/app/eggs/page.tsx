"use client";

import { useState } from "react";

interface EggType {
  id: number;
  name: string;
  image: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  price: number;
  attributes: {
    speed: number;
    luck: number;
    strength: number;
  };
  color: string;
}

const EGGS: EggType[] = [
  {
    id: 1,
    name: "Dawn Egg",
    image: "/img/egg-1.png",
    rarity: "Common",
    price: 0.01,
    attributes: {
      speed: 3,
      luck: 2,
      strength: 2,
    },
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Twilight Egg",
    image: "/img/egg-2.png",
    rarity: "Rare",
    price: 0.05,
    attributes: {
      speed: 4,
      luck: 4,
      strength: 3,
    },
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "Phoenix Egg",
    image: "/img/egg-3.png",
    rarity: "Epic",
    price: 0.1,
    attributes: {
      speed: 5,
      luck: 5,
      strength: 5,
    },
    color: "bg-yellow-500",
  },
  {
    id: 4,
    name: "Dragon Egg",
    image: "/img/egg-4.png",
    rarity: "Legendary",
    price: 0.5,
    attributes: {
      speed: 7,
      luck: 7,
      strength: 7,
    },
    color: "bg-red-500",
  },
];

const AttributeBar = ({ value, maxValue = 10, color }: { value: number; maxValue?: number; color: string }) => (
  <div className="w-full bg-gray-700/30 rounded-full h-2">
    <div
      className={`${color} h-full rounded-full transition-all duration-500`}
      style={{ width: `${(value / maxValue) * 100}%` }}
    />
  </div>
);

const PurchaseModal = ({ egg, isOpen, onClose }: { egg: EggType; isOpen: boolean; onClose: () => void }) => {
  const [isPurchasing, setIsPurchasing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    // Add your Web3 purchase logic here
    try {
      // Simulating purchase delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Successfully purchased ${egg.name}!`);
      onClose();
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. Please try again.");
    }
    setIsPurchasing(false);
  };

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 backdrop-blur-sm bg-black/50" />
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full relative" onClick={e => e.stopPropagation()}>
          <h2 className="text-2xl font-bold mb-4">Purchase {egg.name}</h2>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Price:</span>
              <span className="font-bold">{egg.price} ETH</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>Rarity:</span>
              <span className={`font-bold ${egg.color.replace("bg-", "text-")}`}>{egg.rarity}</span>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <p className="text-sm text-gray-400 mb-4">
                Once purchased, your egg will hatch and reveal a unique bird with these base attributes.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchase}
              disabled={isPurchasing}
              className={`flex-1 px-4 py-2 rounded-lg ${
                isPurchasing ? "bg-blue-500/50" : "bg-blue-500 hover:bg-blue-600"
              } transition-colors`}
            >
              {isPurchasing ? "Processing..." : "Purchase"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EggCard = ({ egg }: { egg: EggType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="relative flex flex-col rounded-lg bg-gray-800/40 border border-gray-700/30 p-6 hover:border-gray-600/50 transition-all cursor-pointer group"
      >
        {/* Rarity Badge */}
        <div className={`absolute -top-2 -right-2 ${egg.color} px-3 py-1 rounded-full text-xs font-bold`}>
          {egg.rarity}
        </div>

        {/* Egg Image */}
        <div className="flex-1 flex items-center justify-center mb-4">
          <div className="relative w-32 h-32">
            <img
              src={egg.image}
              alt={egg.name}
              className="w-full h-full object-contain transform group-hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Egg Info */}
        <div>
          <h3 className="text-lg font-bold mb-2">{egg.name}</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Speed</span>
                <span>{egg.attributes.speed}/10</span>
              </div>
              <AttributeBar value={egg.attributes.speed} color={egg.color} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Luck</span>
                <span>{egg.attributes.luck}/10</span>
              </div>
              <AttributeBar value={egg.attributes.luck} color={egg.color} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Strength</span>
                <span>{egg.attributes.strength}/10</span>
              </div>
              <AttributeBar value={egg.attributes.strength} color={egg.color} />
            </div>
          </div>

          {/* Price */}
          <div className="mt-4 pt-4 border-t border-gray-700/30">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Price</span>
              <span className="font-bold">{egg.price} ETH</span>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <PurchaseModal egg={egg} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default function PurchaseEggs() {
  return (
    <div className="w-full flex flex-col items-center my-24 max-w-7xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Purchase Mystery Eggs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {EGGS.map(egg => (
          <EggCard key={egg.id} egg={egg} />
        ))}
      </div>
    </div>
  );
}
