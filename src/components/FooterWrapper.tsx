'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ChangelogModal from './ChangelogModal';
import type { ChangelogEntry } from '@/lib/schema';

interface FooterWrapperProps {
  changelog: ChangelogEntry[];
}

export default function FooterWrapper({ changelog }: FooterWrapperProps) {
  const [showChangelog, setShowChangelog] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  const latest = changelog[0];

  return (
    <>
      <footer className="mt-8 px-4 py-5 border-t border-white/10">
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-xs text-white/30">
          <button
            onClick={() => setShowChangelog(true)}
            className="hover:text-white/60 transition-colors"
          >
            {latest ? `v${latest.version} · ${latest.releaseDate}` : 'Changelog'}
          </button>
          <span>·</span>
          <Link href="/privacidad" className="hover:text-white/60 transition-colors">
            Política de privacidad
          </Link>
          <span>·</span>
          <Link href="/admin" className="hover:text-white/60 transition-colors">
            Acceso editor
          </Link>
        </div>
      </footer>

      {showChangelog && (
        <ChangelogModal
          changelog={changelog}
          onClose={() => setShowChangelog(false)}
        />
      )}
    </>
  );
}
