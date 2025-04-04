export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <main className="min-h-screen bg-vault-medium">
        {children}
      </main>
    );
  } 