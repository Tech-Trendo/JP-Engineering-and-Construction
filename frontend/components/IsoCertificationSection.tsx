"use client";

import { useState } from "react";
import { getMediaUrl, PublicSiteSettings } from "@/lib/public-api";

interface IsoCertificationSectionProps {
  siteSettings?: PublicSiteSettings | null;
}

export default function IsoCertificationSection({ siteSettings }: IsoCertificationSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const certImg =
    getMediaUrl(siteSettings?.iso_certificate_image_url || siteSettings?.iso_certificate_image) ||
    "/media/site_settings/certificates/iso_9001_certificate.webp";

  const standard = siteSettings?.iso_standard || "ISO 9001:2015";
  const certNumber = siteSettings?.iso_certificate_number || "129594/A/0001/UK/En";
  const issueDate = siteSettings?.iso_issue_date || "18 November 2023";
  const expiryDate = siteSettings?.iso_expiry_date || "17 November 2026";
  const accreditation =
    siteSettings?.iso_accreditation ||
    "URS / UKAS Management Systems (0043) / IAF Multilateral Recognition Arrangement";
  const scope =
    siteSettings?.iso_scope ||
    "Manufacturing and Assembly of Reverse Osmosis Plant, Dairy Equipment's (Pasteurizer, Homogenizer, Chilling Vat, Road Milk Tanker), Cold Storage Equipment's, Solar Energy & Heat Pump System, Steel Fabrication";

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white via-slate-50 to-white border-t border-b border-gray-200" id="iso-certified">
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Certified Quality Management System</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1b3a6e] tracking-tight">
            {standard} Certified Engineering &amp; Manufacturing
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            JP Engineering &amp; Construction operates under an accredited Quality Management System certified by United Registrar of Systems (URS), UKAS Management Systems, and the International Accreditation Forum (IAF).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Certificate Interactive Preview Column */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-200 relative group">
              <div
                onClick={() => setModalOpen(true)}
                className="relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-slate-100 aspect-[3/4] flex items-center justify-center shadow-inner"
              >
                <img
                  src={certImg}
                  alt="ISO 9001:2015 Certificate of Registration"
                  className="w-full h-full object-contain p-2 group-hover:scale-[1.02] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                  <span className="inline-flex items-center gap-2 bg-[#1b3a6e] text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-md">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                    Click to Enlarge Certificate
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between px-1">
                <div>
                  <div className="text-xs font-bold text-[#1b3a6e]">Registration Certificate</div>
                  <div className="text-[11px] text-gray-500 font-mono">No. {certNumber}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="text-xs font-bold text-[#c8391a] hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Inspect Original</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Details & Accreditation Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#c8391a] mb-1">
                  Accreditation &amp; Governance
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1b3a6e]">
                  International Compliance Standards
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Our quality framework ensures every piece of industrial machinery, sanitary dairy fitting, water treatment plant, and insulated cold storage room is engineered according to stringent international technical benchmarks.
                </p>
              </div>

              {/* Certificate Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-gray-200">
                  <span className="text-gray-500 font-medium block">Standard &amp; Scheme:</span>
                  <span className="text-[#1b3a6e] font-extrabold text-sm">{standard}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-lg border border-gray-200">
                  <span className="text-gray-500 font-medium block">Certificate Number:</span>
                  <span className="text-[#1b3a6e] font-extrabold text-sm font-mono">{certNumber}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-lg border border-gray-200">
                  <span className="text-gray-500 font-medium block">Date of Issue:</span>
                  <span className="text-gray-800 font-bold">{issueDate}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-lg border border-gray-200">
                  <span className="text-gray-500 font-medium block">Current Expiry Date:</span>
                  <span className="text-emerald-700 font-bold">{expiryDate}</span>
                </div>
              </div>

              {/* Scope of Certification */}
              <div className="pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Certified Manufacturing Scope:
                </span>
                <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 text-xs text-gray-700 leading-relaxed font-medium">
                  {scope}
                </div>
              </div>

              {/* Accreditation Badges */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center gap-3">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Accredited by:
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-md text-xs font-bold">
                  URS (United Registrar of Systems)
                </span>
                <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-xs font-bold">
                  UKAS Management Systems (0043)
                </span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-md text-xs font-bold">
                  IAF Multilateral Recognition
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Resolution Certificate Lightbox Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2 sm:p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 px-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-bold text-sm text-[#1b3a6e]">
                  Official ISO 9001:2015 Certificate of Registration
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-auto max-h-[calc(90vh-80px)] p-2 flex items-center justify-center bg-slate-50 rounded-lg mt-2">
              <img
                src={certImg}
                alt="ISO 9001:2015 Certificate of Registration Full Document"
                className="max-w-full h-auto object-contain rounded shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
