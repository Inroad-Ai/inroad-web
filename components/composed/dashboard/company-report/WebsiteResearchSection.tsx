import type { CompanyDetail } from "@/lib/types";
import { Section } from "@/components/ui/Section";

import { HiringSection } from "./HiringSection";
import { ProfileSection } from "./ProfileSection";

export function WebsiteResearchSection({ detail }: { detail: CompanyDetail }) {
  return (
    <Section id="company-research" title="Company research">
      <div className="space-y-8">
        <div>
          <p className="utility-label mb-4 font-sans-semibold text-text-secondary">Profile</p>
          <ProfileSection detail={detail} />
        </div>
        <div className="border-t border-line pt-6">
          <p className="utility-label mb-4 font-sans-semibold text-text-secondary">Hiring</p>
          <HiringSection detail={detail} />
        </div>
      </div>
    </Section>
  );
}
