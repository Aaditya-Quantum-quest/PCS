import { Suspense } from "react";
import Link from "next/link";
import GalleryEditor from "@/app/(pages)/gallery-editor/GalleryEditor";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <nav
        style={{ fontFamily: "'DM Sans', sans-serif", width: "100%", padding: "12px 32px 0", marginTop: "70px" }}
        aria-label="Breadcrumb"
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <ol
            style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "4px", listStyle: "none", margin: 0, padding: 0 }}
            itemScope itemType="https://schema.org/BreadcrumbList"
          >
            <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
              <Link
                href="/"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 500, color: "#7a8499", textDecoration: "none", padding: "4px 10px", borderRadius: "8px", border: "1px solid transparent" }}
                itemProp="item"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                  <path d="M9 21V12h6v9" />
                </svg>
                <span itemProp="name">Home</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            <li>
              <span style={{ color: "#aab4c8", fontSize: "18px", padding: "0 2px", userSelect: "none", fontWeight: 300 }} aria-hidden="true">›</span>
            </li>
            <li itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
              <span
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 700, color: "#0f172a", padding: "4px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.95)", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 2px 8px rgba(99,102,241,0.08), 0 1px 2px rgba(0,0,0,0.04)" }}
                aria-current="page" itemProp="name"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                Gallery Editor
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1", flexShrink: 0, display: "inline-block", boxShadow: "0 0 0 3px rgba(99,102,241,0.25)" }} aria-hidden="true" />
              </span>
              <meta itemProp="position" content="2" />
            </li>
          </ol>
        </div>
      </nav>

      <Suspense fallback={<div className="p-10 text-center">Loading editor…</div>}>
        <GalleryEditor />
      </Suspense>
    </>
  );
}