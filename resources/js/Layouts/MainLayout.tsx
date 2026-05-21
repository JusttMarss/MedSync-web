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
        { href: '/doctors', label: 'Doctors' },
    ];

    const authLinks = props.auth?.user
        ? [
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/appointments', label: 'Appointments' },
            { href: '/schedule', label: 'Schedule' },
            { href: '/profile', label: 'Profile' },
        ]
        : [
            { href: '/login', label: 'Login' },
            { href: '/register', label: 'Sign Up' },
        ];

    return (
        <>
            {props.auth?.user ? (
                <div className="app-shell">
                    <aside className="app-sidebar">
                        <div className="app-sidebar-brand">
                            <div className="brand-mark">M</div>
                            <div>
                                <p className="brand-title">MedSync Pro</p>
                                <p className="brand-subtitle">Patient Portal</p>
                            </div>
                        </div>
                        <nav className="app-nav">
                            {authLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={url === link.href ? 'app-nav-item active' : 'app-nav-item'}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="app-sidebar-footer">
                            <Link href="/logout" method="post" as="button" className="btn btn-ghost logout-button">
                                Logout
                            </Link>
                        </div>
                    </aside>

                    <div className="app-main">
                        <header className="app-topbar">
                            <div>
                                <span className="app-breadcrumb">Welcome back,</span>
                                <h1 className="app-topbar-title">{props.auth.user?.name}</h1>
                            </div>
                            <div className="app-user-chip">{props.auth.user?.email}</div>
                        </header>

                        <main className="app-content page-enter">
                            {props.flash?.success && <div className="alert alert-success">{props.flash.success}</div>}
                            {props.flash?.error && <div className="alert alert-danger">{props.flash.error}</div>}
                            {children}
                        </main>
                    </div>
                </div>
            ) : (
                <>
                    <nav className="guest-navbar">
                        <div className="guest-navbar-inner">
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

                            <div className="guest-navigation">
                                <ul className="navbar-links">
                                    {navLinks.map((link) => (
                                        <li key={link.href}>
                                            <Link href={link.href} className={url === link.href ? 'active' : ''}>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>

                                <div className="guest-actions">
                                    {authLinks.map((link) => (
                                        <Link key={link.href} href={link.href} className="btn btn-outline">
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>
                    <main className="page-enter">
                        {children}
                    </main>
                </>
            )}
        </>
    );
}
