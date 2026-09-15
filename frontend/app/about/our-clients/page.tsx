"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import { getPublicClients, getPublicSiteSettings, getMediaUrl, PublicClient, PublicSiteSettings } from "@/lib/public-api";

export default function OurClientsPage() {
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<PublicClient[]>([]);
  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadClients() {
      setLoading(true);
      setHasError(false);
      try {
        const [clientsRes, settingsRes] = await Promise.allSettled([
          getPublicClients(),
          getPublicSiteSettings(),
        ]);

        if (clientsRes.status === "fulfilled") {
          setClients(clientsRes.value);
        } else {
          setHasError(true);
        }

        if (settingsRes.status === "fulfilled") {
          setSiteSettings(settingsRes.value);
        }
      } catch (err) {
        console.error("[OurClientsPage] fetch error:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }

    loadClients();
  }, []);

  return (
    <>
      <PageBanner
        title="Our Valued Clients"
        breadcrumbs={[{ label: "About Us" }, { label: "Our Clients" }]}
      />

      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
              Trusted By
            </span>
            <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-3">
              Industry Leaders &amp; Public Institutions
            </h2>
            <p className="text-gray-500 text-[14px] max-w-[620px] mx-auto">
              {siteSettings?.company_name
                ? `${siteSettings.company_name} takes pride in having delivered successful machinery and turnkey engineering projects across Nepal.`
                : "Delivering industrial machinery and turnkey processing installations across Nepal."}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-36 bg-gray-100 rounded-lg" />
              ))}
            </div>
          ) : hasError ? (
            <div className="p-12 border border-red-200 bg-red-50 text-center rounded-lg max-w-lg mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                !
              </div>
              <h3 className="text-red-800 font-bold text-lg mb-1">Unable to load clients</h3>
              <p className="text-red-700 text-sm leading-relaxed mb-4">
                Client organizations could not be loaded from the backend API.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
              >
                Retry
              </button>
            </div>
          ) : clients.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="bg-[#f8f9fb] border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-[140px] text-center hover:border-[#1b3a6e] hover:shadow-md transition-all group"
                >
                  {client.logo ? (
                    <div className="w-full h-16 mb-3 flex items-center justify-center">
                      <img
                        src={getMediaUrl(client.logo)}
                        alt={client.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : null}
                  <h3 className="text-[#1b3a6e] font-bold text-sm leading-snug group-hover:text-[#c8391a] transition-colors">
                    {client.name}
                  </h3>
                  {client.website_url && (
                    <a
                      href={client.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-[#c8391a] mt-2 underline"
                    >
                      Visit Website &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded border border-gray-200 p-8">
              <p className="text-gray-500 text-sm">
                Client listings are currently being updated in the CMS.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
