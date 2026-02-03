import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-bold">Carspixel</p>
            <p className="mt-2 text-sm opacity-70">
              مجله + فروشگاه خودرو. تجربه سریع، تمیز، و آماده رشد.
            </p>
          </div>

          <div className="flex gap-10 text-sm">
            <div className="space-y-2">
              <p className="opacity-60">صفحات</p>
              <Link className="block opacity-80 hover:opacity-100" href="/cars">خودروها</Link>
              <Link className="block opacity-80 hover:opacity-100" href="/articles">مجله</Link>
              <Link className="block opacity-80 hover:opacity-100" href="/products">فروشگاه</Link>
            </div>

            <div className="space-y-2">
              <p className="opacity-60">مدیریت</p>
              <Link className="block opacity-80 hover:opacity-100" href="/admin">پنل ادمین</Link>
            </div>
          </div>
        </div>

        <p className="mt-10 text-xs opacity-50">
          © {new Date().getFullYear()} Carspixel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
