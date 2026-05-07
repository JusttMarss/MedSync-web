import { ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import type { SharedProps } from '../types';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { url, props } = usePage<SharedProps>();
    const appName = props.appName || 'Healthcare App';

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/doctors', label: 'Dokter' },
    ];

    return (
        <>
            {/* ── Navbar ─────────────────────────────────── */}
            <nav className="navbar">
                <div className="navbar-inner">
                    <Link href="/" className="navbar-brand">
                        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="32" height="32" rx="8" fill="url(#grad)" />
                            <path d="M16 8v16M8 16h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="grad" x1="0" y1="0" x2="32" y2="32">
                                    <stop stopColor="#06b6d4" />
                                    <stop offset="1" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        {appName}
                    </Link>

                    <ul className="navbar-links">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={url === link.href ? 'active' : ''}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* ── Page Content ───────────────────────────── */}
            <main className="page-enter">
                {children}
            </main>

            {/* ── Footer ─────────────────────────────────── */}
            <footer className="footer">
                <div className="footer-inner">
                    <p>© {new Date().getFullYear()} {appName}. Dibuat dengan ❤️ menggunakan Laravel + Inertia.js + React</p>
                </div>
            </footer>
        </>
    );
}
