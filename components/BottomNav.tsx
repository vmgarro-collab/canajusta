'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Map, BarChart3, Plus, User } from 'lucide-react';

const items = [
  { href: '/mapa', icon: Map, label: 'Mapa' },
  { href: '/ranking', icon: BarChart3, label: 'Rankings' },
  { href: '/añadir', icon: Plus, label: 'Añadir' },
  { href: '/perfil', icon: User, label: 'Yo' },
];

export default function BottomNav({ fixed = true }: { fixed?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={`${fixed ? 'fixed bottom-0 left-0 right-0 z-50' : 'flex-none'} bg-[#1A1A1A] border-t border-[#D3D1C7]/20`}>
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href === '/mapa' && pathname.startsWith('/bar'));
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 py-2 px-4"
            >
              <Icon
                size={22}
                className={active ? 'text-[#EF9F27]' : 'text-[#D3D1C7]'}
              />
              <span
                className={`text-xs ${active ? 'text-[#EF9F27]' : 'text-[#5F5E5A]'}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
