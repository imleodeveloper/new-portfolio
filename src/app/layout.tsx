import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Protest_Strike, Roboto } from "next/font/google";
import { ThemeProvider } from "@/lib/contexts/theme-context";
import { WhatsAppModalProvider } from "@/lib/contexts/whatsapp-modal-context";
import { BackgroundManager } from "../../components/ui/background-manager";
import { FloatingNav } from "../../components/ui/floating-nav";
import { FloatingWhatsApp } from "../../components/whatsapp/floating-whatsapp";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const protestStrike = Protest_Strike({
  variable: "--font-protest-strike",
  subsets: ["latin"],
  weight: "400",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Leonardo Vieira - FullStack Developer",
  description: "Portfólio de Leonardo Vieira, desenvolvedor Full-Stack especializado em aplicações web escaláveis e interativas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var parsed = theme ? JSON.parse(theme) : null;
                  if (parsed === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${protestStrike.variable} ${roboto.variable} antialiased relative overflow-x-hidden`}
      >
        <ThemeProvider>
          <BackgroundManager />
          <div className="relative z-[1]">
            <WhatsAppModalProvider>
              {children}
              <FloatingNav />
              <FloatingWhatsApp />
            </WhatsAppModalProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
