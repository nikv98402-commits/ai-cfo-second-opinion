"use client";

import { FormEvent, useMemo, useState } from "react";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const starterPrompts = [
  "Скидка 12% в канале B безопасна?",
  "Почему прибыль есть, а cash падает?",
  "Кого нанимать первым: CFO, казначея или FP&A?"
];

export function OwnerAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Я AI-CFO second opinion. Могу проверить управленческое решение, объяснить риск ликвидности, скидки, CAPEX или подсказать, какого финансиста нанимать следующим."
    }
  ]);
  const [input, setInput] = useState("Стоит ли нам останавливать скидку 12% в канале B?");
  const [isLoading, setIsLoading] = useState(false);
  const [runtime, setRuntime] = useState("Qwen3-ready / mock fallback");

  const canSubmit = useMemo(() => input.trim().length > 1 && !isLoading, [input, isLoading]);

  async function submitChat(messageOverride?: string) {
    const message = (messageOverride ?? input).trim();
    if (!message || isLoading) return;

    const nextMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages.slice(-6)
        })
      });
      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.details || json.error || "AI request failed");
      }

      setRuntime(`${json.provider} · ${json.model}`);
      setMessages([...nextMessages, { role: "assistant", content: json.answer }]);
    } catch (error) {
      const details = error instanceof Error ? error.message : "Неизвестная ошибка";
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: `AI endpoint сейчас не ответил: ${details}. Финансовый движок и mock-режим остаются доступны для демо.`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) void submitChat();
  }

  return (
    <article className="panel ai-chat-panel">
      <div className="panel-head">
        <div>
          <h2>Диалоговый AI second opinion</h2>
          <p>Qwen3 через llama.cpp/vLLM · расчеты остаются в deterministic finance engine</p>
        </div>
        <span className="label info">{runtime}</span>
      </div>
      <div className="chat-body">
        <div className="chat-messages" aria-live="polite">
          {messages.map((message, index) => (
            <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
              <span>{message.role === "assistant" ? "AI-CFO" : "CEO"}</span>
              <p>{message.content}</p>
            </div>
          ))}
          {isLoading ? (
            <div className="chat-message assistant">
              <span>AI-CFO</span>
              <p>Проверяю контекст, evidence layer и управленческий риск...</p>
            </div>
          ) : null}
        </div>

        <div className="prompt-row">
          {starterPrompts.map((prompt) => (
            <button type="button" className="prompt-chip" key={prompt} onClick={() => void submitChat(prompt)}>
              {prompt}
            </button>
          ))}
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <textarea
            aria-label="Вопрос для AI-CFO"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Опишите решение: скидка, CAPEX, долг, кассовый разрыв, найм финансиста..."
            rows={3}
          />
          <button className="primary" disabled={!canSubmit} type="submit">
            Спросить AI
          </button>
        </form>
      </div>
    </article>
  );
}
