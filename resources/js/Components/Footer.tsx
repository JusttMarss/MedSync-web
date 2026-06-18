import { Link } from '@inertiajs/react';

export default function Footer() {
    const appName = 'MedSync Pro';

    return (
        <footer className="guest-footer" style={{ borderTop: '1px solid var(--border-color)', padding: 'clamp(1.5rem, 4vw, 2rem) clamp(1rem, 5vw, 5%)', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'clamp(1.5rem, 4vw, 2rem)', justifyContent: 'center', alignItems: 'center', textAlign: 'center', backgroundColor: 'var(--surface-color)' }}>
            <div className="footer-brand">
                <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                    {appName}
                </Link>
            </div>
            
            <div className="footer-links" style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', justifyContent: 'center' }}>
                <Link href="/" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
                <Link href="/" style={{ color: 'var(--text-secondary)' }}>Terms of Service</Link>
                <Link href="/" style={{ color: 'var(--text-secondary)' }}>Contact Us</Link>
            </div>
            
            <div className="footer-copyright" style={{ color: 'var(--text-tertiary)', fontSize: 'clamp(0.75rem, 2vw, 0.85rem)' }}>
                &copy; {new Date().getFullYear()} {appName}. All rights reserved.
            </div>
        </footer>
    );
}
