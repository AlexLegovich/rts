import { NextResponse } from "next/server";
import { questions } from "@/days/questions";

const TELEGRAM_LIMIT = 4096; // максимальная длина одного сообщения в Telegram

// Telegram с parse_mode=HTML требует экранировать <, > и &.
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Длинные ответы режем на несколько сообщений, не разрывая блоки «вопрос — ответ».
function splitMessage(blocks) {
  const messages = [];
  let current = "";
  for (const block of blocks) {
    const piece = current ? `\n\n${block}` : block;
    if (current && current.length + piece.length > TELEGRAM_LIMIT) {
      messages.push(current);
      current = block;
    } else {
      current += piece;
    }
  }
  if (current) messages.push(current);
  // Если один блок сам длиннее лимита — режем его грубо.
  return messages.flatMap((m) =>
    m.length <= TELEGRAM_LIMIT ? [m] : m.match(new RegExp(`[\\s\\S]{1,${TELEGRAM_LIMIT}}`, "g"))
  );
}

export async function POST(req) {
  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const day = Number(payload.day);
  const dayQuestions = questions[day];
  if (!dayQuestions) {
    return NextResponse.json({ ok: false, error: "unknown_day" }, { status: 400 });
  }

  const answers = Array.isArray(payload.answers) ? payload.answers : [];
  const telegram = String(payload.telegram ?? "").trim();
  if (!telegram || dayQuestions.some((_, i) => !String(answers[i] ?? "").trim())) {
    return NextResponse.json({ ok: false, error: "missing_answers" }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не заданы в .env.local");
    return NextResponse.json({ ok: false, error: "missing_env" }, { status: 500 });
  }

  const nick = telegram.startsWith("@") ? telegram : `@${telegram}`;
  const date = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" });

  const blocks = [
    `<b>Потерянная душа: возвращение к себе — День ${day}</b>\n${escapeHtml(nick)} · ${date}`,
    ...dayQuestions.map(
      (q, i) => `<b>${escapeHtml(q)}</b>\n${escapeHtml(String(answers[i]).trim())}`
    ),
  ];

  for (const text of splitMessage(blocks)) {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    if (!res.ok) {
      console.error("Telegram error:", res.status, await res.text());
      return NextResponse.json({ ok: false, error: "telegram_error" }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
