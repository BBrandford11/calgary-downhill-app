import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calgary Downhill Racing",
  description: "Track and manage CDH longboarding events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="flex-shrink-0">
                  <span className="text-xl font-bold">CDH Racing</span>
                </a>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <a href="/events" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                      Events
                    </a>
                    <a href="/racers" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                      Racers
                    </a>
                    <a href="/leaderboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                      Leaderboard
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
        </main>
      </body>
    </html>
  );
}
