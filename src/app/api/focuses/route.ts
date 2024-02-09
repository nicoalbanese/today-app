import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  createFocus,
  deleteFocus,
  updateFocus,
} from "@/lib/api/focuses/mutations";
import { 
  focusIdSchema,
  insertFocusParams,
  updateFocusParams 
} from "@/lib/db/schema/focuses";

export async function POST(req: Request) {
  try {
    const validatedData = insertFocusParams.parse(await req.json());
    const { focus } = await createFocus(validatedData);

    revalidatePath("/focuses"); // optional - assumes you will have named route same as entity

    return NextResponse.json(focus, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: err }, { status: 500 });
    }
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedData = updateFocusParams.parse(await req.json());
    const validatedParams = focusIdSchema.parse({ id });

    const { focus } = await updateFocus(validatedParams.id, validatedData);

    return NextResponse.json(focus, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const validatedParams = focusIdSchema.parse({ id });
    const { focus } = await deleteFocus(validatedParams.id);

    return NextResponse.json(focus, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    } else {
      return NextResponse.json(err, { status: 500 });
    }
  }
}
