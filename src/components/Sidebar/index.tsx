"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiCalendarBlankBold, PiTable, PiHandPalmBold, PiUsersBold } from "react-icons/pi";
import { useSidebar } from "@/context/SidebarContext";

const Sidebar = () => {
    const pathname = usePathname();
    const { isOpen, closeSidebar } = useSidebar();

    const navClass = (path: string) => {
        const base = "flex items-center px-4 py-3 rounded-lg transition";
        const active = "bg-blue-300 dark:bg-blue-950 hover:bg-blue-300 dark:hover:bg-blue-950";
        const inactive = "hover:bg-blue-100 dark:hover:bg-gray-950";

        // Handle active state
        return `${base} ${pathname === path ? active : inactive}`;
    };

    return (
        <>
            {/* Overlay background for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeSidebar}
                    aria-hidden="true"
                />
            )}

            <aside
                id="sidebar"
                className={`fixed inset-y-0 left-0 z-50 md:relative md:h-screen h-full w-64 bg-white dark:bg-gray-900 text-black dark:text-white p-5 border-r border-gray-300 dark:border-gray-800 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}
            >
                <nav className="mt-18">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/absen" className={navClass('/absen')} onClick={closeSidebar}>
                                <PiHandPalmBold className="mr-2 text-xl" /> <span>Absen</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/tabel" className={navClass('/tabel')} onClick={closeSidebar}>
                                <PiTable className="mr-2 text-xl" /> <span>Tabel Absensi</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/siswa" className={navClass('/siswa')} onClick={closeSidebar}>
                                <PiUsersBold className="mr-2 text-xl" /> <span>Siswa</span>
                            </Link>
                        </li>
                        <li>
                            <Link href="/sesi" className={navClass('/sesi')} onClick={closeSidebar}>
                                <PiCalendarBlankBold className="mr-2 text-xl" /> <span>Sesi</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
