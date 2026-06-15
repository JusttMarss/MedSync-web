import { Link, router, usePage } from '@inertiajs/react';
<<<<<<< HEAD
import { HeartPulse, LayoutDashboard, CalendarDays, Clock3, User, LogOut, Stethoscope, ShieldCheck, FileText } from 'lucide-react';
=======
import {
    HeartPulse, LayoutDashboard, CalendarDays, Clock3,
    User, LogOut, Stethoscope, ShieldCheck, ClipboardList,
} from 'lucide-react';
>>>>>>> 13069ecbe5b3823c20858bd726fcb7b1d152dcce
import type { SharedProps } from '../types';

interface NavLink {
    href: string;
    label: string;
}

interface SidebarProps {
    authLinks: NavLink[];
    roleLabel?: string;
}

function getIcon(label: string) {
    switch (label.toLowerCase()) {
        case 'dashboard':       return <LayoutDashboard size={18} />;
        case 'appointments':    return <CalendarDays size={18} />;
        case 'schedule':        return <Clock3 size={18} />;
        case 'profile':         return <User size={18} />;
        case 'doctors':         return <Stethoscope size={18} />;
        case 'admin':           return <ShieldCheck size={18} />;
        case 'rekam medis':     return <ClipboardList size={18} />;
        case 'medical records': return <ClipboardList size={18} />;
        default:                return <LayoutDashboard size={18} />;
    }
}

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function Sidebar({ authLinks, roleLabel }: SidebarProps) {
    const { url, props } = usePage<SharedProps>();
    const user = props.auth?.user;

    function handleLogout() {
        router.post('/logout');
    }

    return (
        <aside className="app-sidebar">
            {/* Brand */}
            <div className="app-sidebar-brand">
                <div style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    background: 'var(--gradient-button)',
                    display: 'grid', placeItems: 'center',
                    boxShadow: '0 4px 14px rgba(15,118,159,0.25)',
                    flexShrink: 0,
                }}>
                    <HeartPulse size={20} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                    <p className="brand-title">MedSync Pro</p>
                    <p className="brand-subtitle">{roleLabel || 'Patient Portal'}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="app-nav" style={{ flex: 1 }}>
                <p style={{
                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.09em',
                    color: 'var(--color-text-muted)', textTransform: 'uppercase',
                    padding: '0 0.5rem', marginBottom: '0.5rem',
                }}>
                    Menu
                </p>
                {authLinks.map((link) => {
                    const isActive = url === link.href || url.startsWith(link.href + '/');
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={isActive ? 'app-nav-item active' : 'app-nav-item'}
                        >
                            <span className="nav-icon">{getIcon(link.label)}</span>
                            {link.label}
                            {isActive && <span className="nav-active-dot" />}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info + Logout */}
            <div className="app-sidebar-footer">
                {user && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.85rem', borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-alt)',
                        border: '1px solid var(--color-border)',
                        marginBottom: '0.75rem',
                    }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'var(--gradient-button)',
                            color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                            display: 'grid', placeItems: 'center', flexShrink: 0,
                        }}>
                            {getInitials(user.name || '?')}
                        </div>
                        <div style={{ minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.name}
                            </p>
                            <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.email}
                            </p>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="logout-button"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', cursor: 'pointer' }}
                >
                    <LogOut size={15} />
                    Keluar
                </button>
            </div>
        </aside>
    );
}