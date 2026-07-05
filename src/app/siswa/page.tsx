import { getUsers, createUser } from "@/actions";
import SiswaListClient from "@/components/SiswaListClient";

export default async function SiswaPage() {
    const users = await getUsers();

    async function handleAddUser(formData: FormData) {
        "use server";
        const name = formData.get("name") as string;
        const nisn = formData.get("nisn") as string;
        if (name && nisn) {
            await createUser(name, nisn);
        }
    }

    return (
        <div className="p-6 min-h-screen text-black dark:text-white">
            <h1 className="text-3xl font-bold mb-6">Manajemen Siswa</h1>

            {/* Form to add Users */}
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-300 dark:border-gray-800 mb-8">
                <h2 className="text-xl font-semibold mb-4">Tambah Siswa</h2>
                <form action={handleAddUser} className="flex flex-col sm:flex-row gap-4 sm:items-end">
                    <div className="w-full sm:w-auto">
                        <label className="block text-sm mb-1">Nama</label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="Contoh: Budi Santoso"
                            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent w-full sm:w-64"
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <label className="block text-sm mb-1">NISN</label>
                        <input
                            type="text"
                            name="nisn"
                            required
                            placeholder="Contoh: 12345678"
                            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent w-full sm:w-48"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors w-full sm:w-auto"
                    >
                        Tambah User
                    </button>
                </form>
            </div>

            <SiswaListClient users={users} />
        </div>
    );
}
