/** Illustrative activity for the auth panel. Fictional companies, never user data. */
export interface AuthPanelEvent {
  company: string;
  domain: string;
  text: string;
}

export const AUTH_PANEL_EVENTS: readonly AuthPanelEvent[] = [
  { company: "Ledgerline", domain: "ledgerline.com", text: "hiring manager found" },
  { company: "Tessellate", domain: "tessellate.io", text: "Marta replied" },
  { company: "Gridlight", domain: "gridlight.energy", text: "draft ready to approve" },
  { company: "Fernway", domain: "fernway.co", text: "research brief ready" },
  { company: "Kiln Health", domain: "kilnhealth.com", text: "new match, fit 74" },
  { company: "Copperleaf", domain: "copperleaf.dev", text: "interview booked with Sam" },
];

export const VISIBLE_EVENTS = 3;
