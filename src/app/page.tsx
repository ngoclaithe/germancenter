import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { AIGrading } from "@/components/AIGrading";
import { About } from "@/components/About";
import { TargetAudience } from "@/components/TargetAudience";
import { LearningRoadmap } from "@/components/LearningRoadmap";
import { Courses } from "@/components/Courses";
import { TeachingMethod } from "@/components/TeachingMethod";
import { Teachers } from "@/components/Teachers";
import { Testimonials } from "@/components/Testimonials";
import { MediaSection } from "@/components/MediaSection";
import { RegistrationForm } from "@/components/RegistrationForm";
import { CTABanner } from "@/components/CTABanner";
import { Footer } from "@/components/Footer";
import { getSiteContent } from "@/lib/site-content";

export default async function Home() {
  const content = await getSiteContent();
  const orderedSections = [...content.sections]
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  const sectionRenderer: Record<string, () => ReactNode> = {
    hero: () => <Hero content={content.hero} />,
    "social-proof": () => <SocialProof content={content.socialProof} />,
    about: () => <About content={content.about} />,
    "target-audience": () => <TargetAudience content={content.targetAudience} />,
    "learning-roadmap": () => <LearningRoadmap content={content.learningRoadmap} />,
    courses: () => <Courses content={content.courses} />,
    "teaching-method": () => <TeachingMethod content={content.teachingMethod} />,
    teachers: () => <Teachers content={content.teachers} />,
    testimonials: () => <Testimonials content={content.testimonials} />,
    media: () => <MediaSection content={content.media} />,
    registration: () => <RegistrationForm content={content.registration} />,
    cta: () => <CTABanner content={content.cta} />,
    "ai-grading": () => <AIGrading />,
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      {orderedSections.map((section) => {
        const renderSection = sectionRenderer[section.id];
        if (!renderSection) return null;
        return <div key={section.id}>{renderSection()}</div>;
      })}
      <Footer />
    </main>
  );
}
