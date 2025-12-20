import TopNavbar from "@/components/TopNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
        <TopNavbar />
        {children}
    </div>
  );
}
