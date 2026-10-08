"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Flame, Zap } from "lucide-react";

type EnergyUse = "cooking" | "electricity" | "both";
const scenarios: Record<EnergyUse, { heading: string; description: string; notes: string[] }> = {
  cooking: { heading: "Cooking comes first.", description: "A site review must establish whether suitable input material is available and how gas could safely reach an appropriate cooking appliance.", notes: ["Available input material", "System location and gas handling", "Appliance suitability"] },
  electricity: { heading: "Power needs another layer of review.", description: "A generator claim cannot be assessed from a video alone. Fuel quality, engine compatibility, and electrical safety need specialist attention.", notes: ["Gas quality and treatment", "Generator compatibility", "Electrical installation"] },
  both: { heading: "Two uses, one engineered system.", description: "Cooking and generation compete for the same gas supply. An expert must assess both uses against actual operating conditions.", notes: ["Input and demand profile", "Gas allocation and storage", "Generator and appliance review"] },
};

export function UseCaseExplorer() {
  const [energyUse, setEnergyUse] = useState<EnergyUse>("cooking");
  const [alterExisting, setAlterExisting] = useState(false);
  const selected = scenarios[energyUse];
  return <div className="scenario-tool">
    <div className="scenario-topline"><span>Explore an idea</span><span><i /> Interactive preview</span></div>
    <div className="scenario-heading"><span className="scenario-index">✳</span><h2>What would you use biogas for?</h2><p>Choose a use to see what a professional would review.</p></div>
    <div className="scenario-control"><span className="control-label">Your intended use</span><div className="scenario-segments" role="group" aria-label="Intended use">
      <button type="button" className={energyUse === "cooking" ? "selected" : ""} aria-pressed={energyUse === "cooking"} onClick={() => setEnergyUse("cooking")}><Flame size={16} /> Cooking</button>
      <button type="button" className={energyUse === "electricity" ? "selected" : ""} aria-pressed={energyUse === "electricity"} onClick={() => setEnergyUse("electricity")}><Zap size={16} /> Power</button>
      <button type="button" className={energyUse === "both" ? "selected" : ""} aria-pressed={energyUse === "both"} onClick={() => setEnergyUse("both")}>Both</button>
    </div></div>
    <div className="scenario-route" aria-hidden="true"><div className="route-node"><small>Possible input</small><strong>Organic material</strong></div><span className="route-line" /><div className="route-node route-core"><small>Needs a design</small><strong>Biogas system</strong></div><span className="route-line" /><div className="route-node route-output"><small>Possible use</small><strong>{energyUse === "electricity" ? "Generator" : energyUse === "both" ? "Stove + power" : "Cooking stove"}</strong></div></div>
    <div className="scenario-toggle-row"><div><strong>Alter an existing septic tank or soakaway?</strong><small>This changes the review, not a feasibility score.</small></div><button type="button" className={`switch ${alterExisting ? "on" : ""}`} role="switch" aria-checked={alterExisting} aria-label="Alter an existing septic tank or soakaway" onClick={() => setAlterExisting(!alterExisting)}><span /></button></div>
    <div className="scenario-output" aria-live="polite"><div className="output-kicker">What a site review would cover</div><h3>{selected.heading}</h3><p>{selected.description}</p><ul>{selected.notes.map((note) => <li key={note}>{note}</li>)}{alterExisting && <li className="critical-note">Existing sanitation needs its own specialist assessment.</li>}</ul></div>
    <div className="scenario-footer"><span>Preliminary only · no yield estimate</span><Link href="/assessment">Take the full site check <ArrowUpRight size={16} /></Link></div>
  </div>;
}
