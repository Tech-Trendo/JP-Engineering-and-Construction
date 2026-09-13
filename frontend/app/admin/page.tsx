export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage products, categories, quote requests, showcase items, and team members.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Categories & Products</h2>
          <p className="mt-2 text-sm text-gray-500">Catalog structure and items</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Quote Inquiries</h2>
          <p className="mt-2 text-sm text-gray-500">Customer requests and details</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Showcase & Partners</h2>
          <p className="mt-2 text-sm text-gray-500">Team, partners, and clients</p>
        </div>
      </div>
    </div>
  );
}
