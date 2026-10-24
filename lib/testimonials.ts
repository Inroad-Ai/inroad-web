/** Illustrative quotes from fictional job seekers, shown on the landing
 * testimonial wall and the auth panel. Static demo content, not user data. */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  /** Where they work, described rather than named, for the landing wall. */
  context?: string;
}

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      "I'd sent 140 applications into portals and heard back from four. Inroad found a company with no posting at all, and their CTO replied the next morning.",
    name: "Mira Castell",
    role: "Platform Engineer at Quayside Freight",
  },
  {
    quote:
      "The draft mentioned their redesign post and the exact problem I'd solved before. I changed two sentences and sent it. That email got me the interview.",
    name: "Daniel Osei",
    role: "Product Designer at Fieldnote",
  },
  {
    quote:
      "What I trust is the sources. Every line in the draft links to where it came from, so I never sent anything I couldn't stand behind.",
    name: "Sofia Brandão",
    role: "Data Engineer at Brightwater Energy",
  },
  {
    quote:
      "I used to spend an evening on each company. Now I read the dossier on the train and send the note before I get to my desk.",
    name: "Kenji Watanabe",
    role: "Senior Backend Engineer at Copperleaf",
  },
  {
    quote:
      "It found the VP who actually owned the team, not a careers inbox. Three weeks from the first email to a signed offer.",
    name: "Amara Nwosu",
    role: "Product Manager at Halcyon Health",
  },
  {
    quote:
      "The follow-ups were polite and stopped the moment she replied. It read like me on a good day.",
    name: "Tobias Lang",
    role: "Founding Engineer at Kettle & Co",
  },
];

/** The landing page's testimonial wall. A separate set from the auth panel's
 * quotes; `role` is the job each person landed. */
export const WALL_TESTIMONIALS: readonly Testimonial[] = [
  {
    quote:
      "I sent eleven emails in two weeks and had four calls. The cited answers meant I could check every claim before I wrote a word.",
    name: "Amara Osei",
    role: "Backend Engineer",
    context: "Payments startup, Lisbon",
  },
  {
    quote:
      "I used to spend a whole evening on one company. Now I read the cited answer over coffee and edit the draft. It still sounds like me.",
    name: "Lukas Brenner",
    role: "Platform Engineer",
    context: "Series A infra, Munich",
  },
  {
    quote:
      "The source chips are the whole thing. I never sent a line I couldn't back up, and two founders mentioned that I'd clearly done my homework.",
    name: "Sofia Marchetti",
    role: "Product Designer",
    context: "Seed fintech, Milan",
  },
  {
    quote:
      "Job boards had me at 0 for 60. Inroad found the CTO, told me why now, and I had an intro call in nine days.",
    name: "Daniel Park",
    role: "Data Engineer",
    context: "Climate software, Berlin",
  },
  {
    quote:
      "I liked that nothing sends without me. I rewrote half the first draft, and kept the facts.",
    name: "Hana Yoshida",
    role: "Frontend Engineer",
    context: "Developer tools, Amsterdam",
  },
  {
    quote:
      "Asking 'who can actually hire me here' and getting a name, a reason and a verified email felt like cheating. It isn't. It's just research.",
    name: "Ravi Menon",
    role: "Engineering Manager",
    context: "Logistics, Rotterdam",
  },
  {
    quote:
      "The follow-up reminders saved me. The reply came on the third email, from a VP who said she'd been meaning to answer.",
    name: "Claire Dubois",
    role: "Data Scientist",
    context: "Health tech, Paris",
  },
  {
    quote:
      "I asked about remote Go teams and got six companies with the reason for each. Three became conversations.",
    name: "Tomasz Nowak",
    role: "Backend Engineer",
    context: "Remote, EU",
  },
  {
    quote: "It's the first job tool that works for me instead of for recruiters.",
    name: "Leila Haddad",
    role: "Mobile Engineer",
    context: "Consumer app, London",
  },
];
