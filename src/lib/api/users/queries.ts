import { getUserAuth } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/auth";
import { eq } from "drizzle-orm";

export const getUser = async () => {
  const { session } = await getUserAuth();
  const [user] = await db
    .select({ user: users })
    .from(users)
    .where(eq(users.id, session?.user.id ?? ""));
  return user;
};

export const updateUser = async ({ birthday }: { birthday: Date }) => {
  const { session } = await getUserAuth();
  console.log(birthday);
  const [user] = await db
    .update(users)
    .set({ birthday: birthday.toISOString() })
    .where(eq(users.id, session?.user.id ?? ""))
    .returning();
  return user;
};
