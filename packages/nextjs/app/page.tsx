"use client";

import dynamic from "next/dynamic";
import { Provider } from "react-redux";
import { store } from "~~/components/store";

const GameBox = dynamic(() => import("~~/components/GameBox"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="w-full justify-center flex my-24">
      <Provider store={store}>
        <GameBox />
      </Provider>
    </div>
  );
}
