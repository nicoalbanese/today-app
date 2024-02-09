"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Focus, CompleteFocus } from "@/lib/db/schema/focuses";
import Modal from "@/components/shared/Modal";

import { useOptimisticFocuses } from "@/app/(app)/focuses/useOptimisticFocuses";
import { Button } from "@/components/ui/button";
import FocusForm from "./FocusForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (focus?: Focus) => void;

export default function FocusList({
  focuses,
   
}: {
  focuses: CompleteFocus[];
   
}) {
  const { optimisticFocuses, addOptimisticFocus } = useOptimisticFocuses(
    focuses,
     
  );
  const [open, setOpen] = useState(false);
  const [activeFocus, setActiveFocus] = useState<Focus | null>(null);
  const openModal = (focus?: Focus) => {
    setOpen(true);
    focus ? setActiveFocus(focus) : setActiveFocus(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeFocus ? "Edit Focus" : "Create Focus"}
      >
        <FocusForm
          focus={activeFocus}
          addOptimistic={addOptimisticFocus}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticFocuses.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticFocuses.map((focus) => (
            <Focus
              focus={focus}
              key={focus.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Focus = ({
  focus,
  openModal,
}: {
  focus: CompleteFocus;
  openModal: TOpenModal;
}) => {
  const optimistic = focus.id === "optimistic";
  const deleting = focus.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("focuses")
    ? pathname
    : pathname + "/focuses/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{focus.content}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + focus.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No focuses
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new focus.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Focuses </Button>
      </div>
    </div>
  );
};
