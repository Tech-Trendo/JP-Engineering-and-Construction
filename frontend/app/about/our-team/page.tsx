"use client";

import { useState, useEffect } from "react";
import PageBanner from "@/components/PageBanner";
import FaqSection from "@/components/FaqSection";
import { getPublicTeam, getMediaUrl, PublicTeamMember } from "@/lib/public-api";

export default function OurTeamPage() {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<PublicTeamMember[]>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadTeam() {
      setLoading(true);
      setHasError(false);
      try {
        const data = await getPublicTeam();
        setTeam(data);
      } catch (err) {
        console.error("[OurTeamPage] fetch error:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, []);

  return (
    <>
      <PageBanner
        title="Our Engineering &amp; Management Team"
        breadcrumbs={[{ label: "About Us" }, { label: "Our Team" }]}
      />

      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
              Our People
            </span>
            <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-3">
              Meet Our Expert Team
            </h2>
            <p className="text-gray-500 text-[14px] max-w-[620px] mx-auto">
              Our multidisciplinary team of qualified engineers, machinery specialists, and project managers brings proven expertise to every plant installation.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded overflow-hidden h-80">
                  <div className="h-56 bg-gray-100" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : hasError ? (
            <div className="p-12 border border-red-200 bg-red-50 text-center rounded-lg max-w-lg mx-auto my-8">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 font-bold text-xl">
                !
              </div>
              <h3 className="text-red-800 font-bold text-lg mb-1">Unable to load team</h3>
              <p className="text-red-700 text-sm leading-relaxed mb-4">
                Team member details could not be loaded from the backend API.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-2 bg-[#c8391a] hover:bg-[#a62d14] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-sm hover:shadow transition-all"
              >
                Retry
              </button>
            </div>
          ) : team.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="relative h-64 bg-gray-100 overflow-hidden flex items-center justify-center">
                    {member.photo ? (
                      <img
                        src={getMediaUrl(member.photo)}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1b3a6e]/5 flex flex-col items-center justify-center text-gray-400">
                        <svg className="w-16 h-16 mb-2 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span className="text-xs">Team Member</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[#1b3a6e] font-bold text-base group-hover:text-[#c8391a] transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-gray-500 text-xs font-medium mt-1">
                        {member.designation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded border border-gray-200 p-8">
              <p className="text-gray-500 text-sm">
                Team member details are currently being updated in the CMS.
              </p>
            </div>
          )}
        </div>
      </section>

      <FaqSection
        pageKey="our-team"
        badge="Engineering Team FAQ"
        title="Our Technical Specialists & Project Leads FAQ"
        subtitle="Common questions about engineering qualifications, on-site safety, CAD design, and operational operator training."
      />
    </>
  );
}
