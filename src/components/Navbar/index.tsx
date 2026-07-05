"use client";

import { PiListBold, PiMoonBold, PiSunBold } from "react-icons/pi";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSidebar } from "@/context/SidebarContext";

const Navbar = () => {
    const { theme, setTheme } = useTheme();
    const { toggleSidebar } = useSidebar();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header className="fixed top-0 left-0 w-full flex justify-between items-center px-5 md:px-15 h-15 bg-gray-200 dark:bg-gray-900 z-50 border-b border-gray-300 dark:border-gray-800">
            <div className="flex gap-5 justify-center items-center">
                <button onClick={toggleSidebar} className="md:hidden cursor-pointer" title="Toggle Sidebar" aria-label="Toggle Sidebar">
                    <PiListBold id="list-menu" className="text-xl text-black dark:text-white" />
                </button>
                <div className="text-xl md:text-3xl font-bold">Absensi</div>
            </div>
            <button id="theme-toggle" onClick={toggleTheme} className="cursor-pointer" title="Toggle Theme">
                {mounted && theme === "dark" ? (
                    <PiSunBold id="theme-icon" className="text-xl md:text-3xl text-black dark:text-white" />
                ) : (
                    <PiMoonBold id="theme-icon" className="text-xl md:text-3xl text-black dark:text-white" />
                )}
            </button>
        </header>
    )
}

export default Navbar