"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { getUsers, getSessions, createAttendance, getAttendances } from "@/actions";
import { useRouter } from "next/navigation";
import { formatSessionDateTime, getSessionDateObj } from "@/lib/dateUtils";

export default function AbsenPage() {
    const router = useRouter();

    const [users, setUsers] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);
    const [attendances, setAttendances] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [photoSrc, setPhotoSrc] = useState<string | null>(null);
    const [cameraError, setCameraError] = useState(false);

    const webcamRef = useRef<Webcam>(null);

    useEffect(() => {
        async function loadData() {
            const fetchedUsers = await getUsers();
            const fetchedSessions = await getSessions();
            const fetchedData = await getAttendances();
            setUsers(fetchedUsers);
            setSessions(fetchedSessions);
            setAttendances(fetchedData.attendances);
        }
        loadData();
    }, []);

    const getAddressFromCoords = async (lat: number, lon: number): Promise<string | null> => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data.display_name || null;
        } catch (e) {
            console.error("Geocoding failed", e);
            return null;
        }
    };

    const handleAbsen = useCallback(async () => {
        if (!selectedUser || !selectedSession) {
            setMessage({ type: 'error', text: "Silakan pilih Nama dan Sesi terlebih dahulu." });
            return;
        }

        if (!photoSrc) {
            setMessage({ type: 'error', text: "Silakan ambil foto selfie terlebih dahulu." });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        if (!navigator.geolocation) {
            setMessage({ type: 'error', text: "Geolocation tidak didukung oleh browser Anda." });
            setIsSubmitting(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                const address = await getAddressFromCoords(lat, lon);

                const result = await createAttendance({
                    userId: Number(selectedUser),
                    sessionId: Number(selectedSession),
                    photoBase64: photoSrc,
                    latitude: lat,
                    longitude: lon,
                    address: address,
                });

                if (result.success) {
                    setMessage({ type: 'success', text: "Absensi berhasil disimpan!" });
                    setTimeout(() => {
                        router.push("/tabel");
                    }, 2000);
                } else {
                    setMessage({ type: 'error', text: result.error || "Terjadi kesalahan." });
                    setIsSubmitting(false);
                }
            },
            (error) => {
                setMessage({ type: 'error', text: "Gagal mendapatkan lokasi. Izinkan akses lokasi browser Anda." });
                setIsSubmitting(false);
            }
        );
    }, [selectedUser, selectedSession, photoSrc, router]);

    return (
        <div className="p-6 min-h-screen text-black dark:text-white flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-6">Absensi</h1>

            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-300 dark:border-gray-800 w-full max-w-md">

                {message && (
                    <div className={`p-3 mb-4 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message.text}
                    </div>
                )}

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Pilih Nama</label>
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent"
                    >
                        <option value="" className="text-black">-- Pilih Nama --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id} className="text-black">{user.name} ({user.nisn})</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Pilih Sesi</label>
                    <select
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 bg-transparent"
                    >
                        <option value="" className="text-black">-- Pilih Sesi --</option>
                        {sessions.map(session => (
                            <option key={session.id} value={session.id} className="text-black">
                                {formatSessionDateTime(session.date, session.time)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6 flex flex-col items-center">
                    <label className="block text-sm font-medium mb-2 w-full text-left">Foto Selfie</label>
                    <div className="border-4 border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden w-full aspect-video bg-black flex items-center justify-center relative">
                        {!isCameraOpen && !photoSrc && !cameraError && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (typeof navigator !== 'undefined' && (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)) {
                                        setCameraError(true);
                                    } else {
                                        setIsCameraOpen(true);
                                    }
                                }}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full flex flex-col items-center justify-center transition-colors"
                            >
                                <i className="ph-bold ph-camera text-3xl mb-1"></i>
                                <span className="text-sm font-medium">Buka Kamera</span>
                            </button>
                        )}

                        {cameraError && !photoSrc && (
                            <div className="flex flex-col items-center p-4 text-center">
                                <p className="text-xs text-red-400 mb-3">Kamera diblokir browser (akses HTTP lokal). Gunakan tombol di bawah untuk memotret dengan kamera bawaan HP.</p>
                                <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer flex items-center gap-2 transition-colors">
                                    <i className="ph-bold ph-camera text-xl"></i>
                                    <span className="font-medium text-sm">Buka Kamera HP</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        capture="user" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => setPhotoSrc(ev.target?.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        )}

                        {isCameraOpen && !cameraError && (
                            <div className="fixed inset-0 z-[100] bg-black flex flex-col">
                                {/* Top bar with close button */}
                                <div className="absolute top-0 inset-x-0 p-4 flex justify-end z-[110] bg-gradient-to-b from-black/50 to-transparent">
                                    <button onClick={() => setIsCameraOpen(false)} className="text-white bg-black/30 p-2 rounded-full hover:bg-black/50">
                                        <i className="ph-bold ph-x text-2xl"></i>
                                    </button>
                                </div>
                                
                                {/* Camera stream */}
                                <div className="flex-1 relative flex items-center justify-center">
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        mirrored={true}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{ facingMode: "user" }}
                                        className="w-full h-full object-cover"
                                        onUserMediaError={() => {
                                            setCameraError(true);
                                            setIsCameraOpen(false);
                                        }}
                                    />
                                </div>

                                {/* Bottom bar with capture button */}
                                <div className="absolute bottom-0 inset-x-0 p-8 flex justify-center z-[110] bg-gradient-to-t from-black/80 to-transparent">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const imageSrc = webcamRef.current?.getScreenshot();
                                            if (imageSrc) {
                                                setPhotoSrc(imageSrc);
                                                setIsCameraOpen(false);
                                            }
                                        }}
                                        className="bg-white text-blue-600 w-16 h-16 rounded-full shadow-lg border-4 border-gray-300 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                        title="Ambil Foto"
                                    >
                                        <i className="ph-fill ph-camera text-3xl"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {photoSrc && !isCameraOpen && (
                            <>
                                <img src={photoSrc} alt="Selfie" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPhotoSrc(null);
                                        setCameraError(false);
                                    }}
                                    className="absolute bottom-4 bg-white text-red-600 px-4 py-2 rounded-md shadow-lg font-medium text-sm border-2 border-red-600 hover:bg-gray-100 transition-colors z-10"
                                >
                                    Ulangi Foto
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {(() => {
                    const hasAttended = selectedUser && selectedSession && attendances.some(a => a.userId === Number(selectedUser) && a.sessionId === Number(selectedSession));

                    const sessionObj = sessions.find(s => s.id === Number(selectedSession));
                    let isSessionValid = true;

                    if (sessionObj) {
                        const sessionDateTime = getSessionDateObj(sessionObj.date, sessionObj.time);

                        const now = new Date();
                        if (now < sessionDateTime) {
                            isSessionValid = false;
                        }
                    }

                    let buttonText = "Absen Sekarang";
                    let isButtonDisabled = false;

                    if (isSubmitting) {
                        buttonText = "Menyimpan...";
                        isButtonDisabled = true;
                    } else if (!selectedUser || !selectedSession) {
                        isButtonDisabled = true;
                    } else if (hasAttended) {
                        buttonText = "Sudah Absen";
                        isButtonDisabled = true;
                    } else if (!isSessionValid) {
                        buttonText = "Sesi Belum Mulai";
                        isButtonDisabled = true;
                    }

                    return (
                        <button
                            onClick={handleAbsen}
                            disabled={isButtonDisabled}
                            className={`w-full text-white font-medium py-3 rounded-md transition-colors ${isButtonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                        >
                            {buttonText}
                        </button>
                    );
                })()}
            </div>
        </div>
    );
}