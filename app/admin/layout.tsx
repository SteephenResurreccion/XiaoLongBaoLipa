import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  if (session.user.email !== process.env.OWNER_GOOGLE_EMAIL) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-sm border border-red-200 p-10 text-center max-w-sm">
          <div className="text-4xl mb-4">🚫</div>
          <h1 className="text-xl font-bold text-red-700 mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm">
            This dashboard is only accessible to the store owner.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar email={session.user.email} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
