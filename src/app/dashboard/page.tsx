"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ClipboardList, Inbox, Search, ShieldCheck } from "lucide-react";
import { Lead, formatDate, getLeads, statusLabels } from "@/lib/demo-store";
import { AssessmentTier, tierText } from "@/lib/assessment";

type Filter = "all" | AssessmentTier;
const filters: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All enquiries" }, { id: "survey", label: "Survey conversation" }, { id: "information", label: "Needs information" }, { id: "specialist", label: "Specialist review" },
];

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  useEffect(() => { setLeads(getLeads()); }, []);
  const visible = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();
    return leads.filter((lead) => {
      if (filter !== "all" && lead.outcome.tier !== filter) return false;
      if (!search) return true;
      return [lead.id, lead.input.town, lead.input.state, lead.source, statusLabels[lead.status]]
        .some((value) => value?.toLocaleLowerCase().includes(search));
    });
  }, [leads, filter, query]);
  const specialist = leads.filter((lead) => lead.outcome.tier === "specialist").length;
  const requests = leads.filter((lead) => lead.surveyRequestedAt).length;

  return (
    <div className="dashboard-page">
      <div className="shell dashboard-shell">
        <div className="dashboard-head"><div><span className="overline">PARTNER WORKSPACE · CONCEPT DEMO</span><h1>Enquiries, made clearer.</h1><p>A preview of how an installation team could move from social-media interest to a useful site conversation.</p></div><Link href="/assessment" className="button button-primary">Try buyer journey <ArrowUpRight size={17} /></Link></div>
        <div className="demo-banner"><ShieldCheck size={20} /><span><strong>Independent concept demo.</strong> These examples are fictional. New assessments stay in this browser; no real lead or message is sent to Solution Giver Constructions.</span></div>
        <div className="stats-grid"><div className="stat-card"><span>Total enquiries</span><strong>{leads.length}</strong><small>Fictional and browser-local</small></div><div className="stat-card"><span>Specialist review</span><strong>{specialist}</strong><small>Flagged by the assessment</small></div><div className="stat-card"><span>Survey requests</span><strong>{requests}</strong><small>Simulated in this browser</small></div></div>
        <div className="list-head"><div><span className="overline">ENQUIRY PIPELINE</span><h2>Site briefs</h2></div><label className="dashboard-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Search site briefs</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search location, ID or status" /></label><span className="list-count">{visible.length} shown</span></div>
        <div className="filter-bar" aria-label="Filter enquiries">{filters.map((item) => <button type="button" key={item.id} className={filter === item.id ? "active" : ""} aria-pressed={filter === item.id} onClick={() => setFilter(item.id)}>{item.label}</button>)}</div>
        <div className="lead-list">
          {visible.length ? visible.map((lead) => <Link href={`/dashboard/brief?id=${encodeURIComponent(lead.id)}`} key={lead.id} className="lead-row"><span className="lead-index"><ClipboardList size={21} /></span><span className="lead-main"><strong>{lead.input.town || lead.input.state || "Location unknown"}{lead.input.town && lead.input.state && lead.input.state !== "unsure" ? `, ${lead.input.state}` : ""}</strong><small>{lead.id} · {lead.source} · {formatDate(lead.createdAt)}</small></span><span className={`tier-badge tier-${lead.outcome.tier}`}>{tierText[lead.outcome.tier].short}</span><span className="status-pill">{statusLabels[lead.status]}</span>{lead.surveyRequestedAt && <span className="request-chip">Survey requested</span>}<ArrowRight className="row-arrow" size={18} /></Link>) : <div className="list-empty"><Inbox size={31} /><h3>No enquiries in this view</h3><p>Try a different search or filter to see more examples.</p></div>}
        </div>
        <div className="dashboard-footnote"><span>HOW TO READ THE RESULTS</span><p>These labels show whether an enquiry has enough detail and whether it needs specialist review. They do not approve a system or predict performance.</p></div>
      </div>
    </div>
  );
}
