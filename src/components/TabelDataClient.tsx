"use client";

import { useState, useEffect } from "react";
import { formatSessionDateTime, formatAttendanceTime } from "@/lib/dateUtils";

type User = { id: number; name: string; nisn: string };
type Attendance = {
    id: number;
    userId: number;
    sessionId: number;
    createdAt: Date | string;
    photo: string;
    address: string | null;
    latitude: number;
    longitude: number;
};
type Session = {
    id: number;
    date: Date | string;
    time: string;
};

type MappedData = {
    user: User;
    attendance: Attendance | null;
};

export default function TabelDataClient({
    users,
    attendances,
    sessions
}: {
    users: User[],
    attendances: Attendance[],
    sessions: Session[]
}) {
    const [selectedDetail, setSelectedDetail] = useState<MappedData | null>(null);
    const [selectedSessionId, setSelectedSessionId] = useState<string>("");

    // Use the first session as default if not selected
    useEffect(() => {
        if (!selectedSessionId && sessions.length > 0) {
            setSelectedSessionId(String(sessions[0].id));
        }
    }, [sessions, selectedSessionId]);

    const currentSessionIdNum = Number(selectedSessionId);

    const mappedData: MappedData[] = users.map((user) => {
        const attendance = attendances.find((a) => a.userId === user.id && a.sessionId === currentSessionIdNum) || null;
        return { user, attendance };
    });

    return (
        <>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-300 dark:border-gray-800 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                    <h2 className="text-xl font-semibold">Daftar Absensi</h2>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-sm font-medium whitespace-nowrap">Sesi:</label>
                        <select
                            value={selectedSessionId}
                            onChange={(e) => setSelectedSessionId(e.target.value)}
                            className="border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent w-full sm:w-64"
                        >
                            {sessions.length === 0 && <option value="">Belum ada sesi</option>}
                            {sessions.map((s) => (
                                <option key={s.id} value={s.id} className="text-black">
                                    {formatSessionDateTime(s.date as Date, s.time)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-gray-300 dark:border-gray-700">
                                <th className="p-3">Nama</th>
                                <th className="p-3">NISN</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Tanggal Absen</th>
                                <th className="p-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mappedData.map((row) => (
                                <tr key={row.user.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 last:border-b-0">
                                    <td className="p-3 font-medium">{row.user.name}</td>
                                    <td className="p-3">{row.user.nisn}</td>

                                    {row.attendance ? (
                                        <>
                                            <td className="p-3 text-green-600 font-semibold">Sudah Absen</td>
                                            <td className="p-3">
                                                {formatAttendanceTime(row.attendance.createdAt as Date)}
                                            </td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => setSelectedDetail(row)}
                                                    className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                                                >
                                                    Lihat Detail
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="p-3 text-red-500 font-semibold">Belum Absen</td>
                                            <td className="p-3 text-gray-400">-</td>
                                            <td className="p-3 text-gray-400">-</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            {mappedData.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-3 text-center text-gray-500">
                                        Belum ada data user. Silakan tambah user terlebih dahulu.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Detail View */}
            {selectedDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Detail Absensi</h3>
                            <button
                                onClick={() => setSelectedDetail(null)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="flex flex-col items-center mb-6">
                                {selectedDetail.attendance ? (
                                    <img
                                        src={selectedDetail.attendance.photo}
                                        alt={`Foto ${selectedDetail.user.name}`}
                                        className="w-32 h-32 object-cover rounded-full border-4 border-blue-500 shadow-lg mb-4"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-4">
                                        <span className="text-gray-400 text-3xl">?</span>
                                    </div>
                                )}
                                <h4 className="text-xl font-bold text-center">{selectedDetail.user.name}</h4>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{selectedDetail.user.nisn}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Status</span>
                                    {selectedDetail.attendance ? (
                                        <span className="text-green-600 font-medium">Sudah Absen</span>
                                    ) : (
                                        <span className="text-red-500 font-medium">Belum Absen</span>
                                    )}
                                </div>

                                {selectedDetail.attendance && (
                                    <>
                                        <div className="pt-2">
                                            <span className="block text-sm text-gray-500 mb-1">Waktu Absen:</span>
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                {formatAttendanceTime(selectedDetail.attendance.createdAt as Date)}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-500 uppercase font-semibold">Alamat</span>
                                            <span className="text-sm">{selectedDetail.attendance.address || "Lokasi tidak diketahui"}</span>
                                        </div>
                                        <div className="pt-2">
                                            <a
                                                href={`https://www.google.com/maps?q=${selectedDetail.attendance.latitude},${selectedDetail.attendance.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200 text-center py-2 rounded-md font-medium hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                                            >
                                                Buka di Google Maps
                                            </a>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
