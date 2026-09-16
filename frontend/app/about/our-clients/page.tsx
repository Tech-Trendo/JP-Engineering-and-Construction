"use client";

import { useState, useEffect, useMemo } from "react";
import PageBanner from "@/components/PageBanner";
import FaqSection from "@/components/FaqSection";
import { getPublicClients, getPublicSiteSettings, getMediaUrl, PublicClient, PublicSiteSettings } from "@/lib/public-api";

// Authentic client directory extracted directly from https://jpec.com.np/pages/our-client
interface ClientDirectoryItem {
  name: string;
  location?: string;
  category: "Government" | "Hospitals" | "NGO/INGO" | "Commercial";
}

const AUTHENTIC_CLIENT_DIRECTORY: ClientDirectoryItem[] = [
  // Government Institutions
  { name: "Master General Ordinance Provision (Nepal Army)", location: "Jangiadda, Kathmandu", category: "Government" },
  { name: "Crime Investigation Department (Police Headquarter)", location: "Naxal, Kathmandu", category: "Government" },
  { name: "Armed Police Force (APF)", location: "Swayambhu, Kathmandu", category: "Government" },
  { name: "Nepal Livestock Sector Innovation Project (NLSIP)", location: "Hariharbhawan, Lalitpur", category: "Government" },
  { name: "Agriculture Market Management Committee", location: "Birtamode, Jhapa", category: "Government" },
  { name: "Agriculture Development Directorate", location: "Bagmati Province, Hetauda", category: "Government" },
  { name: "Kathmandu Upatyaka Khanepani Limited (KUKL)", location: "Tripureshwor, Kathmandu", category: "Government" },
  { name: "Mai Municipality Office of The Municipal Executive", location: "Sitali, Ilam", category: "Government" },
  { name: "Barahakshetra Municipality Office", location: "Sunsari", category: "Government" },
  { name: "Aathbiskot Municipality Office", location: "Rukum (West)", category: "Government" },
  { name: "Province Dairy Development Board", location: "Bagmati Province, Hetauda", category: "Government" },
  { name: "National Maize & Research Center", location: "Rampur, Chitwan", category: "Government" },
  { name: "Central Veterinary Lab", location: "Tripureshwor, Kathmandu", category: "Government" },
  { name: "Sunkoshi Rural Municipality", location: "Sindhuli", category: "Government" },
  { name: "Ripumardini Sainik School", location: "Bansbari, Kathmandu", category: "Government" },
  { name: "National Plant Breeding & Genetics", location: "Khumaltar, Lalitpur", category: "Government" },

  // Hospitals & Medical Centers
  { name: "Nepal Medical College", location: "Jorpati, Kathmandu", category: "Hospitals" },
  { name: "Civil Service Hospital", location: "Minbhawan, Kathmandu", category: "Hospitals" },
  { name: "Nepal Bharat Maitri Hospital", location: "Chabahil, Kathmandu", category: "Hospitals" },
  { name: "Nepal Cancer Hospital & Research Center", location: "Harisiddhi, Lalitpur", category: "Hospitals" },
  { name: "Alka Hospital", location: "Jawalakhel, Lalitpur", category: "Hospitals" },
  { name: "Manmohan Cardiothoracic Vascular & Transplant Centre", location: "Maharajgunj, Kathmandu", category: "Hospitals" },
  { name: "Tribhuvan University Teaching Hospital", location: "Maharajgunj, Kathmandu", category: "Hospitals" },
  { name: "Helios Hospital", location: "Lalitpur", category: "Hospitals" },
  { name: "Hetauda Hospital", location: "Hetauda, Makwanpur", category: "Hospitals" },
  { name: "Birendra Hospital (Nepal Army)", location: "Chauni, Kathmandu", category: "Hospitals" },
  { name: "District Hospital Siraha", location: "Siraha", category: "Hospitals" },
  { name: "NAMS Bir Hospital", location: "Mahabouddha, Kathmandu", category: "Hospitals" },
  { name: "Nidan Hospital", location: "Pulchowk, Lalitpur", category: "Hospitals" },
  { name: "Bhaktapur Cancer Hospital", location: "Bhaktapur", category: "Hospitals" },
  { name: "Human Organ Transplant Center", location: "Bhaktapur", category: "Hospitals" },
  { name: "Mark Kidney Center", location: "Mahendranagar", category: "Hospitals" },
  { name: "Save Life Hospital and Research Center", location: "Janakpur", category: "Hospitals" },
  { name: "Madhyabindu Hospital", location: "Danda, Nawalpur", category: "Hospitals" },
  { name: "Lamjung Hospital", location: "Besisahar, Lamjung", category: "Hospitals" },
  { name: "Ilam Hospital", location: "Ilam", category: "Hospitals" },
  { name: "Gorkha Hospital", location: "Gorkha", category: "Hospitals" },
  { name: "Seti Zonal Hospital", location: "Dhangadhi, Kailali", category: "Hospitals" },
  { name: "HAMS Hospital", location: "Dhumbarahi, Kathmandu", category: "Hospitals" },
  { name: "Gajendra Narayan Singh Hospital", location: "Rajbiraj, Saptari", category: "Hospitals" },
  { name: "Ramechhap District Hospital", location: "Manthali, Ramechhap", category: "Hospitals" },
  { name: "B.P. Koirala Institute of Health Sciences", location: "Dharan, Sunsari", category: "Hospitals" },
  { name: "Nepal Aushadhi Limited", location: "Babarmahal, Kathmandu", category: "Hospitals" },
  { name: "Ashtanga Pharmaceutical Pvt. Ltd.", location: "Kathmandu", category: "Hospitals" },
  { name: "Brahma Ayurved Udhyog", location: "Dhangadhi", category: "Hospitals" },

  // NGO / INGO
  { name: "United States Pharmacopeia Convention (USP / USAID)", location: "International Project", category: "NGO/INGO" },
  { name: "UNOPS (United Nations Office for Project Services / USAID)", location: "International Project", category: "NGO/INGO" },
  { name: "Family Health International (FHI 360)", location: "Kathmandu", category: "NGO/INGO" },
  { name: "Helping Hand International", location: "Nepal Program", category: "NGO/INGO" },
  { name: "Hesra Nepal", location: "Kathmandu", category: "NGO/INGO" },

  // Commercial & Industrial Plants
  { name: "Eastern Food & Beverage Pvt. Ltd.", location: "Kamal Gaunpalika, Jhapa", category: "Commercial" },
  { name: "Boudha Gramin Multipurpose Co-Operative", location: "Birendranagar, Surkhet", category: "Commercial" },
  { name: "Shikher Organization Pvt. Ltd.", location: "Jorpati, Kathmandu", category: "Commercial" },
  { name: "Gaurab Food & Beverage Pvt. Ltd.", location: "Janakpur", category: "Commercial" },
  { name: "Tila Karnali Pani Prasodhan Udhyog", location: "Birendranagar, Surkhet", category: "Commercial" },
  { name: "RR Drinking Water", location: "Birendranagar, Surkhet", category: "Commercial" },
  { name: "Rara Processing Udhyog", location: "Ghorahi, Dang", category: "Commercial" },
  { name: "NM Drinking Water", location: "Dang", category: "Commercial" },
  { name: "Rapti Drinking Water", location: "Dang", category: "Commercial" },
  { name: "Life Ok Mineral Water", location: "Nepalgunj", category: "Commercial" },
  { name: "Swargadwari Drinking Water", location: "Dang", category: "Commercial" },
  { name: "Madital Drinking Water", location: "Madital, Doti", category: "Commercial" },
  { name: "Akash Ganga Drinking Water", location: "Kailali", category: "Commercial" },
  { name: "Crystillo Mineral Water", location: "Nepalgunj", category: "Commercial" },
  { name: "Mountain Mineral Water", location: "Dang", category: "Commercial" },
  { name: "Western International", location: "Butwal", category: "Commercial" },
  { name: "Sunwal NP Group", location: "Butwal", category: "Commercial" },
  { name: "Everest Food & Beverage", location: "Butwal", category: "Commercial" },
  { name: "Pathak Khadya Masala Udhyog", location: "Bardaghat, Nawalparasi", category: "Commercial" },
  { name: "Sauraha Refresh Mineral Water", location: "Sauraha, Chitwan", category: "Commercial" },
  { name: "Brother Food & Beverage", location: "Chitwan", category: "Commercial" },
  { name: "Suman Mineral Water", location: "Chitwan", category: "Commercial" },
  { name: "Manaslu Beverage", location: "Chitwan", category: "Commercial" },
  { name: "Iceland Drop Mineral Water", location: "Chitwan", category: "Commercial" },
  { name: "Nil Kamal Polymers", location: "Chitwan", category: "Commercial" },
  { name: "C & C Mineral Water", location: "Chitwan", category: "Commercial" },
  { name: "Pokhara Natural Foods", location: "Pokhara", category: "Commercial" },
  { name: "Mitho Pani Industry", location: "Pokhara", category: "Commercial" },
  { name: "Spring Lay Drinking Water", location: "Pokhara", category: "Commercial" },
  { name: "Lekhnath Suddha Khanepani", location: "Pokhara", category: "Commercial" },
  { name: "G3 Beverage", location: "Pokhara", category: "Commercial" },
  { name: "Pokhara Meat Mart", location: "Pokhara", category: "Commercial" },
  { name: "Family Meat Mart", location: "Pokhara", category: "Commercial" },
  { name: "Jagat Kalyan Dugdha Utpadak Sahakari", location: "Pokhara", category: "Commercial" },
  { name: "Pokhara Foods", location: "Pokhara", category: "Commercial" },
  { name: "Anup Jal Mineral Water Udhyog", location: "Hetauda", category: "Commercial" },
  { name: "Natural Beverage", location: "Hetauda", category: "Commercial" },
  { name: "Yazat Food & Beverage Pvt. Ltd.", location: "Simara, Bara", category: "Commercial" },
  { name: "PRD Food & Beverage", location: "Simara, Bara", category: "Commercial" },
  { name: "Shiva Shankar Multi Agro", location: "Simara, Bara", category: "Commercial" },
  { name: "National Water", location: "Birgunj", category: "Commercial" },
  { name: "Gadimai Natural Resources", location: "Gadimai, Bara", category: "Commercial" },
  { name: "Birgunj Food Industries", location: "Birgunj", category: "Commercial" },
  { name: "Sirish Pani", location: "Sarlahi", category: "Commercial" },
  { name: "Moon Drops Food & Beverage", location: "Chapur", category: "Commercial" },
  { name: "Sarbashrestha Beverage", location: "Bardibas", category: "Commercial" },
  { name: "Indira Jal", location: "Golbajar", category: "Commercial" },
  { name: "Aqua Plus Sindhuli Beverage", location: "Sindhuli", category: "Commercial" },
  { name: "Pure Plus Sindhuli", location: "Katari, Udayapur", category: "Commercial" },
  { name: "Anu Foods & Beverage", location: "Rajbiraj", category: "Commercial" },
  { name: "Shanti Jal Udhyog", location: "Biratnagar", category: "Commercial" },
  { name: "Dibeshwori Jal", location: "Biratnagar", category: "Commercial" },
  { name: "Himdhara Beverage", location: "Itahari", category: "Commercial" },
  { name: "Easy Rider Beverage", location: "Dharan", category: "Commercial" },
  { name: "Purbi Byapar", location: "Dharan", category: "Commercial" },
  { name: "Parijal Jal", location: "Itahari", category: "Commercial" },
  { name: "Mitra Jal Udhyog", location: "Salakpur", category: "Commercial" },
  { name: "Clan Aqua", location: "Morang", category: "Commercial" },
  { name: "Sunmai Water", location: "Jhapa", category: "Commercial" },
  { name: "Kanchan Pani", location: "Surunga, Jhapa", category: "Commercial" },
  { name: "Trishna Pani", location: "Birtamode, Jhapa", category: "Commercial" },
  { name: "Life Care Water", location: "Birtamode, Jhapa", category: "Commercial" },
  { name: "Aqua Everest", location: "Khurkot, Sindhuli", category: "Commercial" },
  { name: "Hamro Pani", location: "Mulpani, Kathmandu", category: "Commercial" },
  { name: "Good Day Pani", location: "Pepsicola, Kathmandu", category: "Commercial" },
  { name: "Aqua Minerals Nepal (Aqua 100)", location: "Balaju, Kathmandu", category: "Commercial" },
  { name: "MNK Mineral", location: "Bhaktapur", category: "Commercial" },
  { name: "Bhumi Beverage", location: "Banepa, Kavre", category: "Commercial" },
  { name: "Himal Agro Multipurpose", location: "Kavre", category: "Commercial" },
  { name: "Royal Kathmandu Himalayan Beverage", location: "Kathmandu", category: "Commercial" },
  { name: "Sankata Wine", location: "Banepa", category: "Commercial" },
  { name: "Shree Mahakali Wine", location: "Dhading", category: "Commercial" },
  { name: "Like Natural Lele Wine", location: "Lalitpur", category: "Commercial" },
  { name: "Sakaro Fermented Beverage", location: "Kathmandu", category: "Commercial" },
  { name: "Canery Wine", location: "Kathmandu", category: "Commercial" },
  { name: "Aqua Old", location: "Jorpati, Kathmandu", category: "Commercial" },
  { name: "A & B Beverage", location: "Jorpati, Kathmandu", category: "Commercial" },
  { name: "Aqua Soon", location: "Kathmandu", category: "Commercial" },
  { name: "Sundarijal Mineral Water Plant", location: "Kathmandu", category: "Commercial" },
  { name: "Agraj Group Industries", location: "Kathmandu", category: "Commercial" },
  { name: "Himalayan Spring", location: "Chalnakhel, Kathmandu", category: "Commercial" },
  { name: "Eastern Beverage Pvt. Ltd.", location: "Jhapa", category: "Commercial" },
  { name: "Prasid Water Solution (Spring Fobs)", location: "Godawari, Lalitpur", category: "Commercial" },
  { name: "M.B Beverage Udhyog", location: "Jorpati, Kathmandu", category: "Commercial" },
  { name: "Kanchanjunga Food & Beverage Pvt. Ltd.", location: "Matatirtha, Kathmandu", category: "Commercial" },
  { name: "Diwas Food & Beverage", location: "Matatirtha, Kathmandu", category: "Commercial" },
  { name: "K.A.S Group", location: "Bhaisepati, Lalitpur", category: "Commercial" },
  { name: "Baral Khanepani", location: "Jorpati, Kathmandu", category: "Commercial" },
  { name: "United Beverage", location: "Tandi, Chitwan", category: "Commercial" },
  { name: "Megha Food & Beverage", location: "Tilottama, Rupandehi", category: "Commercial" },
  { name: "Aqua Penguin", location: "Pokhara, Kaski", category: "Commercial" },
  { name: "Annapurna Food & Beverage Pvt. Ltd.", location: "Pokhara, Kaski", category: "Commercial" },
  { name: "Cristilo Mineral Water Pvt. Ltd.", location: "Pokhara", category: "Commercial" },
  { name: "Agam Food & Beverage", location: "Chitwan", category: "Commercial" },
  { name: "L & B Mineral Water & Beverage Pvt. Ltd.", location: "Pokhara, Kaski", category: "Commercial" },
  { name: "Spring Mineral Water of Matatirtha", location: "Matatirtha, Kathmandu", category: "Commercial" },
  { name: "Ramri Food & Beverage", location: "Dang", category: "Commercial" },
  { name: "True Solution", location: "Gaguri, Dhading", category: "Commercial" },
  { name: "A-One Polymers Pvt. Ltd.", location: "Mulpani, Kathmandu", category: "Commercial" },
  { name: "Luniva Beverage Pvt. Ltd.", location: "Banepa, Kavre", category: "Commercial" },
  { name: "S & B Food & Beverage", location: "Damauli, Tanahun", category: "Commercial" },
  { name: "Rakesh Mukesh Food & Beverage", location: "Chapur", category: "Commercial" },
  { name: "Green Suppliers", location: "Malangwa", category: "Commercial" },
  { name: "Smart Drinking Water Udhyog", location: "Ranipouwa, Pokhara", category: "Commercial" },
  { name: "Buddha Bhumi Beverage Pvt. Ltd.", location: "Banepa, Kavre", category: "Commercial" },
  { name: "Heritage Beverage Pvt. Ltd.", location: "Bhaktapur", category: "Commercial" },
];

