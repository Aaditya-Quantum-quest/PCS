"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Breadcrumbs({ items }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatLabel = (text) =>
    text
      .replace(/\[|\]/g, "")
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const getIcon = (label) => {
    const icons = {
      Home: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
      Cart: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.99-1.79l1.38-9.2H6" />
        </svg>
      ),
      Checkout: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      ),
      Customise: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" />
        </svg>
      ),
    };
    return icons[label] ?? null;
  };

  const generateBreadcrumbs = () => {
    if (items?.length) return items;

    const breadcrumbs = [{ href: "/", label: "Home" }];

    if (pathname === "/" || pathname === "/home") {
      return [];
    }

    const routeMap = [
      {
        match: (path) => path.startsWith("/p"),
        crumbs: [
          { href: "/", label: "Home" },
          { label: "Customise" },
          { label: "Acrylic Wall Photo", isCurrent: true },
        ],
      },
      {
        match: (path) =>
          ["/editor", "/clear-acrylic-editor", "/gallery-editor", "/keychain-editor", "/nameplate-editor"].some((r) => path.startsWith(r)),
        crumbs: [
          { href: "/", label: "Home" },
          { label: "Customise", isCurrent: true },
        ],
      },
      {
        match: (path) => path.startsWith("/cart"),
        crumbs: [{ href: "/", label: "Home" }, { label: "Cart", isCurrent: true }],
      },
      {
        match: (path) => path.startsWith("/checkout"),
        crumbs: [
          { href: "/", label: "Home" },
          { href: "/cart", label: "Cart" },
          { label: "Checkout", isCurrent: true },
        ],
      },
      {
        match: (path) => path.startsWith("/buy"),
        crumbs: [{ href: "/", label: "Home" }, { label: "Product", isCurrent: true }],
      },
      {
        match: (path) => path.startsWith("/photo-gallery"),
        crumbs: [{ href: "/", label: "Home" }, { label: "Photo Gallery", isCurrent: true }],
      },
    ];

    for (const route of routeMap) {
      if (route.match(pathname)) return route.crumbs;
    }

    if (pathname.startsWith("/products")) {
      const parts = pathname.split("/").filter(Boolean);
      const slug = parts[parts.length - 1] || "";
      breadcrumbs.push({ href: "/products", label: "Products" });
      if (slug !== "products") breadcrumbs.push({ label: formatLabel(slug), isCurrent: true });
      return breadcrumbs;
    }

    const segments = pathname.split("/").filter(Boolean);
    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      breadcrumbs.push({
        href: index === segments.length - 1 ? undefined : currentPath,
        label: formatLabel(segment),
        isCurrent: index === segments.length - 1,
      });
    });

    return breadcrumbs;
  };

  const trail = generateBreadcrumbs();
  if (!trail?.length) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

        .bc-nav {
          font-family: 'DM Sans', sans-serif;
          width: 100%;
          padding: 28px 32px 0;
        }

        .bc-inner {
          max-width: 1200px;
          margin: 0 auto;
        }

        .bc-list {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .bc-item {
          display: flex;
          align-items: center;
          gap: 4px;
          opacity: 0;
          transform: translateY(4px);
          animation: bc-fade-up 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes bc-fade-up {
          to { opacity: 1; transform: translateY(0); }
        }

        .bc-separator {
          color: #aab4c8;
          font-size: 20px;
          line-height: 1;
          padding: 0 2px;
          user-select: none;
          font-weight: 300;
        }

        .bc-icon {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .bc-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          font-weight: 500;
          color: #7a8499;
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 10px;
          transition: all 0.2s ease;
          letter-spacing: -0.01em;
          border: 1px solid transparent;
        }

        .bc-link:hover {
          color: #1e293b;
          background: rgba(255,255,255,0.85);
          border-color: rgba(0,0,0,0.08);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          transform: translateY(-1px);
        }

        .bc-link:hover .bc-icon {
          color: #6366f1;
        }

        .bc-link:active {
          transform: translateY(0px) scale(0.98);
        }

        .bc-current {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          padding: 7px 16px;
          border-radius: 12px;
          letter-spacing: -0.02em;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(99, 102, 241, 0.2);
          box-shadow:
            0 2px 8px rgba(99, 102, 241, 0.08),
            0 1px 2px rgba(0,0,0,0.04),
            inset 0 1px 0 rgba(255,255,255,1);
        }

        .bc-current .bc-icon {
          color: #6366f1;
        }

        .bc-pulse {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #6366f1;
          flex-shrink: 0;
          position: relative;
        }

        .bc-pulse::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: rgba(99, 102, 241, 0.25);
          animation: bc-pulse 2s ease-in-out infinite;
        }

        @keyframes bc-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0; }
        }

        @media (max-width: 640px) {
          .bc-nav { padding: 20px 16px 0; }
          .bc-link { font-size: 14px; padding: 5px 10px; }
          .bc-current { font-size: 15px; padding: 6px 12px; }
        }
      `}</style>

      <nav className="bc-nav" aria-label="Breadcrumb">
        <div className="bc-inner">
          <ol
            className="bc-list"
            itemScope
            itemType="https://schema.org/BreadcrumbList"
          >
            {trail.map((item, index) => (
              <li
                key={index}
                className="bc-item"
                style={{ animationDelay: `${index * 70}ms` }}
                itemScope
                itemType="https://schema.org/ListItem"
                itemProp="itemListElement"
              >
                {index > 0 && (
                  <span className="bc-separator" aria-hidden="true">›</span>
                )}

                {item.href && !item.isCurrent ? (
                  <Link href={item.href} className="bc-link" itemProp="item">
                    {getIcon(item.label) && (
                      <span className="bc-icon" aria-hidden="true">
                        {getIcon(item.label)}
                      </span>
                    )}
                    <span itemProp="name">{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={item.isCurrent ? "bc-current" : "bc-link"}
                    aria-current={item.isCurrent ? "page" : undefined}
                    itemProp="name"
                  >
                    {getIcon(item.label) && (
                      <span className="bc-icon" aria-hidden="true">
                        {getIcon(item.label)}
                      </span>
                    )}
                    {item.label}
                    {item.isCurrent && (
                      <span className="bc-pulse" aria-hidden="true" />
                    )}
                  </span>
                )}

                <meta itemProp="position" content={String(index + 1)} />
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}