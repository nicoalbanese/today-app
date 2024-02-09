import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  FocusId, 
  NewFocusParams,
  UpdateFocusParams, 
  updateFocusSchema,
  insertFocusSchema, 
  focuses,
  focusIdSchema 
} from "@/lib/db/schema/focuses";
import { getUserAuth } from "@/lib/auth/utils";

export const createFocus = async (focus: NewFocusParams) => {
  const { session } = await getUserAuth();
  const newFocus = insertFocusSchema.parse({ ...focus, userId: session?.user.id! });
  try {
    const [f] =  await db.insert(focuses).values(newFocus).returning();
    return { focus: f };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateFocus = async (id: FocusId, focus: UpdateFocusParams) => {
  const { session } = await getUserAuth();
  const { id: focusId } = focusIdSchema.parse({ id });
  const newFocus = updateFocusSchema.parse({ ...focus, userId: session?.user.id! });
  try {
    const [f] =  await db
     .update(focuses)
     .set({...newFocus, updatedAt: new Date() })
     .where(and(eq(focuses.id, focusId!), eq(focuses.userId, session?.user.id!)))
     .returning();
    return { focus: f };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteFocus = async (id: FocusId) => {
  const { session } = await getUserAuth();
  const { id: focusId } = focusIdSchema.parse({ id });
  try {
    const [f] =  await db.delete(focuses).where(and(eq(focuses.id, focusId!), eq(focuses.userId, session?.user.id!)))
    .returning();
    return { focus: f };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

