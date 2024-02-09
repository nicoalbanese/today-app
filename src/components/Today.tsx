"use client";
import { Focus } from "@/lib/db/schema/focuses";
import { Button } from "./ui/button";
import { Check, CheckCircleIcon } from "lucide-react";
import { updateFocusAction } from "@/lib/actions/focuses";

export default function Today({ focus }: { focus: Focus }) {
  return (
    <div className="bg-muted text-popover-foreground p-4 rounded-lg">
      <h3 className="font-bold text-lg">Today&apos;s Buoy ⛵</h3>
      <div className="flex justify-between items-center">
        <p className={focus.completed ? "line-through" : ""}>{focus.content}</p>
        <Button
          variant={"ghost"}
          onClick={() => updateFocusAction({ ...focus, completed: true })}
          disabled={focus.completed}
        >
          <CheckCircleIcon />
        </Button>
      </div>
      {focus.completed ? <p className="my-2">Nice work! You did it.</p> : null}
    </div>
  );
}
