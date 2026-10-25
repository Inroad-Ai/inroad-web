import type { Metadata } from "next";

import { LegalPage, type LegalSection } from "@/components/composed/legal/LegalPage";
import { TextLink } from "@/components/ui/TextLink";
import { LEGAL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The rules for using Inroad, what you can expect from it, and what it expects of you.",
};

const mail = <TextLink href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</TextLink>;

const SECTIONS: readonly LegalSection[] = [
  {
    id: "agreement",
    title: "These terms",
    body: (
      <p>
        These terms are an agreement between you and the {LEGAL.operator}, which runs Inroad. By
        creating an account or using Inroad you accept them. If you do not agree, do not use Inroad.
        How we handle your information is covered by our{" "}
        <TextLink href="/privacy">Privacy Policy</TextLink>.
      </p>
    ),
  },
  {
    id: "account",
    title: "Your account",
    body: (
      <ul>
        <li>You must be at least 18 to use Inroad.</li>
        <li>Give accurate information and keep your password to yourself.</li>
        <li>
          You are responsible for what happens under your account. Tell us at once if you think
          someone else has access to it.
        </li>
      </ul>
    ),
  },
  {
    id: "the-service",
    title: "What Inroad does",
    body: (
      <>
        <p>
          Inroad finds companies that fit your profile, researches them from public sources, and
          helps you draft outreach to people there. It is free during early access, and features may
          change, be added or be removed as it develops.
        </p>
        <p>
          Inroad is a tool to help your search. It does not promise you a reply, an interview or a
          job.
        </p>
      </>
    ),
  },
  {
    id: "your-content",
    title: "Your content",
    body: (
      <p>
        Your profile, notes, drafts and anything else you add stay yours. You let us store and
        process them only as needed to run Inroad for you, as described in the Privacy Policy. You
        confirm you have the right to give us anything you upload.
      </p>
    ),
  },
  {
    id: "outreach",
    title: "Outreach and acceptable use",
    body: (
      <>
        <p>
          Nothing is sent without you. Messages go from your own email account only when you choose
          to send them, and you are responsible for what you send and to whom. You must follow the
          laws that apply to your messages, including anti-spam and privacy laws, and respect anyone
          who asks you not to contact them again.
        </p>
        <p>You must not use Inroad to:</p>
        <ul>
          <li>send spam, bulk unsolicited messages, harassment or threats;</li>
          <li>impersonate anyone or misrepresent who you are;</li>
          <li>
            collect or sell people&apos;s contact details for purposes other than your own job
            search;
          </li>
          <li>
            overload, attack, probe or scrape the service, or get around its limits or security;
          </li>
          <li>break any law or anyone else&apos;s rights.</li>
        </ul>
      </>
    ),
  },
  {
    id: "accuracy",
    title: "Research and AI-written content",
    body: (
      <p>
        Company research comes from public sources and AI models, and drafts are written with AI.
        Both can be wrong, incomplete or out of date. Inroad shows where facts came from so you can
        check them; read and verify anything before you rely on it or send it.
      </p>
    ),
  },
  {
    id: "third-parties",
    title: "Services you connect",
    body: (
      <p>
        If you connect Gmail, Apollo or Hunter, your use of them is also governed by their own
        terms. Requests to Apollo and Hunter run with your own key and count against your own
        account and limits with them. You can disconnect them at any time.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Ending your use",
    body: (
      <p>
        You can stop using Inroad at any time and ask us to delete your account by writing to {mail}
        . We may suspend or close an account that breaks these terms or puts other people or the
        service at risk, and we will tell you why where we can.
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "No warranty",
    body: (
      <p>
        Inroad is provided as it is and as available, without warranties of any kind, to the extent
        the law allows. We do not guarantee that it will always be available, error-free or
        accurate.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limits on liability",
    body: (
      <p>
        To the extent the law allows, {LEGAL.operatorShort} is not liable for indirect or
        consequential losses, such as lost opportunities, lost income or lost data, arising from
        your use of Inroad. Our total liability for any claim is limited to the amount you paid us
        for Inroad in the twelve months before it. Nothing here limits liability that cannot be
        limited by law.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of {LEGAL.governingLaw}, and the courts of{" "}
        {LEGAL.governingLaw} have jurisdiction over any dispute about them.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms. We will change the date at the top, and tell you by email before
        a significant change applies. If you keep using Inroad after that, the new terms apply.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    body: <p>Questions about these terms go to {mail}.</p>,
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={
        <p>
          The short version: use Inroad to help your own job search, send only messages you would be
          happy to sign, and check what it tells you. The details are below.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
