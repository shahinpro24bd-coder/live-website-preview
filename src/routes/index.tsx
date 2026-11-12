import { createFileRoute, redirect } from "@tanstack/react-router";

// The site is the uploaded static HTML in public/html; "/" sends visitors to its home page.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/html/index.html", reloadDocument: true });
  },
  head: () => ({
    meta: [
      { title: "Dr. Md. Afzal Mahfuzullah | Vitreo-Retina Specialist & Phaco Surgeon" },
      {
        name: "description",
        content: "Vitreo-retina specialist and phaco surgeon offering comprehensive eye care in Bangladesh.",
      },
      { property: "og:title", content: "Dr. Md. Afzal Mahfuzullah | Vitreo-Retina Specialist" },
      {
        property: "og:description",
        content: "Vitreo-retina specialist and phaco surgeon offering comprehensive eye care in Bangladesh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
