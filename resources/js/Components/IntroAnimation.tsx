import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { HeartPulse } from 'lucide-react';

export default function IntroAnimation() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');
        if (hasSeenIntro) {
            setIsVisible(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('hasSeenIntro', 'true');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        background: 'linear-gradient(135deg, #f8f9ff 0%, #eef4ff 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                        <motion.div
                            animate={{ 
                                scale: [1, 1.1, 1],
                            }}
                            transition={{ 
                                duration: 1.2, 
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            style={{
                                background: 'white',
                                padding: '1.5rem',
                                borderRadius: '24px',
                                boxShadow: '0 20px 40px rgba(0,82,109,0.1)'
                            }}
                        >
                            <HeartPulse size={64} color="#00526d" strokeWidth={1.5} />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            style={{
                                marginTop: '1.5rem',
                                fontSize: '2rem',
                                fontWeight: 800,
                                color: '#00526d',
                                letterSpacing: '-0.02em'
                            }}
                        >
                            MedSync Pro
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            style={{
                                color: '#6b7c93',
                                marginTop: '0.5rem',
                                fontWeight: 500
                            }}
                        >
                            Your Health, Simplified
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
