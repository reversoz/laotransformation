import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata = {
  title: "Transform Lao NFTs",
  description: "Transform your Lao NFTs",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
