import { getSessions, createSession } from "@/actions";
import SesiListClient from "@/components/SesiListClient";
import { revalidatePath } from "next/cache";

export default async function SesiPage() {
    const sessions = await getSessions();

    async function handleCreate(formData: FormData) {
        "use server";
        const date = formData.get("date") as string;
        const time = formData.get("time") as string;
        if (date && time) {
            await createSession(date, time);
        }
    }


    return (
        <div className="p-6 min-h-screen text-black dark:text-white">
            <h1 className="text-3xl font-bold mb-6">Manajemen Sesi</h1>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-300 dark:border-gray-800 mb-8">
                <h2 className="text-xl font-semibold mb-4">Tambah Sesi Baru</h2>
                <form action={handleCreate} className="flex flex-col sm:flex-row gap-4 sm:items-end">
                    <div className="w-full sm:w-auto">
                        <label className="block text-sm mb-1">Tanggal</label>
                        <input
                            type="date"
                            name="date"
                            required
                            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent w-full sm:w-40"
                        />
                    </div>
                    <div className="w-full sm:w-auto">
                        <label className="block text-sm mb-1">Jam</label>
                        <input
                            type="time"
                            name="time"
                            required
                            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent w-full sm:w-32"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors w-full sm:w-auto"
                    >
                        Tambah Sesi
                    </button>
                </form>
            </div>

            <SesiListClient sessions={sessions} />
        </div>
    );
}
