"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, CircleHelp, ClipboardList, ShieldCheck } from "lucide-react";
import { Lead, getLeads, updateLead, formatDate } from "@/lib/demo-store";
import { tierText } from "@/lib/assessment";

export default function ResultPage() {
  const [lead, setLead] = useState<Lead | null | undefined>(undefined);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id");
    setLead(getLeads().find((item) => item.id === id) ?? null);
  }, []);

  function requestSurvey() {
    if (!lead) return;
    const updated = updateLead(lead.id, { surveyRequestedAt: new Date().toISOString() });
    if (updated) setLead(updated);
  }

  if (lead === undefined) return <div className="shell loading-page">Loading your assessment…</div>;
  if (lead === null) return <div className="shell empty-page"><span className="overline">ASSESSMENT RESULT</span><h1>We couldn’t find that result.</h1><p>This demo stores assessments in this browser only.</p><Link className="button button-primary" href="/assessment">Start a new assessment <ArrowRight size={17} /></Link></div>;

  const isSpecialist = lead.outcome.tier === "specialist";

  return (
    <div className="result-page">
      <div className="shell result-shell">
        <div className="result-topline"><span>YOUR PRELIMINARY RESULT</span><span>REF {lead.id} · {formatDate(lead.createdAt)}</span></div>
        <div className={`result-hero tier-${lead.outcome.tier}`}>
          <div className="result-icon">{isSpecialist ? <ShieldCheck size={31} /> : lead.outcome.tier === "survey" ? <Check size={31} /> : <CircleHelp size={31} />}</div>
          <div><span className="result-kicker">BASED ON THE ANSWERS YOU PROVIDED</span><h1>{tierText[lead.outcome.tier].title}<span>.</span></h1><p>{lead.outcome.nextStep}</p></div>
        </div>
        <div className="boundary-banner"><ShieldCheck size={21} /><p><strong>This is a conversation guide, not a feasibility decision.</strong> An installer must inspect the site before recommending a design, changing sanitation, or estimating gas and electricity output.</p></div>

        <div className="result-grid">
          <section className="result-card"><div className="card-heading"><span className="card-symbol green"><Check size={19} /></span><div><span className="overline">FROM YOUR ANSWERS</span><h2>What we know</h2></div></div><ul className="fact-list">{lead.outcome.known.length ? lead.outcome.known.map((fact) => <li key={fact}><span className="mini-dot" />{fact}</li>) : <li>No details recorded yet.</li>}</ul></section>
          <section className="result-card"><div className="card-heading"><span className="card-symbol cream"><CircleHelp size={19} /></span><div><span className="overline">FOR THE NEXT CONVERSATION</span><h2>Questions to clarify</h2></div></div><ul className="question-list">{lead.outcome.openQuestions.length ? lead.outcome.openQuestions.map((question) => <li key={question}>{question}</li>) : <li>The form has no unanswered questions. A site survey will still identify technical details.</li>}</ul></section>
        </div>

        <section className="review-panel"><div className="review-title"><div className="review-icon"><ShieldCheck size={21} /></div><div><span className="overline">SITE REVIEW</span><h2>{lead.outcome.reviewFlags.length ? "Items needing specialist attention" : "What an installer still needs to check"}</h2></div></div><div className="review-content">{lead.outcome.reviewFlags.length ? lead.outcome.reviewFlags.map((flag) => <p key={flag}>{flag}</p>) : <p>Feedstock quantity, site layout, gas handling, safe appliance use, and maintenance must be assessed on site. This form cannot confirm that a system is viable.</p>}</div></section>

        <div className="result-next"><div><span className="overline">NEXT STEP</span><h2>Take this brief into a site conversation.</h2><p>In this prototype, requesting a survey only marks this browser-local record for demonstration. Nobody receives your answers.</p></div><div className="result-next-actions">{lead.surveyRequestedAt ? <div className="request-success"><Check size={19} /><span>Demo survey request marked<br /><small>No message was sent</small></span></div> : <button type="button" className="button button-primary" onClick={requestSurvey}>Request a site survey (demo) <ArrowRight size={17} /></button>}<Link href={`/dashboard/brief?id=${encodeURIComponent(lead.id)}`} className="text-link">See the partner brief <ArrowUpRight size={16} /></Link></div></div>
        <div className="result-bottom-link"><Link href="/assessment">Start another assessment <ArrowRight size={16} /></Link></div>
      </div>
    </div>
  );
}
