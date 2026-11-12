import { DayLayout } from "@/components/day-layout";
import { DayForm } from "@/components/day-form";
import { questions } from "./questions";

export default function Day2() {
  return (
    <DayLayout title="День 2" image="/images/day-2.jpg">
      <DayForm day={2} questions={questions[2]} />
    </DayLayout>
  );
}
