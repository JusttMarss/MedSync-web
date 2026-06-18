import { Head } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';
import HeroSection from '../Components/HeroSection';
import StatsSection from '../Components/StatsSection';
import DoctorListSection from '../Components/DoctorListSection';
import HowItWorksSection from '../Components/HowItWorksSection';
import SpecializationSection from '../Components/SpecializationSection';
import WhyUsSection from '../Components/WhyUsSection';
import TodaySlotsSection from '../Components/TodaySlotsSection';
import FaqSection from '../Components/FaqSection';
import CtaBannerSection from '../Components/CtaBannerSection';
import type { Doctor, Stats } from '../types';
import type { TimeSlot } from '../Components/TodaySlotsSection';

interface HomeProps {
    stats: Stats;
    featuredDoctors: Doctor[];
    todaySlots?: TimeSlot[];
}

export default function Home({ stats, featuredDoctors, todaySlots }: HomeProps) {
    return (
        <MainLayout>
            <Head title="Home" />

            <HeroSection />
            <StatsSection stats={stats} />
            <HowItWorksSection />
            <SpecializationSection />
            <WhyUsSection />
            <TodaySlotsSection slots={todaySlots} />
            <DoctorListSection doctors={featuredDoctors} />
            <FaqSection />
            <CtaBannerSection />
        </MainLayout>
    );
}