// Single source of truth for the site URL
export const SITE_URL = (import.meta.env?.VITE_SITE_URL || "https://aloravoice.vercel.app").replace(/\/$/, "");

/**
 * Standardizes structured data JSON-LD Breadcrumb schemas.
 */
export function getBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    type: "application/ld+json" as const,
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": SITE_URL
        },
        ...items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 2,
          "name": item.name,
          "item": `${SITE_URL}${item.path}`
        }))
      ]
    })
  };
}
