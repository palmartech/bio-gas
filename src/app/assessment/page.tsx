"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CircleHelp, LockKeyhole } from "lucide-react";
import { AssessmentInput, emptyAssessment } from "@/lib/assessment";
import { createLead } from "@/lib/demo-store";

const states = ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "Abuja (FCT)"];

const steps = [
  { title: "Your site", subtitle: "Start with the basics about your property." },
  { title: "What exists now", subtitle: "This helps identify questions for a trained installer." },
  { title: "Inputs and space", subtitle: "Tell us what may be available regularly." },
  { title: "Your energy goal", subtitle: "What would you like to explore first?" },
];

type Option = { value: string; label: string; detail?: string };

function OptionGroup({ label, hint, options, value, onChange, error }: { label: string; hint?: string; options: Option[]; value: string; onChange: (value: string) => void; error?: boolean }) {
  return (
    <fieldset className={`field-group ${error ? "field-error" : ""}`}>
      <legend>{label}</legend>
      {hint && <p className="field-hint">{hint}</p>}
      <div className="choice-grid">
        {options.map((option) => <label key={option.value} className={`choice ${value === option.value ? "selected" : ""}`}><input className="choice-input" type="radio" name={label} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} /><span>{option.label}{option.detail && <small>{option.detail}</small>}</span><span className="choice-indicator" aria-hidden="true">{value === option.value && <Check size={14} strokeWidth={3} />}</span></label>)}
      </div>
    </fieldset>
  );
}

