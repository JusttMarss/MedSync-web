import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeartPulse, Menu, X } from 'lucide-react';
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
<<<<<<< HEAD
    const appName = props.appName || 'MedSync Pro';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
=======
    const appName = 'MedSync Pro';
>>>>>>> 874ff4c58364a0f77271d53c2bbc9241887e15db
    
    const { scrollY } = useScroll();
    const navBackground = useTransform(
        scrollY,
        [0, 50],
        ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.85)']
    );
    const navBackdrop = useTransform(
        scrollY,
        [0, 50],
        ['blur(0px)', 'blur(16px)']
    );
    const navShadow = useTransform(
        scrollY,
        [0, 50],
        ['none', '0 10px 30px -10px rgba(15, 118, 159, 0.1)']
    );

    return (
        <motion.nav 
            className="guest-navbar"
            style={{ 
                background: navBackground, 
                backdropFilter: navBackdrop, 
                WebkitBackdropFilter: navBackdrop,
                boxShadow: navShadow,
                borderBottom: '1px solid rgba(255,255,255,0.3)',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                transition: 'padding 0.3s ease'
            }}
        >
            <div className="guest-navbar-inner" style={{ minHeight: '80px' }}>
                <Link href="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    <div style={{ background: 'var(--gradient-button)', borderRadius: '12px', padding: '0.5rem', display: 'flex', color: 'white', boxShadow: 'var(--shadow-glow)' }}>
                        <HeartPulse size={22} strokeWidth={2.5} />
                    </div>
                    {appName}
                </Link>

                <button 
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        background: 'transparent',
                        placeItems: 'center',
                        cursor: 'pointer', color: 'var(--color-primary)',
                        display: 'none',
                    }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`guest-navigation ${isMobileMenuOpen ? 'mobile-open' : 'guest-navigation-desktop'}`}>
                    <ul className="navbar-links" style={{ display: 'flex', gap: '1.5rem', listStyle: 'none', margin: 0, padding: 0 }}>
                        {navLinks.map((link) => {
                            const isActive = url === link.href;
                            return (
                                <li key={link.href} style={{ position: 'relative' }}>
                                    <Link 
                                        href={link.href} 
                                        style={{ 
                                            fontWeight: 600, 
                                            color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                            padding: '0.5rem 0',
                                            transition: 'color 0.2s ease'
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                    {isActive && (
                                        <motion.div 
                                            layoutId="navbar-indicator"
                                            style={{
                                                position: 'absolute',
                                                bottom: '-4px',
                                                left: 0,
                                                right: 0,
                                                height: '3px',
                                                background: 'var(--gradient-button)',
                                                borderRadius: '3px'
                                            }}
                                        />
                                    )}
                                </li>
                            )
                        })}
                    </ul>

                    <div style={{ width: '1px', height: '24px', background: 'var(--color-border)', margin: '0 0.5rem' }} />

                    <div className="guest-actions" style={{ display: 'flex', gap: '1rem' }}>
                        {authLinks.map((link, idx) => (
                            <Link 
                                key={link.href} 
                                href={link.href} 
                                className={`btn ${idx === authLinks.length - 1 ? 'btn-primary' : 'btn-ghost'}`}
                                style={idx === authLinks.length - 1 ? { boxShadow: 'var(--shadow-glow)' } : {}}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
