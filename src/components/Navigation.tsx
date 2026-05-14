'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, Trophy, Map, PlusCircle } from 'lucide-react';

const navItems = [
  { href: '/', icon: ClipboardList, label: 'Evaluar' },
  { href: '/ranking', icon: Trophy, label: 'Ranking' },
  { href: '/mapa', icon: Map, label: 'Mapa' },
  { href: '/sugerir', icon: PlusCircle, label: 'Sugerir' },
];

export default function Navigation() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="max-w-lg mx-auto">
        <div className="mx-3 mb-3 bg-stone-950 rounded-2xl shadow-2xl shadow-stone-900/40">
          <div className="flex px-2 py-1">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex-1 flex flex-col items-center py-2.5 gap-1 relative"
                >
                  {active && (
                    <div className="absolute inset-x-1 top-1 bottom-1 bg-white/10 rounded-xl" />
                  )}
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 1.75}
                    className={active ? 'text-amber-400 relative' : 'text-stone-500 relative'}
                  />
                  <span
                    className={[
                      'text-[10px] font-bold tracking-wide relative',
                      active ? 'text-amber-400' : 'text-stone-500',
                    ].join(' ')}
                  >
                    {label.toUpperCase()}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