export default function AssessmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<AssessmentInput>({ ...emptyAssessment });
  const [errors, setErrors] = useState<string[]>([]);

  function update<K extends keyof AssessmentInput>(field: K, value: AssessmentInput[K]) {
    setInput((current) => ({ ...current, [field]: value }));
    setErrors([]);
  }

  function toggleSource(value: AssessmentInput["wasteSources"][number]) {
    setInput((current) => ({
      ...current,
      wasteSources: value === "unsure"
        ? ["unsure"]
        : current.wasteSources.includes(value)
          ? current.wasteSources.filter((item) => item !== value)
          : [...current.wasteSources.filter((item) => item !== "unsure"), value],
    }));
    setErrors([]);
  }

  function advance() {
    const missing = step === 0
      ? [!input.state && "state", !input.propertyType && "propertyType", !input.households && "households"].filter(Boolean) as string[]
      : step === 1
        ? [!input.sanitation && "sanitation", !input.alterExisting && "alterExisting"].filter(Boolean) as string[]
        : step === 2
          ? [!input.wasteSources.length && "wasteSources", !input.space && "space"].filter(Boolean) as string[]
          : [!input.energyGoal && "energyGoal", !input.spendBand && "spendBand"].filter(Boolean) as string[];
    if (missing.length) { setErrors(missing); return; }
    if (step < 3) { setStep(step + 1); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const lead = createLead(input);
    router.push(`/result?id=${encodeURIComponent(lead.id)}`);
  }

  return (
    <div className="assessment-page">
      <div className="shell assessment-shell">
        <div className="assessment-top"><div><span className="overline">SITE ASSESSMENT</span><h1>Let’s understand your site.</h1><p>Four short steps. Your answers create a preliminary enquiry brief, not a technical verdict.</p></div><div className="privacy-note"><LockKeyhole size={17} /> Concept demo · no contact details</div></div>
        <div className="assessment-layout">
          <aside className="assessment-aside">
            <div className="progress-label">YOUR PROGRESS <strong>{String(step + 1).padStart(2, "0")} / 04</strong></div>
            <div className="progress-track"><span style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
            <ol className="step-list">{steps.map((item, index) => <li key={item.title} className={index === step ? "current" : index < step ? "done" : ""}><span>{index < step ? <Check size={15} /> : String(index + 1).padStart(2, "0")}</span>{item.title}</li>)}</ol>
            <div className="aside-help"><CircleHelp size={20} /><strong>Not sure about a detail?</strong><p>Choose “I don’t know”. An installer can help clarify it during a survey.</p></div>
          </aside>
          <section className="form-card" aria-labelledby="step-title">
            <div className="form-head"><span className="step-kicker">STEP {String(step + 1).padStart(2, "0")}</span><h2 id="step-title">{steps[step].title}</h2><p>{steps[step].subtitle}</p></div>
            <div className="form-body">
              {step === 0 && <>
                <div className={`field-group ${errors.includes("state") ? "field-error" : ""}`}><label htmlFor="state">Which state is the property in?</label><select id="state" value={input.state} onChange={(event) => update("state", event.target.value)}><option value="">Select a state</option>{states.map((state) => <option key={state} value={state}>{state}</option>)}<option value="unsure">I don’t know / prefer not to say</option></select></div>
                <div className="field-group"><label htmlFor="town">Town or local government area <span className="optional">Optional</span></label><input id="town" value={input.town} onChange={(event) => update("town", event.target.value)} placeholder="e.g. Ikeja" maxLength={80} /><p className="field-hint">Please do not enter a street address.</p></div>
                <OptionGroup label="What kind of property is it?" options={[{ value: "home", label: "Single home" }, { value: "compound", label: "Compound / shared property" }, { value: "unsure", label: "I don’t know" }]} value={input.propertyType} onChange={(value) => update("propertyType", value as AssessmentInput["propertyType"])} error={errors.includes("propertyType")} />
                <OptionGroup label="How many households use the property?" options={[{ value: "1", label: "1 household" }, { value: "2-4", label: "2–4 households" }, { value: "5+", label: "5 or more" }, { value: "unsure", label: "I don’t know" }]} value={input.households} onChange={(value) => update("households", value as AssessmentInput["households"])} error={errors.includes("households")} />
              </>}
              {step === 1 && <>
                <div className="info-note"><ShieldCheckIcon /> Existing sanitation needs its own professional assessment. This form never decides whether it can be modified.</div>
                <OptionGroup label="What wastewater setup is currently on site?" hint="Choose the closest description." options={[{ value: "septic", label: "Septic tank" }, { value: "soakaway", label: "Soakaway" }, { value: "both", label: "Septic tank and soakaway" }, { value: "none", label: "None yet" }, { value: "unsure", label: "I don’t know" }]} value={input.sanitation} onChange={(value) => update("sanitation", value as AssessmentInput["sanitation"])} error={errors.includes("sanitation")} />
                <OptionGroup label="Would the proposed project change that existing setup?" hint="Any proposed alteration will be flagged for specialist review." options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unsure", label: "I don’t know" }]} value={input.alterExisting} onChange={(value) => update("alterExisting", value as AssessmentInput["alterExisting"])} error={errors.includes("alterExisting")} />
              </>}
              {step === 2 && <>
                <fieldset className={`field-group ${errors.includes("wasteSources") ? "field-error" : ""}`}><legend>What might provide organic material regularly?</legend><p className="field-hint">Select all that apply. Availability still needs to be checked on site.</p><div className="choice-grid">{[{ value: "toilet", label: "Toilet wastewater" }, { value: "food", label: "Food scraps" }, { value: "livestock", label: "Animal waste" }, { value: "other", label: "Other organic waste" }, { value: "unsure", label: "I don’t know" }].map((option) => { const checked = input.wasteSources.includes(option.value as AssessmentInput["wasteSources"][number]); return <label key={option.value} className={`choice ${checked ? "selected" : ""}`}><input className="choice-input" type="checkbox" value={option.value} checked={checked} onChange={() => toggleSource(option.value as AssessmentInput["wasteSources"][number])} /><span>{option.label}</span><span className="choice-indicator" aria-hidden="true">{checked && <Check size={14} strokeWidth={3} />}</span></label>; })}</div></fieldset>
                <OptionGroup label="Is there outdoor space for a purpose-designed system?" options={[{ value: "yes", label: "Yes, dedicated space" }, { value: "limited", label: "Some, but limited" }, { value: "no", label: "No outdoor space" }, { value: "unsure", label: "I don’t know" }]} value={input.space} onChange={(value) => update("space", value as AssessmentInput["space"])} error={errors.includes("space")} />
              </>}
              {step === 3 && <>
                <OptionGroup label="What would you like to explore?" hint="Electricity always needs extra generator and electrical review." options={[{ value: "cooking", label: "Cooking gas", detail: "For a suitable stove and system" }, { value: "electricity", label: "Electricity", detail: "Generator review required" }, { value: "both", label: "Cooking and electricity", detail: "Generator review required" }, { value: "unsure", label: "I don’t know yet" }]} value={input.energyGoal} onChange={(value) => update("energyGoal", value as AssessmentInput["energyGoal"])} error={errors.includes("energyGoal")} />
                <OptionGroup label="About how much do you spend monthly on cooking fuel and backup power?" hint="This provides context only; the prototype does not calculate savings." options={[{ value: "under-20k", label: "Under ₦20,000" }, { value: "20k-50k", label: "₦20,000–₦50,000" }, { value: "50k-100k", label: "₦50,000–₦100,000" }, { value: "over-100k", label: "Over ₦100,000" }, { value: "unsure", label: "I don’t know" }]} value={input.spendBand} onChange={(value) => update("spendBand", value as AssessmentInput["spendBand"])} error={errors.includes("spendBand")} />
              </>}
            </div>
            {errors.length > 0 && <p className="validation-message" role="alert">Please answer the highlighted questions. “I don’t know” is a valid choice.</p>}
            <div className="form-actions"><button type="button" className="button button-quiet" disabled={step === 0} onClick={() => { setStep(step - 1); setErrors([]); window.scrollTo({ top: 0, behavior: "smooth" }); }}><ArrowLeft size={17} /> Back</button><button type="button" className="button button-primary" onClick={advance}>{step === 3 ? "See my result" : "Continue"} <ArrowRight size={17} /></button></div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ShieldCheckIcon() { return <LockKeyhole size={18} aria-hidden="true" />; }
