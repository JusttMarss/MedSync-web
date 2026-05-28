import { Link, usePage } from '@inertiajs/react';
import type { SharedProps } from '../types';

export default function Footer() {
    const { props } = usePage<SharedProps>();
    const appName = props.appName || 'Healthcare App';

    return (
        <footer className="guest-footer" style={{ borderTop: '1px solid var(--border-color)', padding: '2rem 5%', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-color)' }}>
            <div className="footer-brand">
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                    {appName}
                </Link>
            </div>
            
            <div className="footer-links" style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
                <Link href="/" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
                <Link href="/" style={{ color: 'var(--text-secondary)' }}>Terms of Service</Link>
                <Link href="/" style={{ color: 'var(--text-secondary)' }}>Contact Us</Link>
            </div>
            
            <div className="footer-copyright" style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                &copy; {new Date().getFullYear()} {appName}. All rights reserved.
            </div>
        </footer>
    );
}
