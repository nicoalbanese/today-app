
import { type Focus, type CompleteFocus } from "@/lib/db/schema/focuses";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Focus>) => void;

export const useOptimisticFocuses = (
  focuses: CompleteFocus[],
  
) => {
  const [optimisticFocuses, addOptimisticFocus] = useOptimistic(
    focuses,
    (
      currentState: CompleteFocus[],
      action: OptimisticAction<Focus>,
    ): CompleteFocus[] => {
      const { data } = action;

      

      const optimisticFocus = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticFocus]
            : [...currentState, optimisticFocus];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticFocus } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticFocus, optimisticFocuses };
};
