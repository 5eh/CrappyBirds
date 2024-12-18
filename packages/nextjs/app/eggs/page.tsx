"use client";

import { useState } from "react";
import Image from "next/image";
import Egg from "../../public/unhatched-egg.png";

interface EggType {
  id: number;
  name: string;
  price: number;
  attributes: {
    scales: number;
    feathers: number;
    spots: number;
  };
  color: string;
}

const UNHATCHED_EGG: EggType = {
  id: 1,
  name: "UNHATCHED EGG",
  price: 0.01,
  attributes: {
    scales: 3,
    feathers: 2,
    spots: 2,
  },
  color: "bg-blue-500",
};

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
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Successfully purchased an Unhatched Egg!`);
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
          <h2 className="text-2xl font-bold mb-4">Purchase Unhatched Egg</h2>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span>Price:</span>
              <span className="font-bold">{egg.price} ETH</span>
            </div>
            <div className="border-t border-gray-700 pt-4">
              <p className="text-sm text-gray-400 mb-4">
                Your egg will hatch with random skin attributes. Each egg is unique!
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
              className={`flex-1 px-4 py-2 rounded-lg ${isPurchasing ? "bg-blue-500/50" : "bg-blue-500 hover:bg-blue-600"} transition-colors`}
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
        <div className="flex-1 flex items-center justify-center mb-4">
          <div className="relative w-32 h-32">
            <Image
              src={Egg}
              alt="Unhatched Egg"
              width={128}
              height={128}
              className="object-contain transform group-hover:scale-105 transition-transform"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">{egg.name}</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Scales</span>
                <span>???/10</span>
              </div>
              <AttributeBar value={0} color={egg.color} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Feathers</span>
                <span>???/10</span>
              </div>
              <AttributeBar value={0} color={egg.color} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Spots</span>
                <span>???/10</span>
              </div>
              <AttributeBar value={0} color={egg.color} />
            </div>
          </div>

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
      <h1 className="text-3xl font-bold mb-8">PURCHASE AN UNHATCHED EGG</h1>
      <div className="w-full max-w-sm">
        <EggCard egg={UNHATCHED_EGG} />
      </div>
    </div>
  );
}
