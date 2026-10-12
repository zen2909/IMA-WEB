import { SiteFooter, SiteHeader } from "@/components/publik";

export default function LayoutPublik({ children }: LayoutProps<"/">) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}