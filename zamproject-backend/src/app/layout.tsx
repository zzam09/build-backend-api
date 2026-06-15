import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZAM Project Backend API",
  description: "Backend API for ZAM Project - Members, Badges, Events, and more",
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
