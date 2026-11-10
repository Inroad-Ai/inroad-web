/** Illustrative activity for the auth panel. Fictional companies, never user data. */
export interface AuthPanelEvent {
  company: string;
  domain: string;
  text: string;
}

export const AUTH_PANEL_EVENTS: readonly AuthPanelEvent[] = [
  { company: "Ledgerline", domain: "ledgerline.example", text: "hiring manager found" },
  { company: "Tessellate", domain: "tessellate.example", text: "Marta replied" },
  { company: "Gridlight", domain: "gridlight.example", text: "draft ready to approve" },
  { company: "Fernway", domain: "fernway.example", text: "research brief ready" },
  { company: "Kiln Health", domain: "kilnhealth.example", text: "new match, fit 74" },
  { company: "Copperleaf", domain: "copperleaf.example", text: "interview booked with Sam" },
];

export const VISIBLE_EVENTS = 3;
