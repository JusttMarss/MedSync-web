import { Link, usePage } from '@inertiajs/react';
import type { SharedProps } from '../types';

interface NavLink {
    href: string;
    label: string;
}

interface SidebarProps {
    authLinks: NavLink[];
}

export default function Sidebar({ authLinks }: SidebarProps) {
    const { url } = usePage<SharedProps>();

    return (
        <aside className="app-sidebar">
            <div className="app-sidebar-brand">
                <img src="/logo.png" alt="Logo" className="brand-logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
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
    );
}
