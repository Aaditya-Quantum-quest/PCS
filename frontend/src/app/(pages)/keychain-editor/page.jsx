import { Suspense } from "react";
import Link from "next/link";
import KeychainEditor from "@/app/(pages)/keychain-editor/KeychainEditor";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <nav style={{ fontFamily: "'DM Sans', sans-serif", width: "100%", padding: "28px 32px 0" }} aria-label="Breadcrumb">
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <ol style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", listStyle: "none", margin: 0, padding: 0 }}
            itemScope itemType="https://schema.org/BreadcrumbList">
            <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "15px", fontWeight: 500, color: "#7a8499", textDecoration: "none", padding: "6px 12px", borderRadius: "10px", border: "1px solid transparent" }} itemProp="item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" /><path d="M9 21V12h6v9" /></svg>
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li>
              <span style={{ color: "#aab4c8", fontSize: "20px", padding: "0 2px", userSelect: "none", fontWeight: 300 }} aria-hidden="true">›</span>
            </li>
            <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "16px", fontWeight: 700, color: "#0f172a", padding: "7px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.95)", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 2px 8px rgba(99,102,241,0.08), 0 1px 2px rgba(0,0,0,0.04)" }} aria-current="page" itemProp="name">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" /></svg>
                Customise
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#6366f1", flexShrink: 0, display: "inline-block", boxShadow: "0 0 0 3px rgba(99,102,241,0.25)" }} aria-hidden="true" />
              </span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </div>
      </nav>
      <Suspense fallback={<div className="p-10 text-center">Loading editor…</div>}>
        <KeychainEditor />
      </Suspense>
    </>
  );
}
