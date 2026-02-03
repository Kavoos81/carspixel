import { apiGet } from "../lib/api";
import HomeClient from "@/components/HomeClient";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
};

type Car = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  year: number;
  coverImage: string | null;
};

export default async function HomePage() {
  const [cars, articles] = await Promise.all([
    apiGet<Car[]>("/cars"),
    apiGet<Article[]>("/articles"),
  ]);

  return <HomeClient cars={cars} articles={articles} />;
}
