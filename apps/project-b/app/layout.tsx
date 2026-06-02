import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project B",
  description: "Project B description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
