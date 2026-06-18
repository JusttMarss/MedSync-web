import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        q: 'Apakah pendaftaran gratis?',
        a: 'Ya, pendaftaran akun di MedSync Pro sepenuhnya gratis. Kamu hanya perlu membayar sesuai tarif konsultasi dokter yang dipilih saat booking.',
    },
    {
        q: 'Bagaimana cara membatalkan appointment?',
        a: 'Kamu bisa membatalkan appointment melalui menu "Appointments" di dashboard, minimal 2 jam sebelum jadwal berlangsung. Pembatalan tidak dikenakan biaya apapun.',
    },
    {
        q: 'Apakah data kesehatan saya aman?',
        a: 'Keamanan data adalah prioritas utama kami. Semua data dienkripsi dengan standar industri dan hanya bisa diakses oleh kamu dan dokter yang secara langsung menanganimu.',
    },
    {
        q: 'Berapa lama proses konfirmasi booking?',
        a: 'Konfirmasi booking bersifat instan. Kamu akan langsung menerima notifikasi setelah berhasil membuat janji temu dengan dokter.',
    },
    {
        q: 'Apakah bisa booking untuk anggota keluarga?',
        a: 'Saat ini booking dilakukan atas nama akun yang terdaftar. Fitur booking untuk anggota keluarga dalam satu akun sedang dalam pengembangan dan akan segera hadir.',
    },
];

function FaqItem({ item, isOpen, onToggle }: { item: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) {
    return (
        <div
            style={{
                background: 'var(--color-surface-solid)',
                border: `1px solid ${isOpen ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                borderRadius: '14px',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease',
            }}
        >
            <button
                onClick={onToggle}
                style={{
                    width: '100%', padding: '1.1rem 1.25rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', gap: '1rem',
                }}
            >
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.4 }}>
                    {item.q}
                </span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ flexShrink: 0, color: isOpen ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                >
                    <ChevronDown size={18} />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div style={{
                            padding: '0 1.25rem 1.1rem',
                            fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7,
                            borderTop: '1px solid var(--color-border)',
                            paddingTop: '0.9rem',
                        }}>
                            {item.a}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section style={{ padding: 'clamp(3rem, 5vw, 5rem) 0', background: 'var(--color-surface-solid)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 clamp(1rem, 4vw, 2.5rem)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'start' }}>
                    {/* Left sticky header */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'sticky', top: '6rem' }}
                    >
                        <span style={{
                            display: 'inline-flex', alignItems: 'center',
                            background: 'var(--color-primary-soft)', color: 'var(--color-primary)',
                            borderRadius: '99px', padding: '0.45rem 1rem',
                            fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem',
                            border: '1px solid rgba(15,118,159,0.15)',
                        }}>
                            Pertanyaan Umum
                        </span>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem', lineHeight: 1.2 }}>
                            Ada{' '}
                            <span style={{ background: 'var(--gradient-button)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                Pertanyaan?
                            </span>
                        </h2>
                        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                            Temukan jawaban atas pertanyaan yang paling sering ditanyakan seputar layanan kami.
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                            Tidak menemukan jawaban yang kamu cari?{' '}
                            <a href="mailto:support@medsync.pro" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                                Hubungi kami
                            </a>
                        </p>
                    </motion.div>

                    {/* Right accordion */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                    >
                        {faqs.map((faq, i) => (
                            <FaqItem
                                key={i}
                                item={faq}
                                isOpen={openIndex === i}
                                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
