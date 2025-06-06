import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata = {
  title: "Reversoz Transformation",
  description: "Upgrade your LAO NFTs",
  icons: {
    icon: [
      {
        url: "/oz logo.svg",
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
