"use client";

import React, { useState, useEffect } from "react";
import { AnimateOnScroll } from "./AnimateOnScroll";

const STORAGE_KEY = "gc_grade_last_used";

function canUseToday(): boolean {
  if (typeof window === "undefined") return true;
  const lastUsed = localStorage.getItem(STORAGE_KEY);
  if (!lastUsed) return true;
  return lastUsed !== new Date().toDateString();
}

function markUsedToday() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, new Date().toDateString());
}

function formatInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let k = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) parts.push(<span key={k++}>{remaining.slice(0, boldMatch.index)}</span>);
      parts.push(<strong key={k++} className="font-bold text-[#0F0F0F]">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }
    const codeMatch = remaining.match(/`(.+?)`/);
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) parts.push(<span key={k++}>{remaining.slice(0, codeMatch.index)}</span>);
      parts.push(<code key={k++} className="px-1.5 py-0.5 rounded bg-[#FF2D78]/8 text-[#FF2D78] text-xs font-mono">{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
      continue;
    }
    parts.push(<span key={k++}>{remaining}</span>);
    break;
  }
  return parts;
}

function renderMarkdown(md: string) {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) { elements.push(<div key={key++} className="h-2" />); continue; }
    if (/^---+$/.test(line.trim())) { elements.push(<hr key={key++} className="border-slate-200 my-4" />); continue; }

    const numMatch = line.match(/^\s*(\d+)\.\s+(.+)/);
    if (numMatch) {
      elements.push(
        <div key={key++} className="flex gap-3 mb-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">{numMatch[1]}</span>
          </div>
          <div className="flex-1 text-sm text-slate-700 leading-relaxed">{formatInline(numMatch[2])}</div>
        </div>
      );
      continue;
    }

    const bulletMatch = line.match(/^\s+[\*\-]\s+(.+)/);
    if (bulletMatch) {
      elements.push(
        <div key={key++} className="flex gap-2 ml-10 mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF2D78]/40 flex-shrink-0 mt-2" />
          <span className="text-sm text-slate-600 leading-relaxed">{formatInline(bulletMatch[1])}</span>
        </div>
      );
      continue;
    }

    elements.push(<p key={key++} className="text-sm text-slate-700 leading-relaxed mb-2">{formatInline(line)}</p>);
  }
  return elements;
}

function extractScore(text: string): string | null {
  const match = text.match(/(\d+\.?\d?)\/10/);
  return match ? match[1] : null;
}

export function AIGrading() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [canUse, setCanUse] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { setCanUse(canUseToday()); }, []);

  const handleGrade = async () => {
    if (!canUse) { setShowForm(true); return; }
    if (text.trim().length < 10) return;

    setLoading(true);
    setResult("");

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch("/api/grade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = await res.json();

        if (res.status === 429 || (data.error && data.error.includes("429"))) {
          if (attempt < 2) { await new Promise((r) => setTimeout(r, 4000)); continue; }
        }

        if (data.error) { setResult(data.error); }
        else { setResult(data.result); markUsedToday(); setCanUse(false); }
        break;
      } catch {
        if (attempt === 2) setResult("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        else await new Promise((r) => setTimeout(r, 3000));
      }
    }
    setLoading(false);
  };

  const score = result ? extractScore(result) : null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF2D78]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll direction="up">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF2D78]/10 border border-[#FF2D78]/20 mb-5">
              <span className="text-sm font-semibold text-[#FF2D78]">AI Chấm bài miễn phí</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F0F0F] mb-5">
              Thử sức với{" "}
              <span className="gradient-text">giảng viên AI</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Nhập vào bài viết tiếng Đức của bạn, AI giảng viên sẽ chấm điểm và nhận xét chi tiết. Miễn phí 1 lần / ngày!
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll direction="up" delay={200}>
          {showForm ? (
            <div className="bg-gradient-to-br from-[#FFF5F8] to-white rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#0F0F0F] mb-3">Bạn đã sử dụng lượt miễn phí hôm nay</h3>
              <p className="text-slate-600 mb-6">Đăng ký để nhận quyền chấm bài không giới hạn cùng giảng viên thật tại Lingua German!</p>
              <a href="#contact" className="inline-flex items-center gap-2 px-8 py-4 btn-gradient rounded-xl font-bold text-lg">
                Liên hệ tư vấn ngay
              </a>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#FFF5F8] to-white rounded-3xl shadow-2xl border border-slate-200 p-8 md:p-12">
              <div className="mb-6">
                <label className="block text-[#0F0F0F] font-semibold mb-3">Nhập đoạn văn tiếng Đức của bạn</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Ví dụ: Ich bin ein Student und ich lerne Deutsch seit zwei Monaten. Ich finde die Sprache sehr interessant..."
                  rows={6}
                  className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-[#FF2D78] focus:outline-none focus:ring-4 focus:ring-[#FF2D78]/10 transition-all bg-white resize-none text-sm leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-slate-400">{text.length} ký tự</p>
                  <p className="text-xs text-[#FF2D78] font-medium">{canUse ? "1 lượt miễn phí / ngày" : "Hết lượt"}</p>
                </div>
              </div>

              <button
                onClick={handleGrade}
                disabled={loading || text.trim().length < 10}
                className={`w-full px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${
                  loading || text.trim().length < 10 ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "btn-gradient"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang chấm bài...
                  </>
                ) : (
                  "Chấm bài ngay"
                )}
              </button>

              {result && (
                <div className="mt-8 space-y-4">
                  {score && (
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] text-white text-center shadow-xl">
                      <p className="text-sm text-white/70 mb-1 uppercase tracking-wider font-medium">Điểm số của bạn</p>
                      <p className="text-5xl font-black">{score}<span className="text-2xl text-white/60">/10</span></p>
                    </div>
                  )}

                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-lg max-h-[600px] overflow-y-auto">
                    <h4 className="text-lg font-bold text-[#0F0F0F] mb-5 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      Nhận xét chi tiết từ giảng viên AI
                    </h4>
                    <div className="space-y-1">{renderMarkdown(result)}</div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FFF5F8] border border-[#FF2D78]/10 text-center">
                    <p className="text-sm text-slate-600 mb-3">Muốn được chấm bài chi tiết hơn cùng giảng viên thật?</p>
                    <a href="#contact" className="inline-flex items-center gap-2 px-6 py-2.5 btn-gradient rounded-lg text-sm font-bold">
                      Đăng ký tư vấn miễn phí
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </AnimateOnScroll>
      </div>
    </section>
  );
}
