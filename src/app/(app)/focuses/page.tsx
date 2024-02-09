import { Suspense } from "react";

import Loading from "@/app/loading";
import FocusList from "@/components/focuses/FocusList";
import { getFocuses } from "@/lib/api/focuses/queries";

import { checkAuth } from "@/lib/auth/utils";

export const revalidate = 0;

export default async function FocusesPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">Focuses</h1>
        </div>
        <Focuses />
      </div>
    </main>
  );
}

const Focuses = async () => {
  await checkAuth();

  const { focuses } = await getFocuses();
  
  return (
    <Suspense fallback={<Loading />}>
      <FocusList focuses={focuses}  />
    </Suspense>
  );
};
