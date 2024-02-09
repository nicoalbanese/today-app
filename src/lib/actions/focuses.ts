"use server";

import { revalidatePath } from "next/cache";
import {
  createFocus,
  deleteFocus,
  updateFocus,
} from "@/lib/api/focuses/mutations";
import {
  FocusId,
  NewFocusParams,
  UpdateFocusParams,
  focusIdSchema,
  insertFocusParams,
  updateFocusParams,
} from "@/lib/db/schema/focuses";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateFocuses = () => revalidatePath("/focuses");

export const createFocusAction = async (input: NewFocusParams) => {
  try {
    const payload = insertFocusParams.parse(input);
    await createFocus(payload);
    revalidateFocuses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateFocusAction = async (input: UpdateFocusParams) => {
  try {
    const payload = updateFocusParams.parse(input);
    await updateFocus(payload.id, payload);
    revalidateFocuses();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteFocusAction = async (input: FocusId) => {
  try {
    const payload = focusIdSchema.parse({ id: input });
    await deleteFocus(payload.id);
    revalidateFocuses();
  } catch (e) {
    return handleErrors(e);
  }
};