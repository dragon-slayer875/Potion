import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const $notebooks = pgTable("notes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  imageUrl: text("image_url"),
  userId: text("user_id").notNull(),
  editorState: text("editor_state"),
});

export type NotebookType = typeof $notebooks.$inferInsert;
