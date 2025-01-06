
export const metadata = {
  title: 'Sheyonce Admin',
  description: 'Admin dashboard',
}

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <main>{children}</main>
    </div>
  );
}
