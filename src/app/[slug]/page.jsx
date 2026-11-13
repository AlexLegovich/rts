import { notFound } from "next/navigation";
import { days } from "@/days";
import { content } from "@/days/content";

// "day-1" -> 1; несуществующий день -> null (404)
function parseDay(slug) {
  const match = /^day-(\d+)$/.exec(slug);
  if (!match) return null;
  const day = Number(match[1]);
  if (day < 1 || day > days.length) return null;
  return day;
}

export function generateStaticParams() {
  return days.map((_, i) => ({ slug: `day-${i + 1}` }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const n = parseDay(slug);
  return { title: n ? `${content[n]?.title ?? `День ${n}`} · ZARYA` : "ZARYA" };
}

export default async function DayPage({ params }) {
  const { slug } = await params;
  const n = parseDay(slug);
  if (!n) notFound();

  const Day = days[n - 1];
  return <Day />;
}
