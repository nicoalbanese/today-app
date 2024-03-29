"use client";
import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/focuses/useOptimisticFocuses";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";

import { Checkbox } from "@/components/ui/checkbox";

import { type Focus, insertFocusParams } from "@/lib/db/schema/focuses";
import {
  createFocusAction,
  deleteFocusAction,
  updateFocusAction,
} from "@/lib/actions/focuses";

const FocusForm = ({
  focus,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  focus?: Focus | null;

  openModal?: (focus?: Focus) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Focus>(insertFocusParams);
  const editing = !!focus?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("focuses");

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Focus },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`Focus ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const focusParsed = await insertFocusParams.safeParseAsync({ ...payload });
    if (!focusParsed.success) {
      setErrors(focusParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = focusParsed.data;
    const pendingFocus: Focus = {
      updatedAt: focus?.updatedAt ?? new Date(),
      createdAt: focus?.createdAt ?? new Date(),
      id: focus?.id ?? "",
      userId: focus?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingFocus,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updateFocusAction({ ...values, id: focus.id })
          : await createFocusAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingFocus,
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-4"}>
      {/* Schema fields start */}
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.content ? "text-destructive" : "",
          )}
        >
          Content
        </Label>
        <Input
          type="text"
          name="content"
          className={cn(errors?.content ? "ring ring-destructive" : "")}
          defaultValue={focus?.content ?? ""}
        />
        {errors?.content ? (
          <p className="text-xs text-destructive mt-2">{errors.content[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* <div> */}
      {/*   <Label */}
      {/*     className={cn( */}
      {/*       "mb-2 inline-block", */}
      {/*       errors?.completed ? "text-destructive" : "", */}
      {/*     )} */}
      {/*   > */}
      {/*     Completed */}
      {/*   </Label> */}
      {/*   <br /> */}
      {/*   <Checkbox */}
      {/*     defaultChecked={focus?.completed} */}
      {/*     name={"completed"} */}
      {/*     className={cn(errors?.completed ? "ring ring-destructive" : "")} */}
      {/*   /> */}
      {/*   {errors?.completed ? ( */}
      {/*     <p className="text-xs text-destructive mt-2">{errors.completed[0]}</p> */}
      {/*   ) : ( */}
      {/*     <div className="h-6" /> */}
      {/*   )} */}
      {/* </div> */}

      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: focus });
              const error = await deleteFocusAction(focus.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: focus,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default FocusForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
