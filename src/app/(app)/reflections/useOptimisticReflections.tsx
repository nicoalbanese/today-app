
import { type Reflection, type CompleteReflection } from "@/lib/db/schema/reflections";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Reflection>) => void;

export const useOptimisticReflections = (
  reflections: CompleteReflection[],
  
) => {
  const [optimisticReflections, addOptimisticReflection] = useOptimistic(
    reflections,
    (
      currentState: CompleteReflection[],
      action: OptimisticAction<Reflection>,
    ): CompleteReflection[] => {
      const { data } = action;

      

      const optimisticReflection = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticReflection]
            : [...currentState, optimisticReflection];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticReflection } : item,
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

  return { addOptimisticReflection, optimisticReflections };
};
