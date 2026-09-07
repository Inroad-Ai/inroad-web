import type { Metadata } from "next";

import { Differentiation } from "@/components/composed/landing/Differentiation";
import { Faq } from "@/components/composed/landing/Faq";
import { Footer } from "@/components/composed/landing/Footer";
import { FounderCredibility } from "@/components/composed/landing/FounderCredibility";
import { Hero } from "@/components/composed/landing/Hero";
import { HowItWorks } from "@/components/composed/landing/HowItWorks";
import { Integrations } from "@/components/composed/landing/Integrations";
import { Nav } from "@/components/composed/landing/Nav";
import { ProblemSection } from "@/components/composed/landing/ProblemSection";
import { SampleDossier } from "@/components/composed/landing/SampleDossier";
import { SourcesSection } from "@/components/composed/landing/SourcesSection";
import { SpeedComparison } from "@/components/composed/landing/SpeedComparison";

const DESCRIPTION =
  "Inroad finds companies that actually match what you're looking for, digs into the funding, team, and tech stack details that make a message worth reading, and helps you write outreach to someone who can actually hire you. It's for people who are done sending resumes into an applicant tracking system and waiting. No queue, no black box, just a real message to a real person who'd have no idea you did an hour of research to write it.";

export const metadata: Metadata = {
  title: "Get an inroad, not a rejection email.",
  description: DESCRIPTION,
};

export default function LandingPage() {
  return (
    <main>
      <Nav />
      <Hero />
      <SourcesSection />
      <HowItWorks />
      <SampleDossier />
      <SpeedComparison />
      <ProblemSection />
      <FounderCredibility />
      <Differentiation />
      <Integrations />
      <Faq />
      <Footer />
    </main>
  );
}
