
export const metadata = {
  title: 'Sheyonce Dashboard',
  description: 'Admin dashboard for Sheyonce fashion store',
}

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <main>{children}</main>
    </div>
  );
}
