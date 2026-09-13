export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <aside className="w-full md:w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-wide">JP Admin</h2>
          <nav className="mt-8 space-y-2">
            <span className="block px-3 py-2 rounded-md bg-gray-800 text-sm font-medium">
              Dashboard Overview
            </span>
          </nav>
        </div>
        <div className="pt-6 border-t border-gray-800 text-xs text-gray-400">
          Admin Portal
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
