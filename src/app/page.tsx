import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { About } from "@/components/About";
import { TargetAudience } from "@/components/TargetAudience";
import { LearningRoadmap } from "@/components/LearningRoadmap";
import { Courses } from "@/components/Courses";
import { TeachingMethod } from "@/components/TeachingMethod";
import { Testimonials } from "@/components/Testimonials";
import { MediaSection } from "@/components/MediaSection";
import { RegistrationForm } from "@/components/RegistrationForm";
import { CTABanner } from "@/components/CTABanner";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <SocialProof />
      <About />
      <TargetAudience />
      <LearningRoadmap />
      <Courses />
      <TeachingMethod />
      <Testimonials />
      <MediaSection />
      <RegistrationForm />
      <CTABanner />
      <Footer />
    </main>
  );
}
