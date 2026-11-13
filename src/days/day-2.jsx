import { DayLayout } from "@/components/day-layout";
import { DayForm } from "@/components/day-form";
import { content } from "./content";

const { title, questions } = content[2];

export default function Day2() {
  return (
    <DayLayout title={title} image="/images/day-2.jpg">
      <DayForm day={2} questions={questions} />
    </DayLayout>
  );
}