export default function OurClientsPage() {
  const [loading, setLoading] = useState(true);
  const [featuredClients, setFeaturedClients] = useState<PublicClient[]>([]);
  const [siteSettings, setSiteSettings] = useState<PublicSiteSettings | null>(null);
  const [hasError, setHasError] = useState(false);

  // Directory filter state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

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
          setFeaturedClients(clientsRes.value);
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

  const filteredDirectory = useMemo(() => {
    return AUTHENTIC_CLIENT_DIRECTORY.filter((item) => {
      const matchCat = selectedCategory === "All" || item.category === selectedCategory;
      const matchSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <PageBanner
        title="Our Valued Clients"
        breadcrumbs={[{ label: "About Us" }, { label: "Our Clients" }]}
      />

      {/* Featured Institutional Clients with Official Logos */}
      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
              Trusted By
            </span>
            <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-3">
              Institutional Partners &amp; Government Bodies
            </h2>
            <p className="text-gray-500 text-[14px] max-w-[640px] mx-auto">
              JP Engineering &amp; Construction takes pride in delivering state-of-the-art turnkey industrial machinery, water treatment systems, and cold chain infrastructure to Nepal&apos;s leading institutions.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-40 bg-gray-100 rounded-lg" />
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
          ) : featuredClients.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredClients.map((client) => (
                <div
                  key={client.id}
                  className="bg-[#f8f9fb] border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center min-h-[160px] text-center hover:border-[#1b3a6e] hover:shadow-lg transition-all group relative"
                >
                  {client.logo ? (
                    <div className="w-full h-20 mb-3 flex items-center justify-center p-1 bg-white rounded border border-gray-100 shadow-xs">
                      <img
                        src={getMediaUrl(client.logo)}
                        alt={client.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : null}
                  <h3 className="text-[#1b3a6e] font-bold text-sm leading-snug group-hover:text-[#c8391a] transition-colors mt-2">
                    {client.name}
                  </h3>
                  {client.website_url && (
                    <a
                      href={client.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#c8391a] hover:underline mt-2 font-medium inline-flex items-center gap-1"
                    >
                      Official Website &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Comprehensive Categorized Client Directory */}
      <section className="py-14 bg-gray-50 border-t border-gray-200">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-[#c8391a] text-xs font-semibold uppercase tracking-widest">
              Nationwide Portfolio
            </span>
            <h2 className="text-[#1b3a6e] text-2xl md:text-3xl font-bold mt-2 mb-3">
              Our Complete Valued Clients Directory
            </h2>
            <p className="text-gray-500 text-[14px] max-w-[620px] mx-auto">
              Trusted by government ministries, leading healthcare networks, international development agencies, and food &amp; beverage manufacturers across all 7 provinces of Nepal.
            </p>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              {["All", "Government", "Hospitals", "NGO/INGO", "Commercial"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#1b3a6e] text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat === "All" ? `All Sectors (${AUTHENTIC_CLIENT_DIRECTORY.length})` : cat}
                </button>
              ))}
            </div>

            <div className="w-full md:w-72">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search client or district..."
                  className="w-full px-3 py-2 pl-9 text-xs bg-gray-50 border border-gray-300 rounded focus:outline-hidden focus:border-[#1b3a6e] text-gray-800"
                />
                <svg
                  className="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDirectory.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#1b3a6e] hover:shadow-xs transition-all flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#1b3a6e] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 border border-blue-100">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        item.category === "Government"
                          ? "bg-blue-100 text-blue-800"
                          : item.category === "Hospitals"
                          ? "bg-red-100 text-red-800"
                          : item.category === "NGO/INGO"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-gray-900 font-semibold text-xs leading-snug">
                    {item.name}
                  </h4>
                  {item.location && (
                    <p className="text-gray-500 text-[11px] mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {item.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredDirectory.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-gray-500 text-xs">No client found matching your filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      <FaqSection
        pageKey="our-clients"
        badge="Client Experience FAQ"
        title="Our Clients & Project Installations FAQ"
        subtitle="Common questions regarding reference sites, institutional clients, and post-installation service across Nepal."
        faqs={[
          {
            question: "Which major national organizations are clients of JP Engineering?",
            answer:
              "Our clients include leading government and healthcare bodies such as Nepal Cancer Hospital, National Maize Research Center, Save Life Hospital, along with prominent commercial dairy processors and mineral water plants across Nepal.",
          },
          {
            question: "Can prospective clients visit reference installations in Nepal?",
            answer:
              "Yes. With prior coordination, we organize client visits to operational dairy, water treatment, and cold storage facilities so you can inspect machine build quality and talk with plant operating managers.",
          },
          {
            question: "What technical handover documentation is provided to clients?",
            answer:
              "We provide complete engineering documentation including as-built CAD drawings, P&ID schematics, electrical circuit diagrams, equipment test certificates, and operation manuals.",
          },
          {
            question: "What ongoing maintenance support is guaranteed after commissioning?",
            answer:
              "We support all our client installations with 24/7 technical hotline access, emergency breakdown dispatch within 24 hours, scheduled quarterly servicing, and genuine replacement spare parts.",
          },
        ]}
      />
    </>
  );
}
