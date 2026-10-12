import { redirect } from "next/navigation";
import { getPengguna } from "@/lib/auth";
import { MENU_KADIV } from "@/components/panel-nav";
import { PanelShell } from "@/components/panel-shell";

export default async function LayoutKadiv({ children }: LayoutProps<"/kadiv">) {
  const user = await getPengguna();
  if (!user) redirect("/masuk");
  if (user.peran !== "KEPALA_DIVISI") redirect("/admin");

  // Kepala divisi tanpa divisi tidak punya apa pun untuk dikelola.
  if (!user.divisiId) redirect("/masuk?galat=tanpa-divisi");

  return (
    <PanelShell
      user={user}
      menu={MENU_KADIV}
      basePath="/kadiv"
      judul="Panel Kepala Divisi"
    >
      {children}
    </PanelShell>
  );
}