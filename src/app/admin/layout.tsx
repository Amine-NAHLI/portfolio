import { ForceDarkTheme } from "@/components/admin/ForceDarkTheme";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ForceDarkTheme />
      {children}
    </>
  );
}
