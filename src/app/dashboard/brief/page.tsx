"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ClipboardCopy, ShieldCheck } from "lucide-react";
import { Lead, LeadStatus, formatBrief, formatDate, getLeads, statusLabels, updateLead } from "@/lib/demo-store";
import { fieldLabels, tierText } from "@/lib/assessment";

const statusOrder: LeadStatus[] = ["new", "contacted", "survey-planned", "surveyed", "quoted", "closed"];

export default function LeadDetailPage() {
  const [lead, setLead] = useState<Lead | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    setLead(getLeads().find((item) => item.id === id) ?? null);
  }, []);

  function changeStatus(status: LeadStatus) {
    if (!lead) return;
    const updated = updateLead(lead.id, { status });
    if (updated) setLead(updated);
  }

  async function copyBrief() {
    if (!lead) return;
    try { await navigator.clipboard.writeText(formatBrief(lead)); setCopied(true); window.setTimeout(() => setCopied(false), 2500); }
    catch { setCopied(false); }
  }

  if (lead === undefined) return <div className="shell loading-page">Loading site brief…</div>;
  if (lead === null) return <div className="shell empty-page"><h1>Brief not found.</h1><p>Demo records are stored in this browser only.</p><Link href="/dashboard" className="button button-primary">Back to enquiries</Link></div>;

  const rows = [
    ["Location", `${lead.input.town || "Town not provided"}${lead.input.state && lead.input.state !== "unsure" ? `, ${lead.input.state}` : " · State unknown"}`],
    ["Property", lead.input.propertyType ? fieldLabels.propertyType[lead.input.propertyType] : "Not answered"],
    ["Households", lead.input.households ? fieldLabels.households[lead.input.households] : "Not answered"],
    ["Existing sanitation", lead.input.sanitation ? fieldLabels.sanitation[lead.input.sanitation] : "Not answered"],
    ["Change existing setup?", lead.input.alterExisting ? fieldLabels.alterExisting[lead.input.alterExisting] : "Not answered"],
    ["Potential inputs", lead.input.wasteSources.length ? lead.input.wasteSources.map((source) => fieldLabels.wasteSources[source]).join(", ") : "Not answered"],
    ["Outdoor space", lead.input.space ? fieldLabels.space[lead.input.space] : "Not answered"],
    ["Energy goal", lead.input.energyGoal ? fieldLabels.energyGoal[lead.input.energyGoal] : "Not answered"],
    ["Monthly energy spend", lead.input.spendBand ? fieldLabels.spendBand[lead.input.spendBand] : "Not answered"],
  ];

  return (
    <div className="detail-page"><div className="shell detail-shell">
      <Link href="/dashboard" className="back-link"><ArrowLeft size={17} /> All enquiries</Link>
      <div className="detail-head"><div><span className="overline">SITE SURVEY BRIEF · {lead.id}</span><h1>{lead.input.town || (lead.input.state !== "unsure" ? lead.input.state : "Location unknown")}</h1><p>{lead.source} · Created {formatDate(lead.createdAt)}{lead.surveyRequestedAt ? ` · Demo survey requested ${formatDate(lead.surveyRequestedAt)}` : ""}</p></div><button type="button" className="button button-outline" onClick={copyBrief}>{copied ? <Check size={17} /> : <ClipboardCopy size={17} />}{copied ? "Copied" : "Copy brief"}</button></div>
      <div className="demo-banner"><ShieldCheck size={20} /><span>This brief is for a concept demonstration. It contains no customer contact details and does not establish site feasibility.</span></div>
      <div className="detail-grid"><div className="detail-main">
        <section className="detail-card"><div className="detail-card-head"><span className="overline">BUYER INPUT</span><h2>Site information</h2></div><dl className="detail-dl">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
        <section className="detail-card"><div className="detail-card-head"><span className="overline">INSTALLER HANDOFF</span><h2>Questions and review flags</h2></div><div className="brief-columns"><div><h3>Open questions</h3><ul>{lead.outcome.openQuestions.length ? lead.outcome.openQuestions.map((item) => <li key={item}>{item}</li>) : <li>No missing answers in this form. A site inspection is still essential.</li>}</ul></div><div><h3>Specialist attention</h3><ul>{lead.outcome.reviewFlags.length ? lead.outcome.reviewFlags.map((item) => <li key={item}>{item}</li>) : <li>No automatic flag. Check layout, input quantity, gas handling, and appliance suitability on site.</li>}</ul></div></div></section>
      </div><aside className="detail-aside"><div className="side-card"><span className="overline">PRELIMINARY ROUTE</span><div className={`tier-badge tier-${lead.outcome.tier}`}>{tierText[lead.outcome.tier].short}</div><p>{lead.outcome.nextStep}</p><div className="side-divider" /><label htmlFor="lead-status">Pipeline status</label><select id="lead-status" value={lead.status} onChange={(event) => changeStatus(event.target.value as LeadStatus)}>{statusOrder.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select><small>Changes stay in this browser.</small></div><div className="side-note"><strong>Before a real quote</strong><p>Confirm service coverage, onsite conditions, feedstock, gas use, safety design, and partner-approved pricing.</p></div></aside></div>
    </div></div>
  );
}
