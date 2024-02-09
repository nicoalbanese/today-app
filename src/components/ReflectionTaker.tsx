import { getTodaysReflection } from "@/lib/api/reflections/queries";
import ReflectionForm from "./reflections/ReflectionForm";

export default async function ReflectionTaker() {
  const { reflection } = await getTodaysReflection();
  if (reflection === undefined)
    return (
      <main className="my-8 border-border border p-8">
        <h3 className="text-xl font-medium mb-4">Record Daily Reflection</h3>
        <ReflectionForm />
      </main>
    );
  return (
    <main className="my-8 bg-green-200 dark:bg-green-800 p-8 font-mono font-bold">
      Daily Reflection submitted 😊 <br /> Get a good night sleep.
    </main>
  );
}
