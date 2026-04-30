"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { AnimateOnScroll } from "./AnimateOnScroll";
import { SafeImage } from "./SafeImage";
import type { AusbildungContent } from "@/types/site-content";

interface AusbildungProps {
  content: AusbildungContent;
}

export function Ausbildung({ content }: AusbildungProps) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="ausbildung" className="relative py-24 overflow-hidden">
      {/* Background — pure black */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#000000] via-[#0a0a0a] to-[#050505]" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-[#FF2D78]/6 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#FF6B9D]/5 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/4" />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <AnimateOnScroll direction="up">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-5">
              <span className="text-sm font-semibold text-[#FF6B9D]">{content.badgeText}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
              {content.title}{" "}
              <span className="bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] bg-clip-text text-transparent">
                {content.highlightedTitle}
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {content.description}
            </p>
          </div>
        </AnimateOnScroll>

        {/* Main content: Image + Steps */}
        <AnimateOnScroll direction="up" delay={200}>
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">

            {/* Left: Hero images with overlap effect */}
            <div className="relative">
              <div
                className="relative rounded-3xl overflow-hidden h-[420px] shadow-2xl shadow-black/30"
                style={{ transform: "rotate(-2deg)" }}
              >
                <SafeImage
                  src={content.heroImage}
                  alt={content.heroImageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              {/* Overlapping secondary image */}
              <div
                className="absolute -bottom-6 -right-4 w-[200px] h-[140px] rounded-2xl overflow-hidden shadow-xl border-4 border-black"
                style={{ transform: "rotate(3deg)" }}
              >
                <SafeImage
                  src={content.secondaryImage}
                  alt={content.secondaryImageAlt}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </div>
              {/* Floating stat badge */}
              <div className="absolute top-6 -left-2 sm:-left-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 p-4 shadow-lg">
                <p className="text-2xl font-bold text-white">{content.stats[0]?.value}</p>
                <p className="text-xs text-slate-400">{content.stats[0]?.label}</p>
              </div>
            </div>

            {/* Right: Steps timeline */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  📋
                </div>
                Quy trình du học nghề
              </h3>
              {content.steps.map((step, index) => (
                <div
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`group relative flex gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-500 ${
                    activeStep === index
                      ? "bg-gradient-to-r from-[#FF2D78]/15 to-[#FF6B9D]/10 border border-[#FF2D78]/30 shadow-lg shadow-[#FF2D78]/10"
                      : "bg-white/5 border border-white/5 hover:bg-white/8 hover:border-white/10"
                  }`}
                >
                  {/* Step number */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                      activeStep === index
                        ? "bg-gradient-to-br from-[#FF2D78] to-[#FF6B9D] text-white shadow-lg shadow-[#FF2D78]/30"
                        : "bg-white/10 text-slate-400 group-hover:bg-white/15"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold mb-1 transition-colors duration-300 ${
                      activeStep === index ? "text-white" : "text-slate-300"
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm leading-relaxed transition-all duration-500 ${
                      activeStep === index ? "text-slate-300 max-h-20 opacity-100" : "text-slate-500 max-h-0 opacity-0 overflow-hidden"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  <ChevronRight className={`w-5 h-5 flex-shrink-0 mt-3 transition-all duration-300 ${
                    activeStep === index ? "text-[#FF2D78] translate-x-1" : "text-slate-600"
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        {/* Benefits grid */}
        <AnimateOnScroll direction="up" delay={300}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {content.benefits.map((benefit, index) => (
              <div
                key={index}
                className="group relative p-6 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/10 hover:border-[#FF2D78]/20 transition-all duration-500 hover:-translate-y-1"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="text-3xl mb-4">{benefit.emoji}</div>
                <h4 className="text-white font-bold mb-2">{benefit.title}</h4>
                <p className="text-sm text-slate-400 leading-relaxed">{benefit.description}</p>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF2D78]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        </AnimateOnScroll>

        {/* Stats bar */}
        <AnimateOnScroll direction="up" delay={400}>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-16">
            {content.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </AnimateOnScroll>

        {/* CTA */}
        <AnimateOnScroll direction="up" delay={500}>
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFF5F0] via-[#FFF0F3] to-[#FFE8EF]" />
            <div className="absolute inset-0 bg-[url('/images/ausbildung/germany.png')] bg-cover bg-center opacity-[0.06]" />
            <div className="relative px-8 py-12 sm:px-12 sm:py-16 text-center">
              <h3 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-4">
                {content.ctaTitle}
              </h3>
              <p className="text-[#555] max-w-2xl mx-auto mb-8 leading-relaxed">
                {content.ctaDescription}
              </p>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF2D78] to-[#FF6B9D] text-white font-bold text-sm hover:shadow-2xl hover:shadow-[#FF2D78]/25 hover:-translate-y-1 transition-all duration-300"
              >
                {content.ctaButtonText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
