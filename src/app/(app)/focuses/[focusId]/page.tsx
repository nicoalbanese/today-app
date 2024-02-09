import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getFocusById } from "@/lib/api/focuses/queries";
import OptimisticFocus from "./OptimisticFocus";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function FocusPage({
  params,
}: {
  params: { focusId: string };
}) {

  return (
    <main className="overflow-auto">
      <Focus id={params.focusId} />
    </main>
  );
}

const Focus = async ({ id }: { id: string }) => {
  await checkAuth();

  const { focus } = await getFocusById(id);
  

  if (!focus) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="focuses" />
        <OptimisticFocus focus={focus}  />
      </div>
    </Suspense>
  );
};
