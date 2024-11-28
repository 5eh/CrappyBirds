"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { PlusIcon, UserIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, ChatBubbleLeftIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "PLAY",
    href: "/",
    icon: <MagnifyingGlassIcon className="h-4 w-4" />,
  },
  {
    label: "YOUR SKINS",
    href: "/skins",
    icon: <MagnifyingGlassIcon className="h-4 w-4" />,
  },
  {
    label: "PURCHASE EGGS",
    href: "/eggs",
    icon: <ChatBubbleLeftIcon className="h-4 w-4" />,
  },
  {
    label: "STATS",
    href: "/stats",
    icon: <UserIcon className="h-4 w-4" />,
  },
  {
    label: "LEADERBOARD",
    href: "/leaderboard",
    icon: <PlusIcon className="h-4 w-4" />,
  },
];

export const DesktopHeader = () => {
  const { resolvedTheme } = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  const logoImages = ["/img/bird-flat.png", "/img/bird-down.png", "/img/bird-up.png"];

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex(prevIndex => (prevIndex + 1) % logoImages.length);
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="sticky lg:static md:pt-6 pt-0 top-0 navbar min-h-0 flex-shrink-0 justify-around z-20 px-0 sm:px-2">
        <div>
          <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
            <div className="relative w-16 h-16">
              <Image
                alt="Crappy Birds"
                className="cursor-pointer object-contain transition-opacity duration-300"
                fill
                sizes="(max-width: 48px) 50vw, 48px"
                priority
                src={logoImages[currentLogoIndex]}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight code">CRAPPY BIRDS</span>
              <span className="text-sm">THE CRAPPY FOUNDATION</span>
            </div>
          </Link>
        </div>

        <div className="flex flex-grow justify-end sm:justify-end items-center md:justify-end">
          <RainbowKitCustomConnectButton />
        </div>
      </div>

      <div className="w-full flex justify-center items-center relative">
        <div className="w-full border border-transparent md:border-t-black md:dark:border-t-white" />
        <ul className="hidden lg:flex lg:flex-row whitespace-nowrap gap-x-4 sm:px-4">
          <HeaderMenuLinks />
        </ul>
        <div className="w-full border border-transparent md:border-t-black md:dark:border-t-white" />
      </div>
    </>
  );
};

export const HeaderMenuLinks = ({ closeMenu }: { closeMenu?: () => void }) => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href} className="w-full lg:w-auto">
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-primary shadow-md" : ""
              } shadow-lg w-full lg:w-auto text-center p-3 min-w-fit border border-primary backdrop-blur-md transition hover:ease-in-out
              bg-primary/20 hover:bg-primary/30 hover:border-primary
              dark:bg-primary/20 dark:hover:bg-primary/40 dark:border-white dark:hover:border-white/80 py-1.5 px-3 text-sm gap-2 flex justify-center items-center`}
              onClick={closeMenu}
            >
              {icon}
              <span className="code">{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

export const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOutsideClick(
    menuRef,
    useCallback(() => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    }, [isMenuOpen]),
  );

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-50 hover:cursor-pointer bg-transparent backdrop-blur-md border-t border-gray-200 dark:border-gray-700 flex justify-around items-center p-2 lg:hidden"
        onClick={toggleMenu}
      >
        <Bars3Icon className="h-6 w-6" />
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-x-0 bottom-10 dark:border-b-gray-700 dark:border-t-gray-700 border border-transparent z-50 bg-transparent backdrop-blur-md p-4"
        >
          <ul className="flex flex-col items-center gap-y-4">
            <HeaderMenuLinks closeMenu={closeMenu} />
          </ul>
        </div>
      )}
    </>
  );
};
