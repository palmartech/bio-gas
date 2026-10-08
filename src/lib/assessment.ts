export type AssessmentInput = {
  state: string;
  town: string;
  propertyType: "home" | "compound" | "unsure" | "";
  households: "1" | "2-4" | "5+" | "unsure" | "";
  sanitation: "septic" | "soakaway" | "both" | "none" | "unsure" | "";
  alterExisting: "yes" | "no" | "unsure" | "";
  wasteSources: Array<"toilet" | "food" | "livestock" | "other" | "unsure">;
  space: "yes" | "limited" | "no" | "unsure" | "";
  energyGoal: "cooking" | "electricity" | "both" | "unsure" | "";
  spendBand: "under-20k" | "20k-50k" | "50k-100k" | "over-100k" | "unsure" | "";
};

export type AssessmentTier = "survey" | "information" | "specialist";

export type AssessmentOutcome = {
  tier: AssessmentTier;
  known: string[];
  openQuestions: string[];
  reviewFlags: string[];
  nextStep: string;
};

export const emptyAssessment: AssessmentInput = {
  state: "",
  town: "",
  propertyType: "",
  households: "",
  sanitation: "",
  alterExisting: "",
  wasteSources: [],
  space: "",
  energyGoal: "",
  spendBand: "",
};

export const tierText: Record<AssessmentTier, { title: string; short: string }> = {
  survey: { title: "Ready to discuss a survey", short: "Survey conversation" },
  information: { title: "More information needed", short: "Needs information" },
  specialist: { title: "Specialist review needed", short: "Specialist review" },
};

export const fieldLabels = {
  propertyType: { home: "Single home", compound: "Compound", unsure: "Not sure" },
  households: { "1": "1 household", "2-4": "2–4 households", "5+": "5+ households", unsure: "Not sure" },
  sanitation: { septic: "Septic tank", soakaway: "Soakaway", both: "Septic tank and soakaway", none: "No existing system", unsure: "Not sure" },
  alterExisting: { yes: "Yes", no: "No", unsure: "Not sure" },
  wasteSources: { toilet: "Toilet wastewater", food: "Food scraps", livestock: "Animal waste", other: "Other organic waste", unsure: "Not sure" },
  space: { yes: "Dedicated outdoor space", limited: "Limited outdoor space", no: "No outdoor space", unsure: "Not sure" },
  energyGoal: { cooking: "Cooking", electricity: "Electricity", both: "Cooking and electricity", unsure: "Not sure" },
  spendBand: { "under-20k": "Under ₦20,000", "20k-50k": "₦20,000–₦50,000", "50k-100k": "₦50,000–₦100,000", "over-100k": "Over ₦100,000", unsure: "Not sure" },
} as const;

function unknown<T extends string>(value: T): value is Extract<T, "" | "unsure"> {
  return !value || value === "unsure";
}

export function evaluateAssessment(input: AssessmentInput): AssessmentOutcome {
  const known: string[] = [];
  const openQuestions: string[] = [];
  const reviewFlags: string[] = [];
  let missingCore = false;

  if (unknown(input.state)) {
    openQuestions.push("Which Nigerian state is the property in?");
    missingCore = true;
  } else {
    known.push(`Location: ${input.town.trim() ? `${input.town.trim()}, ` : ""}${input.state}`);
  }

  if (unknown(input.propertyType) || unknown(input.households)) {
    openQuestions.push("What type of property is this, and how many households use it?");
    missingCore = true;
  } else {
    known.push(`${fieldLabels.propertyType[input.propertyType]} · ${fieldLabels.households[input.households]}`);
  }

  if (unknown(input.sanitation)) {
    openQuestions.push("What wastewater system is currently on site?");
    missingCore = true;
  } else {
    known.push(`Existing sanitation: ${fieldLabels.sanitation[input.sanitation]}`);
  }

  if (unknown(input.alterExisting)) {
    openQuestions.push("Would installation change an existing septic tank or soakaway?");
    missingCore = true;
  } else if (input.alterExisting === "yes") {
    reviewFlags.push("A qualified practitioner must assess any proposed change to an existing sanitation system.");
  }

  if (!input.wasteSources.length || input.wasteSources.includes("unsure")) {
    openQuestions.push("What organic material or wastewater would be available regularly?");
    missingCore = true;
  } else {
    known.push(`Potential inputs: ${input.wasteSources.map((source) => fieldLabels.wasteSources[source]).join(", ")}`);
  }

  if (unknown(input.space)) {
    openQuestions.push("Is outdoor space available for a purpose-designed system?");
    missingCore = true;
  } else {
    known.push(`Space: ${fieldLabels.space[input.space]}`);
    if (input.space === "no") {
      reviewFlags.push("No outdoor space was reported; an installer must determine whether any safe layout is possible.");
    }
  }

  if (unknown(input.energyGoal)) {
    openQuestions.push("Is the priority cooking, electricity, or both?");
    missingCore = true;
  } else {
    known.push(`Energy goal: ${fieldLabels.energyGoal[input.energyGoal]}`);
    if (input.energyGoal === "electricity" || input.energyGoal === "both") {
      reviewFlags.push("Generator use requires qualified review of gas quality, engine compatibility, and electrical safety.");
    }
  }

  if (unknown(input.spendBand)) {
    openQuestions.push("What is the current monthly cooking and energy spend? (Useful for a later business case.)");
  } else {
    known.push(`Current monthly spend: ${fieldLabels.spendBand[input.spendBand]}`);
  }

  const tier: AssessmentTier = reviewFlags.length
    ? "specialist"
    : missingCore
      ? "information"
      : "survey";

  const nextStep = tier === "specialist"
    ? "Ask a qualified biogas installer to review the flagged items before discussing a system design or quote."
    : tier === "information"
      ? "Clarify the open questions, then speak with an installer about a site survey."
      : "Share this brief with an installer and arrange an initial site survey.";

  return { tier, known, openQuestions, reviewFlags, nextStep };
}
