import { DayLayout } from "@/components/day-layout";
import { DayForm } from "@/components/day-form";
import { content } from "./content";

const { title, questions } = content[1];

export default function Day1() {
  return (
    <DayLayout title={title} image="/images/day-1.jpg">
      <DayForm day={1} questions={questions} />
    </DayLayout>
  );
}
