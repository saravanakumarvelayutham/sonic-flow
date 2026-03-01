import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SonicFlow - AI Music Library",
  description: "Your intelligent music experience powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Script id="low-bandwidth-detect" strategy="beforeInteractive">
          {`(function(){try{var c=navigator.connection||navigator.mozConnection||navigator.webkitConnection;var t=(c&&c.effectiveType)||'';var low=!!(c&&(c.saveData||t==='slow-2g'||t==='2g'));if(low){document.documentElement.setAttribute('data-low-bandwidth','true');}}catch(_e){}})();`}
        </Script>
        {children}
      </body>
    </html>
  );
}