import { getAttendances, getSessions } from "@/actions";
import TabelDataClient from "@/components/TabelDataClient";

export default async function TabelPage() {
    const data = await getAttendances();
    const sessions = await getSessions();

    return (
        <div className="p-6 min-h-screen text-black dark:text-white">
            <h1 className="text-3xl font-bold mb-6">Tabel Absensi</h1>
            <TabelDataClient users={data.users} attendances={data.attendances} sessions={sessions} />
        </div>
    );
}
