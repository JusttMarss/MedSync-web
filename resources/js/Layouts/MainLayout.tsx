import { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import type { SharedProps } from '../types';

import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import Topbar from '../Components/Topbar';
import FlashMessages from '../Components/FlashMessages';
import Footer from '../Components/Footer';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { props } = usePage<SharedProps>();

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
                    <Sidebar authLinks={authLinks} />

                    <div className="app-main">
                        <Topbar />

                        <main className="app-content page-enter">
                            <FlashMessages />
                            {children}
                        </main>
                    </div>
                </div>
            ) : (
                <div className="guest-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar navLinks={navLinks} authLinks={authLinks} />
                    
                    <main className="page-enter" style={{ flex: '1' }}>
                        {children}
                    </main>
                    
                    <Footer />
                </div>
            )}
        </>
    );
}
