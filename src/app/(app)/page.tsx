import AuthForm from "@/components/auth/Form";
import { getUser, updateUser } from "@/lib/api/users/queries";
import { getUserAuth } from "@/lib/auth/utils";

export default async function Home() {
  const { user } = await getUser();
  const ageInDays = Math.ceil(
    (new Date().getTime() - new Date(user?.birthday ?? "").getTime()) /
      (1000 * 60 * 60 * 24),
  );
  const timeBefore7pm =
    new Date(new Date().setHours(19, 0, 0)).getTime() - new Date().getTime();

  // Convert the time from milliseconds to minutes
  const totalMinutes = Math.floor(timeBefore7pm / (1000 * 60));

  // Get the hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Create the formatted time string
  const timeString =
    hours < 0 && minutes < 0 ? "0hr 0min" : `${hours}hr ${minutes}min`;

  return (
    <main className="">
      <h1 className="text-2xl font-bold my-2">
        Hey {user?.name?.split(" ")[0] ?? ""} 👋🏻
      </h1>
      <div className="space-y-4">
        <p>
          Today is your{" "}
          <span className="font-bold">{ageInDays.toLocaleString()}th</span> day
          on this earth.
        </p>
        <p>You will only be able to live this day once, so make it count. </p>
        <p>
          You still have <span>{timeString} minutes left.</span>
        </p>
      </div>
      <div></div>
    </main>
  );
}
