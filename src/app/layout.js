import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/context/LanguageContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { AuthProvider } from '@/context/AuthContext';
import { DbProvider } from '@/context/DbContext';
import FloatingContact from '@/components/layout/FloatingContact';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SolarPlex | Premium Enterprise Solar Platform",
  description: "Enterprise solar business management solution offering end-to-end solar solutions, active installation project tracking, real-time savings calculator, and advanced partner dashboard.",
  keywords: "solar energy, net metering pakistan, smart solar inverter, enterprise solar, Longi solar, Jinko solar, solar calculator, solar inventory, CRM solar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-slate-50 dark:bg-primary-dark text-slate-900 dark:text-slate-100 flex flex-col`}>
        <AuthProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <DbProvider>
                <div className="flex-1 flex flex-col min-h-screen">
                  {children}
                  <FloatingContact />
                </div>
              </DbProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
