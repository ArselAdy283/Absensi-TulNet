"use client";

import { toast } from "sonner";
import { deleteSession } from "@/actions";
import { formatSessionDateTime } from "@/lib/dateUtils";

type Session = {
    id: number;
    date: Date | string;
    time: string;
};

export default function SesiListClient({ sessions }: { sessions: Session[] }) {

    const handleDelete = (id: number) => {
        toast("Yakin ingin menghapus sesi ini?", {
            description: "Semua data absensi pada sesi ini akan ikut terhapus secara permanen.",
            action: {
                label: "Hapus",
                onClick: async () => {
                    const loadingId = toast.loading("Menghapus sesi...");
                    try {
                        const res = await deleteSession(id);
                        if (res.success) {
                            toast.success("Sesi dan semua data terkait berhasil dihapus.", { id: loadingId });
                        } else {
                            toast.error(res.error || "Gagal menghapus sesi", { id: loadingId });
                        }
                    } catch (error) {
                        toast.error("Terjadi kesalahan pada server", { id: loadingId });
                    }
                }
            },
            cancel: {
                label: "Batal",
                onClick: () => { }
            }
        });
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-300 dark:border-gray-800 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-700">
                        <th className="p-3">Waktu Sesi</th>
                        <th className="p-3">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions.map((sesi) => (
                        <tr key={sesi.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 last:border-b-0">
                            <td className="p-3">
                                {formatSessionDateTime(sesi.date as Date, sesi.time)}
                            </td>
                            <td className="p-3">
                                <button
                                    onClick={() => handleDelete(sesi.id)}
                                    className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                >
                                    Hapus
                                </button>
                            </td>
                        </tr>
                    ))}
                    {sessions.length === 0 && (
                        <tr>
                            <td colSpan={2} className="p-3 text-center text-gray-500">
                                Belum ada sesi absensi. Silakan buat sesi baru.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
