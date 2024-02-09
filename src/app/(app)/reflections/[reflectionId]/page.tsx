import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getReflectionById } from "@/lib/api/reflections/queries";
import OptimisticReflection from "./OptimisticReflection";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function ReflectionPage({
  params,
}: {
  params: { reflectionId: string };
}) {

  return (
    <main className="overflow-auto">
      <Reflection id={params.reflectionId} />
    </main>
  );
}

const Reflection = async ({ id }: { id: string }) => {
  await checkAuth();

  const { reflection } = await getReflectionById(id);
  

  if (!reflection) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="reflections" />
        <OptimisticReflection reflection={reflection}  />
      </div>
    </Suspense>
  );
};
