import { AssessmentInput, AssessmentOutcome, evaluateAssessment } from "./assessment";

export type LeadStatus = "new" | "contacted" | "survey-planned" | "surveyed" | "quoted" | "closed";

export type Lead = {
  id: string;
  createdAt: string;
  source: "Fictional example" | "Demo assessment";
  input: AssessmentInput;
  outcome: AssessmentOutcome;
  status: LeadStatus;
  surveyRequestedAt?: string;
};

export const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  "survey-planned": "Survey planned",
  surveyed: "Surveyed",
  quoted: "Quoted",
  closed: "Closed",
};

const STORAGE_KEY = "biogas-fit-demo-leads-v1";

function example(id: string, createdAt: string, status: LeadStatus, input: AssessmentInput): Lead {
  return { id, createdAt, status, source: "Fictional example", input, outcome: evaluateAssessment(input) };
}

export const seedLeads: Lead[] = [
  example("BF-1004", "2026-10-07T14:10:00+01:00", "new", {
    state: "Lagos", town: "Ikeja", propertyType: "compound", households: "2-4", sanitation: "both", alterExisting: "yes", wasteSources: ["toilet", "food"], space: "limited", energyGoal: "both", spendBand: "over-100k",
  }),
  example("BF-1003", "2026-10-06T09:30:00+01:00", "contacted", {
    state: "Ogun", town: "Abeokuta", propertyType: "home", households: "1", sanitation: "septic", alterExisting: "no", wasteSources: ["food", "livestock"], space: "yes", energyGoal: "cooking", spendBand: "20k-50k",
  }),
  example("BF-1002", "2026-10-04T11:25:00+01:00", "survey-planned", {
    state: "Rivers", town: "Port Harcourt", propertyType: "compound", households: "5+", sanitation: "unsure", alterExisting: "unsure", wasteSources: ["unsure"], space: "unsure", energyGoal: "cooking", spendBand: "unsure",
  }),
  example("BF-1001", "2026-10-02T16:45:00+01:00", "quoted", {
    state: "Abuja (FCT)", town: "Gwarinpa", propertyType: "home", households: "1", sanitation: "septic", alterExisting: "no", wasteSources: ["food"], space: "yes", energyGoal: "electricity", spendBand: "50k-100k",
  }),
];

export function getLeads(): Lead[] {
  if (typeof window === "undefined") return seedLeads;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedLeads;
    const parsed: unknown = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.every((item) => item && typeof item.id === "string" && item.input && item.outcome)) {
      return parsed as Lead[];
    }
  } catch {
    // A damaged demo cache should not prevent the prototype from opening.
  }
  return seedLeads;
}

function saveLeads(leads: Lead[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  window.dispatchEvent(new Event("biogas-fit-leads-changed"));
}

export function createLead(input: AssessmentInput): Lead {
  const lead: Lead = {
    id: `BF-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    source: "Demo assessment",
    input,
    outcome: evaluateAssessment(input),
    status: "new",
  };
  saveLeads([lead, ...getLeads()]);
  return lead;
}

export function updateLead(id: string, changes: Partial<Pick<Lead, "status" | "surveyRequestedAt">>): Lead | undefined {
  const leads = getLeads();
  const index = leads.findIndex((lead) => lead.id === id);
  if (index < 0) return undefined;
  leads[index] = { ...leads[index], ...changes };
  saveLeads(leads);
  return leads[index];
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

export function formatBrief(lead: Lead) {
  return [
    `BIOGAS FIT · DEMO SURVEY BRIEF · ${lead.id}`,
    `Created: ${formatDate(lead.createdAt)}`,
    `Status: ${statusLabels[lead.status]}`,
    `Assessment: ${lead.outcome.tier === "survey" ? "Ready to discuss a survey" : lead.outcome.tier === "specialist" ? "Specialist review needed" : "More information needed"}`,
    "",
    "KNOWN",
    ...lead.outcome.known.map((item) => `• ${item}`),
    "",
    "OPEN QUESTIONS",
    ...(lead.outcome.openQuestions.length ? lead.outcome.openQuestions.map((item) => `• ${item}`) : ["• None recorded in this preliminary form"]),
    "",
    "SPECIALIST REVIEW",
    ...(lead.outcome.reviewFlags.length ? lead.outcome.reviewFlags.map((item) => `• ${item}`) : ["• No automatic review flag; site inspection is still required"]),
    "",
    `NEXT STEP: ${lead.outcome.nextStep}`,
    "This is an enquiry brief, not a feasibility decision, design, quote, or performance estimate.",
  ].join("\n");
}
