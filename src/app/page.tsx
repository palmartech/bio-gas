import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ClipboardList, MapPin, ShieldCheck } from "lucide-react";
import { UseCaseExplorer } from "@/components/UseCaseExplorer";

export default function HomePage() {
  return <>
    <section className="hero"><div className="shell hero-grid"><div className="hero-copy">
      <div className="hero-meta"><span className="signal-square" /> A calmer way to explore home biogas</div>
      <h1>A thoughtful first step <span>toward biogas.</span></h1>
      <p>Biogas starts with a real place, real inputs, and a safe design. This tool helps you ask the right questions before discussing cooking gas or electricity with an installer.</p>
      <div className="hero-actions"><Link className="button button-primary" href="/assessment">Check your site <ArrowUpRight size={18} /></Link><Link className="hero-secondary" href="#method">How it works <ArrowRight size={17} /></Link></div>
      <div className="hero-foot"><span>About 3 minutes</span><span>No contact details</span><span>Professional review still matters</span></div>
    </div><UseCaseExplorer /></div></section>

    <div className="ticker-band"><div className="shell ticker-inner"><span>Understand your site</span><span>See the open questions</span><span>Prepare for a survey</span></div></div>

    <section id="method" className="method-section section shell"><div className="section-heading"><span className="section-code">How it works</span><h2>A useful first conversation has a structure.</h2><p>A short assessment turns a vague request into a brief an installer can review.</p></div><div className="method-list">
      <div className="method-row"><span className="method-number">01</span><span className="method-icon"><MapPin size={25} /></span><div><h3>Describe your site</h3><p>Share the broad location, household size, existing wastewater setup, possible organic inputs, and outdoor space.</p></div><ArrowUpRight className="method-arrow" size={22} /></div>
      <div className="method-row"><span className="method-number">02</span><span className="method-icon"><ClipboardList size={25} /></span><div><h3>See what needs checking</h3><p>See what is known, what is missing, and where a sanitation or generator specialist must look closer.</p></div><ArrowUpRight className="method-arrow" size={22} /></div>
      <div className="method-row"><span className="method-number">03</span><span className="method-icon"><ShieldCheck size={25} /></span><div><h3>Prepare a useful brief</h3><p>Take a concise, preliminary summary into a site survey. The design and quote remain a professional decision.</p></div><ArrowUpRight className="method-arrow" size={22} /></div>
    </div></section>

    <section className="truth-section"><div className="shell truth-grid"><div><span className="section-code">What the tool cannot decide</span><h2>Some answers need a visit to the site.</h2><p>Videos demonstrate an idea. They do not reveal the conditions behind a safe, reliable installation.</p><Link href="/assessment" className="button button-outline">Start the site check <ArrowUpRight size={17} /></Link></div><div className="truth-list"><div><span>01</span><p>An existing soakaway is not automatically a biogas digester.</p></div><div><span>02</span><p>Gas yield and cost savings require verified site data.</p></div><div><span>03</span><p>Generator use needs gas-quality, engine, and electrical review.</p></div></div></div></section>

    <section className="partner-section section shell"><div className="partner-main"><span className="section-code">For installation teams</span><h2>From interest to a clearer site conversation.</h2><p>A digital intake can give an installation team a clearer picture of each enquiry before the first call. Explore the fictional partner view to see site briefs and follow-up statuses.</p><Link href="/dashboard" className="button button-primary">Explore the partner view <ArrowUpRight size={18} /></Link></div><div className="partner-diagram" aria-label="Enquiry pipeline"><div><span>1. Intake</span><strong>Buyer describes the site</strong></div><div><span>2. Review</span><strong>Questions and flags appear</strong></div><div><span>3. Survey</span><strong>Installer plans the visit</strong></div><div className="diagram-foot"><Check size={16} /> Fictional data · stored in this browser</div></div></section>
  </>;
}
