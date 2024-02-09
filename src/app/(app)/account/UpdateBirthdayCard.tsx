import { AccountCard, AccountCardFooter, AccountCardBody } from "./AccountCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthSession } from "@/lib/auth/utils";

export default async function UpdateBirthdayCard({
  session,
}: {
  session: AuthSession["session"];
}) {
  const handleSubmit = async (data: FormData) => {
    "use server";
    const { name } = Object.fromEntries(data.entries()) as { name: string };
  };

  return (
    <AccountCard
      params={{
        header: "Your Birthday",
        description: "Please enter in your birthday",
      }}
    >
      <form action={handleSubmit}>
        <AccountCardBody>
          <Input defaultValue={"" ?? ""} name="name" />
        </AccountCardBody>
        <AccountCardFooter description="64 characters maximum">
          <Button>Update Name</Button>
        </AccountCardFooter>
      </form>
    </AccountCard>
  );
}
