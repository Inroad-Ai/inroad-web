import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/composed/legal/LegalPage";
import { TextLink } from "@/components/ui/TextLink";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What Inroad collects, why, who it is shared with, and how to have it deleted.",
};

const mail = <TextLink href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</TextLink>;

const SECTIONS: readonly LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    body: (
      <p>
        Inroad is a project of the {LEGAL.operator}. {LEGAL.operatorShort} is responsible for the
        personal information described here. Questions or requests about it go to {mail}.
      </p>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    body: (
      <ul>
        <li>
          <strong>Your account:</strong> your name, email address and password. The password is
          stored only as a one-way hash, never in a form anyone can read.
        </li>
        <li>
          <strong>Your profile:</strong> what you enter during onboarding or on your profile, such
          as phone number, location, links (LinkedIn, GitHub, portfolio), work history, education,
          skills, the roles you are looking for and how you want to work.
        </li>
        <li>
          <strong>Your resume:</strong> if you upload one, we read it once to fill in your profile.
          The file and its raw text are not stored; only the profile fields you keep are.
        </li>
        <li>
          <strong>What you do in Inroad:</strong> the companies you research and save, contacts,
          notes, pipeline stages, job match runs and outreach drafts.
        </li>
        <li>
          <strong>Connected accounts:</strong> if you connect Gmail, Apollo or Hunter, the access
          token or API key you give us, stored encrypted.
        </li>
        <li>
          <strong>Your browser:</strong> two sign-in cookies that keep you logged in, and browser
          storage for your theme choice and an unfinished onboarding form. We use no analytics,
          advertising or tracking tools.
        </li>
      </ul>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    body: (
      <>
        <ul>
          <li>To run your account: sign-in, email verification and password reset.</li>
          <li>To find companies that fit your profile and rank them for you.</li>
          <li>To research companies and keep the results you save.</li>
          <li>To draft outreach for you, and to send it only when you choose to.</li>
          <li>To keep the service secure and fix problems.</li>
        </ul>
        <p>We do not sell your information and we do not use it for advertising.</p>
      </>
    ),
  },
  {
    id: "company-research",
    title: "Company research and public information",
    body: (
      <>
        <p>
          When you research a company, Inroad reads that company&apos;s own public website, its
          public job board and its own news or press pages, and may use a web search provider and an
          AI model to pull out facts with the quote they came from. These results are about the
          company, not about you, so they are shared between everyone who researches the same
          company and are not linked to who asked.
        </p>
        <p>
          To find companies for you, Inroad sends our research service only the roles you are
          looking for, a few general skills, your city and whether you want remote work. Your name,
          email, resume, profile text and saved companies are never sent.
        </p>
        <p>
          Our crawler identifies itself and follows each site&apos;s robots.txt. If you are named on
          a company&apos;s own website and want Inroad to stop listing you, write to {mail} and we
          will exclude you.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share it with",
    body: (
      <>
        <p>
          We share information only with services that help us run Inroad, and only what each one
          needs:
        </p>
        <ul>
          <li>
            <strong>AI model providers</strong> (such as Google Gemini, Anthropic, OpenAI, Groq or
            ModelScope, depending on configuration): your resume text when you upload one, your
            profile and the company details when you ask for an outreach draft, and public web pages
            during company research.
          </li>
          <li>
            <strong>Olostep</strong>, a web search and page rendering service: search queries and
            public page addresses for company research and matching. It receives none of your
            personal details.
          </li>
          <li>
            <strong>Google:</strong> our own Gmail account sends verification and password reset
            emails to you. If you connect Gmail, Inroad can create drafts and send the messages you
            approve from your account. It cannot read your existing mail.
          </li>
          <li>
            <strong>Apollo and Hunter:</strong> only if you connect them with your own key, to look
            up contact details for people at companies you research. Those requests run on your
            account with them.
          </li>
          <li>
            <strong>Hosting:</strong> the providers that host our website, servers and database.
          </li>
        </ul>
        <p>We may also disclose information if the law requires it.</p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: (
      <p>
        We keep your information while your account exists. When you ask us to delete your account,
        we delete your account, profile, saved companies, contacts, notes, drafts and connected
        account credentials within 30 days. Public company research is not personal to you and may
        be kept.
      </p>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    body: (
      <p>
        Traffic is encrypted in transit, passwords are hashed, and connected-account tokens and keys
        are encrypted at rest. Each account can see only its own data. No system is perfectly
        secure, so if you believe your account has been compromised, contact us at once.
      </p>
    ),
  },
  {
    id: "your-choices",
    title: "Your choices and rights",
    body: (
      <ul>
        <li>You can see and edit your profile at any time in the app.</li>
        <li>
          You can disconnect Gmail, Apollo or Hunter at any time under Integrations, and revoke
          Gmail access from your Google account settings.
        </li>
        <li>
          You can ask for a copy of your information, a correction, or deletion of your account by
          writing to {mail}. We will answer within 30 days.
        </li>
      </ul>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Inroad is for people looking for work and is not meant for anyone under 18. We do not
        knowingly collect information from children.
      </p>
    ),
  },
  {
    id: "international",
    title: "Where your information is processed",
    body: (
      <p>
        Our service providers may process information in countries other than yours, including
        Pakistan and the United States. We use them only for the purposes described above.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: (
      <p>
        If we change this policy, we will update the date at the top. If a change affects how we use
        information you have already given us, we will tell you by email before it applies.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: (
      <p>
        For anything about your privacy, write to {mail}. Inroad is operated by the {LEGAL.operator}
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={
        <p>
          Inroad helps you find companies, research them and write to someone who can hire you. To
          do that it needs some information about you. This page explains what we collect, why, who
          sees it, and how to have it removed, in plain words.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
