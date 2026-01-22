'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PenLine, User, Archive, Home } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/create', label: 'Create', icon: PenLine },
  { href: '/tweets', label: 'Archive', icon: Archive },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Tweet Writer
          </Link>
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
