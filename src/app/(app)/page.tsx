import ReflectionTaker from "@/components/ReflectionTaker";
import Today from "@/components/Today";
import FocusForm from "@/components/focuses/FocusForm";
import ReflectionForm from "@/components/reflections/ReflectionForm";
import { getTodaysFocus } from "@/lib/api/focuses/queries";
import { getUser } from "@/lib/api/users/queries";

export default async function Home() {
  const { user } = await getUser();
  const { focus } = await getTodaysFocus();
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
  const endOfDay = hours < 0 && minutes < 0;
  const timeString = endOfDay ? "0hr 0min" : `${hours}hr ${minutes}min`;

  return (
    <main className="max-w-xl mx-auto pt-2 p-8 ">
      <h1 className="text-2xl font-bold my-4">
        Hey {user?.name?.split(" ")[0] ?? ""} 👋🏻
      </h1>
      <div className="space-y-4">
        <p>
          Today is your{" "}
          <span className="p-1 mx-1 bg-muted font-mono">
            {ageInDays.toLocaleString()}th
          </span>{" "}
          day on this earth.
        </p>
        <p>You will only be able to live this day once, so make it count. </p>
        <p>
          You still have{" "}
          <span className="p-1 mx-1 bg-muted font-mono">{timeString}</span>{" "}
          minutes left in the day.
        </p>
      </div>
      {endOfDay ? <ReflectionTaker /> : null}

      <div className="mt-8">
        {focus === undefined ? (
          <div className="space-y-0 border border-border p-8">
            <h3 className="font-medium text-xl mb-2">Pick a focus for today</h3>
            <FocusForm />
          </div>
        ) : (
          <Today focus={focus} />
        )}
      </div>
    </main>
  );
}
