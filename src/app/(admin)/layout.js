import { Toaster } from "react-hot-toast";

export const metadata = {
  title: 'Sheyonce Admin',
  description: 'Admin dashboard',
}

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <Toaster />
      <main>{children}</main>
    </div>
  );
}
