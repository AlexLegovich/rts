"use client";

import { useEffect, useRef, useState } from "react";
import { Success } from "@/components/success";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const fieldClass = "rounded-md border-zarya-input bg-zarya-white shadow-none md:text-[15px]";

// Сколько дней после отправки форма закрыта (ответы хранятся в браузере).
const LOCK_DAYS = 30;
const LOCK_MS = LOCK_DAYS * 24 * 60 * 60 * 1000;

const storageKey = (day) => `zarya:day-${day}`;

// Читаем сохранённую отправку. null — если её нет, она устарела или хранилище недоступно.
function loadSubmission(day) {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(day)));
    if (!saved?.submittedAt || Date.now() - saved.submittedAt > LOCK_MS) {
      localStorage.removeItem(storageKey(day));
      return null;
    }
    return saved;
  } catch {
    return null;
  }
}

function saveSubmission(day, submission) {
  try {
    localStorage.setItem(storageKey(day), JSON.stringify(submission));
  } catch {
    // приватный режим / хранилище отключено — просто не запоминаем
  }
}

// Форма дня: список вопросов + ник в Telegram + кнопка «Отправить».
// После отправки ответы сохраняются в браузере, и 30 дней вместо формы
// показывается экран успеха «Вы прошли день» с ответами — и сразу, и при повторном заходе.
export function DayForm({
  day,
  questions,
  successTitle = `Вы прошли День ${day}`,
  successText = "Ваши ответы отправлены. Благодарим, что уделили время себе.",
}) {
  // checking — ещё не прочитали localStorage (ничего не показываем, чтобы форма не мигала)
  // idle | sending | error — форма; done — день пройден (экран успеха)
  const [status, setStatus] = useState("checking");
  const [justSent, setJustSent] = useState(false);
  const [submission, setSubmission] = useState(null);
  const rootRef = useRef(null);

  useEffect(() => {
    const saved = loadSubmission(day);
    setSubmission(saved);
    setStatus(saved ? "done" : "idle");
  }, [day]);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const answers = questions.map((_, i) => form.get(`q${i + 1}`));
    const telegram = form.get("telegram");
    setStatus("sending");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, answers, telegram }),
      });
      if (!res.ok) throw new Error();

      const saved = { submittedAt: Date.now(), questions, answers, telegram };
      saveSubmission(day, saved);
      setSubmission(saved);
      setJustSent(true);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  // На мобильном форма длинная — после отправки поднимаемся к сообщению.
  useEffect(() => {
    if (justSent) {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [justSent]);

  if (status === "checking") {
    return <div className="min-h-96" aria-busy="true" />;
  }

  if (status === "done") {
    return (
      <div ref={rootRef} className="scroll-mt-8 py-8">
        <Success title={successTitle} description={successText} />
        {submission && <Answers submission={submission} />}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup className="gap-6">
        {questions.map((question, i) => (
          <Field key={i} className="gap-3">
            <FieldLabel htmlFor={`q${i + 1}`} className="text-[15px] font-medium">
              {question}
            </FieldLabel>
            <Textarea id={`q${i + 1}`} name={`q${i + 1}`} required className={`min-h-20 ${fieldClass}`} />
          </Field>
        ))}

        <Field className="gap-3">
          <FieldLabel htmlFor="telegram" className="text-[15px] font-medium">
            Ваш ник в Telegram
          </FieldLabel>
          <Input id="telegram" name="telegram" placeholder="@zarya" required className={`h-10 ${fieldClass}`} />
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 h-11 w-full rounded-full px-5 text-[15px] lg:w-auto"
      >
        {status === "sending" ? "Отправляем…" : "Отправить"}
      </Button>

      {status === "error" && (
        <p role="alert" className="mt-4 text-[15px] text-destructive">
          Не получилось отправить ответы. Проверьте интернет и попробуйте ещё раз — всё, что вы написали, сохранилось.
        </p>
      )}
    </form>
  );
}

// Сохранённые ответы — только для чтения.
function Answers({ submission }) {
  const date = new Date(submission.submittedAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className="mt-10 flex flex-col gap-6 text-left">
      <p className="text-xs font-medium uppercase tracking-wide text-zarya-dark-500">
        Отправлено {date}
      </p>
      {submission.questions.map((question, i) => (
        <div key={i} className="flex flex-col gap-2">
          <p className="text-[15px] font-medium">{question}</p>
          <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-zarya-dark-500">
            {submission.answers[i]}
          </p>
        </div>
      ))}
    </div>
  );
}
