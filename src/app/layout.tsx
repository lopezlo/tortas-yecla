import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import FooterWrapper from '@/components/FooterWrapper';
import PageTransition from '@/components/PageTransition';
import { getChangelog } from '@/lib/actions';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tortas Fritas de Yecla',
  description: 'Evalúa y descubre las mejores tortas fritas de Yecla',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const changelogEntries = await getChangelog();

  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-[#0f1117]">
          <main className="flex-1 max-w-lg mx-auto w-full pb-28">
            <PageTransition>
              {children}
              <FooterWrapper changelog={changelogEntries} />
            </PageTransition>
          </main>
          <Navigation />
        </div>
      </body>
    </html>
  );
}
