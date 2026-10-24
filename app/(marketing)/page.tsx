import type { Metadata } from "next";

import { Faq } from "@/components/composed/landing/Faq";
import { Features } from "@/components/composed/landing/features/Features";
import { FinalCta } from "@/components/composed/landing/FinalCta";
import { Footer } from "@/components/composed/landing/Footer";
import { Hero } from "@/components/composed/landing/Hero";
import { HowItWorks } from "@/components/composed/landing/HowItWorks";
import { Nav } from "@/components/composed/landing/Nav";
import { Pricing } from "@/components/composed/landing/Pricing";
import { Results } from "@/components/composed/landing/Results";
import { ScrubParagraph } from "@/components/composed/landing/ScrubParagraph";
import { Story } from "@/components/composed/landing/story/Story";
import { Testimonials } from "@/components/composed/landing/Testimonials";

const DESCRIPTION =
  "Inroad finds companies that actually match what you're looking for, digs into the funding, team, and tech stack details that make a message worth reading, and helps you write outreach to someone who can actually hire you. It's for people who are done sending resumes into an applicant tracking system and waiting. No queue, no black box, just a real message to a real person who'd have no idea you did an hour of research to write it.";

export const metadata: Metadata = {
  title: "Get an inroad, not a rejection email.",
  description: DESCRIPTION,
};

export default function LandingPage() {
  return (
    <>
      <Nav />
      <main className="overflow-x-clip">
        <Hero />
        <Story />
        <ScrubParagraph />
        <HowItWorks />
        <Features />
        <Results />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
