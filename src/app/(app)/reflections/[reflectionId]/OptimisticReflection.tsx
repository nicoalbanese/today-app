"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/reflections/useOptimisticReflections";
import { type Reflection } from "@/lib/db/schema/reflections";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import ReflectionForm from "@/components/reflections/ReflectionForm";


export default function OptimisticReflection({ 
  reflection,
   
}: { 
  reflection: Reflection; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Reflection) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticReflection, setOptimisticReflection] = useOptimistic(reflection);
  const updateReflection: TAddOptimistic = (input) =>
    setOptimisticReflection({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <ReflectionForm
          reflection={reflection}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateReflection}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{reflection.content}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticReflection.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticReflection, null, 2)}
      </pre>
    </div>
  );
}
