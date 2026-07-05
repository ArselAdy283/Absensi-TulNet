"use server";

import { db } from "@/db";
import { users, sessions, attendance } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

// USERS ACTIONS
export async function getUsers() {
  try {
    return await db.select().from(users).orderBy(users.name);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export async function createUser(name: string, nisn: string) {
  try {
    await db.insert(users).values({ name, nisn });
    revalidatePath("/tabel");
    revalidatePath("/absen");
    return { success: true };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Gagal menambahkan user" };
  }
}

export async function updateUser(id: number, name: string, nisn: string) {
  try {
    await db.update(users).set({ name, nisn }).where(eq(users.id, id));
    revalidatePath("/siswa");
    revalidatePath("/tabel");
    revalidatePath("/absen");
    return { success: true };
  } catch (error) {
    console.error("Failed to update user:", error);
    return { success: false, error: "Gagal memperbarui user" };
  }
}

export async function deleteUser(id: number) {
  try {
    const relatedAttendances = await db.select().from(attendance).where(eq(attendance.userId, id));
    
    for (const record of relatedAttendances) {
      if (record.photo) {
        try {
          const photoPath = path.join(process.cwd(), "public", record.photo);
          await fs.unlink(photoPath);
        } catch (err) {
          console.error("Failed to delete photo file:", err);
        }
      }
    }

    await db.delete(attendance).where(eq(attendance.userId, id));
    await db.delete(users).where(eq(users.id, id));
    
    revalidatePath("/siswa");
    revalidatePath("/tabel");
    revalidatePath("/absen");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "Gagal menghapus user" };
  }
}

// SESSIONS ACTIONS
export async function getSessions() {
  try {
    return await db.select().from(sessions).orderBy(desc(sessions.date));
  } catch (error) {
    console.error("Failed to fetch sessions:", error);
    return [];
  }
}

export async function createSession(dateStr: string, time: string) {
  try {
    const date = new Date(dateStr);
    await db.insert(sessions).values({ date, time });
    revalidatePath("/sesi");
    revalidatePath("/absen");
    return { success: true };
  } catch (error) {
    console.error("Failed to create session:", error);
    return { success: false, error: "Gagal membuat sesi" };
  }
}

export async function deleteSession(id: number) {
  try {
    const relatedAttendances = await db.select().from(attendance).where(eq(attendance.sessionId, id));
    
    for (const record of relatedAttendances) {
      if (record.photo) {
        try {
          const photoPath = path.join(process.cwd(), "public", record.photo);
          await fs.unlink(photoPath);
        } catch (err) {
          console.error("Failed to delete photo file:", err);
        }
      }
    }

    await db.delete(attendance).where(eq(attendance.sessionId, id));
    await db.delete(sessions).where(eq(sessions.id, id));
    
    revalidatePath("/sesi");
    revalidatePath("/tabel");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete session:", error);
    return { success: false, error: "Gagal menghapus sesi" };
  }
}

// ATTENDANCE ACTIONS
export async function getAttendances() {
  try {
    const allUsers = await db.select().from(users).orderBy(users.name);
    const allAttendances = await db.select().from(attendance);
    
    return {
        users: allUsers,
        attendances: allAttendances
    };
  } catch (error) {
    console.error("Failed to fetch attendances:", error);
    return { users: [], attendances: [] };
  }
}

export async function createAttendance(data: {
  userId: number;
  sessionId: number;
  photoBase64: string;
  latitude: number;
  longitude: number;
  address: string | null;
}) {
  try {
    // 1. Save photo to /public/uploads
    const base64Data = data.photoBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    
    const fileName = `attendance-${data.userId}-${Date.now()}.png`;
    const filePath = path.join(uploadsDir, fileName);
    
    await fs.writeFile(filePath, buffer);
    const photoUrl = `/uploads/${fileName}`;

    // 2. Insert to database
    await db.insert(attendance).values({
      userId: data.userId,
      sessionId: data.sessionId,
      photo: photoUrl,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
    });

    revalidatePath("/tabel");
    return { success: true };
  } catch (error) {
    console.error("Failed to submit attendance:", error);
    return { success: false, error: "Gagal melakukan absensi" };
  }
}
