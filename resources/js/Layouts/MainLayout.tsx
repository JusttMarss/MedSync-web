import { ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SharedProps } from '../types';

import Navbar from '../Components/Navbar';
import Sidebar from '../Components/Sidebar';
import Topbar from '../Components/Topbar';
import FlashMessages from '../Components/FlashMessages';
import Footer from '../Components/Footer';
import IntroAnimation from '../Components/IntroAnimation';

interface MainLayoutProps {
    children: ReactNode;
}

const pageVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
};

function getAuthLinks(role: string | null | undefined) {
    switch (role) {
        case 'admin':
            return [
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/medical-records', label: 'Medical Records' },
            ];
        case 'doctor':
            return [
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/medical-records', label: 'Medical Records' },
                { href: '/profile', label: 'Profile' },
            ];
        default: // patient
            return [
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/appointments', label: 'Appointments' },
                { href: '/schedule', label: 'Schedule' },
                { href: '/medical-records', label: 'Medical Records' },
                { href: '/profile', label: 'Profile' },
            ];
    }
}

function getRoleLabel(role: string | null | undefined): string {
    switch (role) {
        case 'admin':  return 'Admin Panel';
        case 'doctor': return 'Doctor Portal';
        default:       return 'Patient Portal';
    }
}

export default function MainLayout({ children }: MainLayoutProps) {
    const { props, url } = usePage<SharedProps>();

    const navLinks = [
        { href: '/',        label: 'Home' },
        { href: '/doctors', label: 'Doctors' },
    ];

    const userRole  = props.auth?.user?.role;
    const authLinks = props.auth?.user
        ? getAuthLinks(userRole)
        : [
            { href: '/login',    label: 'Login' },
            { href: '/register', label: 'Sign Up' },
          ];
    const roleLabel = getRoleLabel(userRole);

    return (
        <>
            <IntroAnimation />
            {props.auth?.user ? (
                <div className="app-shell">
                    <Sidebar authLinks={authLinks} roleLabel={roleLabel} />

                    <div className="app-main">
                        <Topbar />

                        <AnimatePresence mode="wait">
                            <motion.main
                                key={url}
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="app-content"
                            >
                                <FlashMessages />
                                {children}
                            </motion.main>
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                <div className="guest-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowY: 'auto' }}>
                    <Navbar navLinks={navLinks} authLinks={authLinks} />

                    <AnimatePresence mode="wait">
                        <motion.main
                            key={url}
                            variants={pageVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            style={{ flex: '1', display: 'flex', flexDirection: 'column' }}
                        >
                            {children}
                        </motion.main>
                    </AnimatePresence>

                    <Footer />
                </div>
            )}
        </>
    );
}