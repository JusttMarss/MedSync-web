import { usePage, Link } from '@inertiajs/react';
import { Bell, Search, Menu } from 'lucide-react';
import type { SharedProps } from '../types';

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat Pagi';
    if (hour < 17) return 'Selamat Siang';
    return 'Selamat Malam';
}

function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function getRoleBadge(role?: string) {
    switch (role) {
        case 'admin': return { label: 'Admin', color: '#7c3aed', bg: 'rgba(139,92,246,0.1)' };
        case 'doctor': return { label: 'Dokter', color: '#059669', bg: 'rgba(16,185,129,0.1)' };
        default: return { label: 'Pasien', color: '#0284c7', bg: 'rgba(14,165,233,0.1)' };
    }
}

function formatDate() {
    return new Date().toLocaleDateString('id-ID', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

export default function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
    const { props } = usePage<SharedProps>();
    const user = props.auth?.user;
    const badge = getRoleBadge(user?.role);

    return (
        <header className="app-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                    className="mobile-menu-toggle"
                    onClick={onToggleSidebar}
                    style={{
                        width: '40px', height: '40px', borderRadius: '12px',
                        border: '1px solid var(--color-border)',
                        background: 'var(--color-surface)',
                        placeItems: 'center',
                        cursor: 'pointer', color: 'var(--color-text-muted)',
                        transition: 'all 0.2s ease',
                        display: 'none', // Hidden on desktop, shown on mobile via CSS
                    }}
                >
                    <Menu size={20} />
                </button>
                <div>
                    <span className="app-breadcrumb">{getGreeting()},</span>
                    <h1 className="app-topbar-title">{user?.name || 'Pengguna'}</h1>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.15rem' }}>
                        {formatDate()}
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Notification Bell */}
                <button style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                    display: 'grid', placeItems: 'center',
                    cursor: 'pointer', color: 'var(--color-text-muted)',
                    transition: 'all 0.2s ease',
                }}>
                    <Bell size={18} />
                </button>

                {/* User Chip */}
                <Link href="/profile" style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.5rem 0.75rem',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-surface)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                }}>
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={user.name}
                            style={{
                                width: '30px', height: '30px', borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid var(--color-border)',
                            }}
                        />
                    ) : (
                        <div style={{
                            width: '30px', height: '30px', borderRadius: '50%',
                            background: 'var(--gradient-button)',
                            color: '#fff', fontWeight: 700, fontSize: '0.75rem',
                            display: 'grid', placeItems: 'center',
                        }}>
                            {getInitials(user?.name || '?')}
                        </div>
                    )}
                    <div>
                        <p style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--color-text)', lineHeight: 1.2 }}>
                            {user?.name?.split(' ')[0]}
                        </p>
                        <span style={{
                            fontSize: '0.68rem', fontWeight: 700,
                            color: badge.color,
                            background: badge.bg,
                            padding: '1px 6px',
                            borderRadius: '4px',
                        }}>
                            {badge.label}
                        </span>
                    </div>
                </Link>
            </div>
        </header>
    );
}
