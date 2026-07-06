import { mysqlTable, serial, varchar, int, timestamp, double, date, time, boolean, text } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nisn: varchar("nisn", { length: 20 }).notNull().unique(),
});

export const sessions = mysqlTable("sessions", {
  id: serial("id").primaryKey(),
  date: date("date", { mode: "date" }).notNull(),
  time: time("time").notNull(),
});

export const attendance = mysqlTable("attendance", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  sessionId: int("session_id").notNull().references(() => sessions.id),
  photo: varchar("photo", { length: 255 }).notNull(), // Path to the file in /uploads or Cloudinary URL
  latitude: double("latitude").notNull(),
  longitude: double("longitude").notNull(),
  address: text("address"), // Can be null if geocoding fails
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  attendances: many(attendance),
}));

export const sessionsRelations = relations(sessions, ({ many }) => ({
  attendances: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  user: one(users, {
    fields: [attendance.userId],
    references: [users.id],
  }),
  session: one(sessions, {
    fields: [attendance.sessionId],
    references: [sessions.id],
  }),
}));
