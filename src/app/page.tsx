import LogOutButton from "@/components/logout-button";
import RecipeList from "@/components/recipe-list";
import UrlForm from "@/components/url-form";
import { requireUser } from "@/data/user/verify-user";
import { LoaderCircle } from "lucide-react";
import { Suspense } from "react";

export default async function Home() {
  const user = await requireUser();

  const fullName = user.name;

  return (
    <div>
      <header className="flex w-full p-2 px-6">
        <nav className="grow">Godkväll {fullName}</nav>
        <LogOutButton />
      </header>
      <main className="mx-auto grid max-w-4xl gap-8 p-4 pt-8">
        <h1 className="text-center text-3xl">Middagsflyt</h1>
        <UrlForm />
        <Suspense
          fallback={
            <div className="flex items-center gap-2">
              <span>Läser in recept</span>
              <LoaderCircle className="size-4 animate-spin" />
            </div>
          }
        >
          <RecipeList />
        </Suspense>
      </main>
    </div>
  );
}
