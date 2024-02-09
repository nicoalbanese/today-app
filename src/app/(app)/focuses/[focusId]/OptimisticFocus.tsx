"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/focuses/useOptimisticFocuses";
import { type Focus } from "@/lib/db/schema/focuses";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import FocusForm from "@/components/focuses/FocusForm";


export default function OptimisticFocus({ 
  focus,
   
}: { 
  focus: Focus; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Focus) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticFocus, setOptimisticFocus] = useOptimistic(focus);
  const updateFocus: TAddOptimistic = (input) =>
    setOptimisticFocus({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <FocusForm
          focus={focus}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateFocus}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{focus.content}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticFocus.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticFocus, null, 2)}
      </pre>
    </div>
  );
}
