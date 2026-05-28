import { Link, usePage } from '@inertiajs/react';
import type { SharedProps } from '../types';

interface NavLink {
    href: string;
    label: string;
}

interface NavbarProps {
    navLinks: NavLink[];
    authLinks: NavLink[];
}

export default function Navbar({ navLinks, authLinks }: NavbarProps) {
    const { url, props } = usePage<SharedProps>();
    const appName = props.appName || 'Healthcare App';

    return (
        <nav className="guest-navbar">
            <div className="guest-navbar-inner">
                <Link href="/" className="navbar-brand">
                    <img src="/logo.png" alt="Logo" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
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
    );
}
