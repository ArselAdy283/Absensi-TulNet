"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateUser, deleteUser } from "@/actions";

type User = {
    id: number;
    name: string;
    nisn: string;
};

export default function SiswaListClient({ users }: { users: User[] }) {
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleDelete = (id: number, name: string) => {
        toast(`Yakin ingin menghapus ${name}?`, {
            description: "Semua data absensi beserta fotonya untuk siswa ini akan ikut terhapus secara permanen.",
            action: {
                label: "Hapus",
                onClick: async () => {
                    const loadingId = toast.loading("Menghapus user...");
                    try {
                        const res = await deleteUser(id);
                        if (res.success) {
                            toast.success("User dan data terkait berhasil dihapus.", { id: loadingId });
                        } else {
                            toast.error(res.error || "Gagal menghapus user", { id: loadingId });
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

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingUser) return;

        const loadingId = toast.loading("Memperbarui user...");
        try {
            const formData = new FormData(e.currentTarget);
            const name = formData.get("name") as string;
            const nisn = formData.get("nisn") as string;

            const res = await updateUser(editingUser.id, name, nisn);
            if (res.success) {
                toast.success("Data user berhasil diperbarui.", { id: loadingId });
                setEditingUser(null);
            } else {
                toast.error(res.error || "Gagal memperbarui user", { id: loadingId });
            }
        } catch (error) {
            toast.error("Terjadi kesalahan pada server", { id: loadingId });
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-300 dark:border-gray-800 overflow-x-auto">
                <h2 className="text-xl font-semibold mb-4">Daftar Siswa</h2>
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                        <tr className="border-b border-gray-300 dark:border-gray-700">
                            <th className="p-3">ID</th>
                            <th className="p-3">Nama</th>
                            <th className="p-3">NISN</th>
                            <th className="p-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 last:border-b-0">
                                <td className="p-3">{user.id}</td>
                                <td className="p-3 font-medium">{user.name}</td>
                                <td className="p-3">{user.nisn}</td>
                                <td className="p-3">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditingUser(user)}
                                            className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id, user.name)}
                                            className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-3 text-center text-gray-500">
                                    Belum ada data user. Silakan tambah user terlebih dahulu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Edit User */}
            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Siswa</h3>
                            <button
                                onClick={() => setEditingUser(null)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm mb-1">Nama</label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={editingUser.name}
                                        required
                                        className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">NISN</label>
                                    <input
                                        type="text"
                                        name="nisn"
                                        defaultValue={editingUser.nisn}
                                        required
                                        className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent w-full"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                    >
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
