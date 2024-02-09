import { db } from "@/lib/db/index";
import { eq, and, sql } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import {
  type ReflectionId,
  reflectionIdSchema,
  reflections,
} from "@/lib/db/schema/reflections";

export const getReflections = async () => {
  const { session } = await getUserAuth();
  const rows = await db
    .select()
    .from(reflections)
    .where(eq(reflections.userId, session?.user.id!));
  const r = rows;
  return { reflections: r };
};

export const getReflectionById = async (id: ReflectionId) => {
  const { session } = await getUserAuth();
  const { id: reflectionId } = reflectionIdSchema.parse({ id });
  const [row] = await db
    .select()
    .from(reflections)
    .where(
      and(
        eq(reflections.id, reflectionId),
        eq(reflections.userId, session?.user.id!),
      ),
    );
  if (row === undefined) return {};
  const r = row;
  return { reflection: r };
};

export const getTodaysReflection = async () => {
  const { session } = await getUserAuth();

  const [row] = await db
    .select()
    .from(reflections)
    .where(
      and(
        eq(sql`reflections.created_at::date`, sql`CURRENT_DATE`),
        eq(reflections.userId, session?.user.id!),
      ),
    );
  if (row === undefined) return {};
  const f = row;
  return { reflection: f };
};
