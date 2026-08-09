import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <main className="max-w-5xl px-2 py-4 pt-8">{children}</main>
    </div>
  );
}
