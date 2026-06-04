import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import HeroSection from '../Components/HeroSection';
import StatsSection from '../Components/StatsSection';
import DoctorListSection from '../Components/DoctorListSection';
import HowItWorksSection from '../Components/HowItWorksSection';
import SpecializationSection from '../Components/SpecializationSection';
import WhyUsSection from '../Components/WhyUsSection';
import TodaySlotsSection from '../Components/TodaySlotsSection';
import TestimoniSection from '../Components/TestimoniSection';
import FaqSection from '../Components/FaqSection';
import CtaBannerSection from '../Components/CtaBannerSection';
import type { Doctor, Stats } from '../types';
import type { TimeSlot } from '../Components/TodaySlotsSection';

interface HomeProps {
    stats: Stats;
    featuredDoctors: Doctor[];
    todaySlots?: TimeSlot[]; // opsional — diisi dari backend, fallback ke demo data
}

export default function Home({ stats, featuredDoctors, todaySlots }: HomeProps) {
    return (
        <MainLayout>
            <Head title="Home" />

            {/* 1. Hero */}
            <HeroSection />

            {/* 2. Stats */}
            <StatsSection stats={stats} />

            {/* 3. How it Works */}
            <HowItWorksSection />

            {/* 4. Spesialisasi */}
            <SpecializationSection />

            {/* 5. Kenapa Pilih Kami */}
            <WhyUsSection />

            {/* 6. Slot Tersedia Hari Ini */}
            <TodaySlotsSection slots={todaySlots} />

            {/* 7. Dokter Unggulan */}
            <DoctorListSection doctors={featuredDoctors} />

            {/* 8. Testimoni */}
            <TestimoniSection />

            {/* 9. FAQ */}
            <FaqSection />

            {/* 10. CTA Banner */}
            <CtaBannerSection />
        </MainLayout>
    );
}
