import { DayLayout } from "@/components/day-layout";
import { DayForm } from "@/components/day-form";
import { questions } from "./questions";

export default function Day1() {
  return (
    <DayLayout title="День 1" image="/images/day-1.jpg">
      <DayForm day={1} questions={questions[1]} />
    </DayLayout>
  );
}
