import { apiGet } from "../../../lib/api";

type Car = {
  title: string;
  brand: string;
  year: number;
  coverImage: string | null;
  specs: any | null;
};

export default async function CarPage({
  params,
}: {
  params: { slug: string };
}) {
  const car = await apiGet<Car>(`/cars/${params.slug}`);

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">{car.title}</h1>
        <p className="mt-2 text-sm opacity-70">
          {car.brand} • {car.year}
        </p>

        {car.coverImage ? (
          <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-black/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={car.coverImage}
              alt={car.title}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">مشخصات</h2>

          {car.specs ? (
            <pre className="mt-4 overflow-auto rounded-xl bg-black/30 p-4 text-sm opacity-80" dir="ltr">
              {JSON.stringify(car.specs, null, 2)}
            </pre>
          ) : (
            <p className="mt-4 text-sm opacity-70">فعلاً مشخصاتی ثبت نشده.</p>
          )}
        </div>
      </div>
    </main>
  );
}
