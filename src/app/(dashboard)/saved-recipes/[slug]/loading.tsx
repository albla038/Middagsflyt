import Header, { BreadcrumbItem } from "@/app/(dashboard)/_components/header";
import { Spinner } from "@/components/ui/spinner";

const breadcrumbs: BreadcrumbItem[] = [
  {
    label: "Sparade recept",
    href: "/saved-recipes",
  },
  {
    label: <Spinner />,
  },
];

export default function SavedRecipeLoading() {
  return (
    <>
      <Header breadcrumbs={breadcrumbs} />
      <main className="max-w-5xl px-2 py-4 pt-8">
        <p>Läser in recept...</p>
      </main>
    </>
  );
}
