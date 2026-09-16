export default function Loading() {
  return (
    <div className="w-full min-h-[70vh] bg-white animate-pulse">
      {/* Top micro loading strip */}
      <div className="w-full h-1 bg-gradient-to-r from-[#1b3a6e] via-[#c8391a] to-[#1b3a6e] animate-pulse" />

      {/* Hero / Header Skeleton cascading top to bottom */}
      <div className="bg-slate-100 py-12 border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-4 space-y-4">
          <div className="h-4 w-36 bg-slate-200 rounded-md" />
          <div className="h-9 w-3/5 max-w-md bg-slate-300 rounded-md" />
          <div className="h-4 w-4/5 max-w-xl bg-slate-200 rounded-md" />
        </div>
      </div>

      {/* Main Content Area Skeletons flowing downwards */}
      <div className="max-w-[1280px] mx-auto px-4 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-100 rounded-xl border border-slate-200/80 p-5 space-y-3">
            <div className="h-36 bg-slate-200 rounded-lg" />
            <div className="h-5 w-3/4 bg-slate-300 rounded" />
            <div className="h-4 w-1/2 bg-slate-200 rounded" />
          </div>
          <div className="h-64 bg-slate-100 rounded-xl border border-slate-200/80 p-5 space-y-3">
            <div className="h-36 bg-slate-200 rounded-lg" />
            <div className="h-5 w-3/4 bg-slate-300 rounded" />
            <div className="h-4 w-1/2 bg-slate-200 rounded" />
          </div>
          <div className="h-64 bg-slate-100 rounded-xl border border-slate-200/80 p-5 space-y-3">
            <div className="h-36 bg-slate-200 rounded-lg" />
            <div className="h-5 w-3/4 bg-slate-300 rounded" />
            <div className="h-4 w-1/2 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
