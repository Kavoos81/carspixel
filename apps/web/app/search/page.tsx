export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? "";

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold">نتایج جستجو</h1>
        <p className="mt-2 text-sm opacity-70">
          عبارت: <span className="opacity-100">{q}</span>
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="opacity-70">
            فعلاً این صفحه UI است. مرحله بعدی، وصل کردن جستجو به Cars / Articles / Products است.
          </p>
        </div>
      </div>
    </main>
  );
}
