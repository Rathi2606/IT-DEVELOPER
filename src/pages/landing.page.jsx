import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

const LandingPage = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <Hero />
    <Features />
    <CTA />
    <Footer />
  </div>
);

export default LandingPage;