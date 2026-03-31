import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Xiao Long Bow — Chocolate Xiao Long Bao in Lipa City, Batangas | Order Online",
  description:
    "Order handmade Chocolate Xiao Long Bao online. Delivery and pickup available in Lipa City, Batangas. Fresh, made-to-order dumplings by Xiao Long Bow.",
  openGraph: {
    title: "Xiao Long Bow — Chocolate Xiao Long Bao in Lipa City, Batangas | Order Online",
    description:
      "Order handmade Chocolate Xiao Long Bao online. Delivery and pickup available in Lipa City, Batangas. Fresh, made-to-order dumplings by Xiao Long Bow.",
    siteName: "Xiao Long Bow",
    locale: "en_PH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  return (
    <html lang="en" className={inter.className}>
      <head>
        <meta name="color-scheme" content="light" />
        {gaId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col bg-[#FDF6EC]">
        {children}
      </body>
    </html>
  );
}
