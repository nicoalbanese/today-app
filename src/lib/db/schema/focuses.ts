import { sql } from "drizzle-orm";
import {
  text,
  boolean,
  varchar,
  timestamp,
  pgTable,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { type getFocuses } from "@/lib/api/focuses/queries";

import { nanoid, timestamps } from "@/lib/utils";

export const focuses = pgTable("focuses", {
  id: varchar("id", { length: 191 })
    .primaryKey()
    .$defaultFn(() => nanoid()),
  content: text("content").notNull(),
  completed: boolean("completed").notNull().default(false),
  userId: varchar("user_id", { length: 256 }).notNull(),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

// Schema for focuses - used to validate API requests
const baseSchema = createSelectSchema(focuses).omit(timestamps);

export const insertFocusSchema = createInsertSchema(focuses).omit(timestamps);
export const insertFocusParams = baseSchema
  .extend({
    completed: z.coerce.boolean(),
  })
  .omit({
    id: true,
    userId: true,
  });

export const updateFocusSchema = baseSchema;
export const updateFocusParams = baseSchema
  .extend({
    completed: z.coerce.boolean(),
  })
  .omit({
    userId: true,
  });
export const focusIdSchema = baseSchema.pick({ id: true });

// Types for focuses - used to type API request params and within Components
export type Focus = typeof focuses.$inferSelect;
export type NewFocus = z.infer<typeof insertFocusSchema>;
export type NewFocusParams = z.infer<typeof insertFocusParams>;
export type UpdateFocusParams = z.infer<typeof updateFocusParams>;
export type FocusId = z.infer<typeof focusIdSchema>["id"];

// this type infers the return from getFocuses() - meaning it will include any joins
export type CompleteFocus = Awaited<
  ReturnType<typeof getFocuses>
>["focuses"][number];
