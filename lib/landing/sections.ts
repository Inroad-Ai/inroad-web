/** Anchors for the landing page's sections, shared by the nav and footer. */
export const SECTION_IDS = {
  top: "top",
  story: "story",
  afterStory: "after-story",
  how: "how",
  features: "features",
  stories: "stories",
  pricing: "pricing",
  faq: "faq",
} as const;

export const NAV_LINKS = [
  { label: "The story", id: SECTION_IDS.story },
  { label: "How it works", id: SECTION_IDS.how },
  { label: "Features", id: SECTION_IDS.features },
  { label: "Stories", id: SECTION_IDS.stories },
  { label: "Pricing", id: SECTION_IDS.pricing },
  { label: "FAQ", id: SECTION_IDS.faq },
] as const;
