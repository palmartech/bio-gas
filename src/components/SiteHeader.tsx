"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Leaf } from "lucide-react";

export function SiteHeader() {
  const path = usePathname();
  return <header className="site-header"><div className="shell header-inner">
    <Link className="brand" href="/" aria-label="BiogasFit home"><span className="brand-mark" aria-hidden="true"><Leaf size={22} strokeWidth={2.2} /></span><span className="brand-name">Biogas<span>Fit</span></span></Link>
    <nav className="main-nav" aria-label="Main navigation"><Link className={path === "/" ? "active" : ""} href="/">Overview</Link><Link className={path.startsWith("/assessment") || path.startsWith("/result") ? "active" : ""} href="/assessment">Site check</Link><Link className={path.startsWith("/dashboard") ? "active" : ""} href="/dashboard">Partner view</Link></nav>
    <Link className="header-cta" href="/assessment">Start site check <ArrowRight size={17} /></Link>
  </div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="shell footer-inner">
    <div className="footer-identity"><span className="footer-stamp">An independent concept</span><strong>BiogasFit</strong><p>A prototype for a possible biogas installation partnership. No customer information is transmitted.</p></div>
    <div className="footer-links"><span>Explore</span><Link href="/assessment">Site check</Link><Link href="/dashboard">Partner view</Link><a href="https://www.epa.gov/anaerobic-digestion/frequent-questions-about-anaerobic-digestion" target="_blank" rel="noreferrer">Biogas basics ↗</a></div>
    <div className="footer-disclaimer"><span>A note on the results</span><p>A digital brief can guide the first conversation. A qualified site assessment determines what can actually be built.</p></div>
  </div></footer>;
}
