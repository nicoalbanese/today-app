import { db } from "@/lib/db/index";
import { eq, and, sql } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type FocusId, focusIdSchema, focuses } from "@/lib/db/schema/focuses";

export const getFocuses = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select()
    .from(focuses)
    .where(eq(focuses.userId, session?.user.id!));
  const f = rows;
  return { focuses: f };
};

export const getFocusById = async (id: FocusId) => {
  const { session } = await getUserAuth();
  const { id: focusId } = focusIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(focuses)
    .where(and(eq(focuses.id, focusId), eq(focuses.userId, session?.user.id!)));
  if (row === undefined) return {};
  const f = row;
  return { focus: f };
};

export const getTodaysFocus = async () => {
  const { session } = await getUserAuth();

  const [row] = await db
    .select()
    .from(focuses)
    .where(
      and(
        eq(sql`focuses.created_at::date`, sql`CURRENT_DATE`),
        eq(focuses.userId, session?.user.id!),
      ),
    );
  if (row === undefined) return {};
  const f = row;
  return { focus: f };
};
