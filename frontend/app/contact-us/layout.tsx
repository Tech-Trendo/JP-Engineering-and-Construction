import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Request a Project Quotation",
  description:
    "Contact JP Engineering & Construction Pvt. Ltd. for turnkey machinery inquiries, custom engineering fabrication, and site consultation in Nepal. Call 01-5385552 or email info@jpec.com.np.",
  alternates: {
    canonical: "/contact-us",
  },
  openGraph: {
    title: "Contact Us & Request a Quotation | JP Engineering & Construction",
    description:
      "Contact JP Engineering & Construction Pvt. Ltd. for turnkey machinery inquiries, custom engineering fabrication, and site consultation in Nepal.",
    url: "https://jpengineering.com.np/contact-us",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact JP Engineering & Construction Pvt. Ltd.",
    description:
      "Contact details, inquiry form, and physical office location of JP Engineering & Construction in Kathmandu, Nepal.",
    url: "https://jpengineering.com.np/contact-us",
    mainEntity: {
      "@type": "Organization",
      name: "JP Engineering & Construction Pvt. Ltd.",
      telephone: "+977-01-5385552",
      email: "info@jpec.com.np",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kathmandu",
        addressLocality: "Kathmandu",
        addressRegion: "Bagmati",
        addressCountry: "NP",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      {children}
    </>
  );
}
