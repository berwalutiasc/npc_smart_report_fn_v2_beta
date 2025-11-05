"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProcessSteps from "@/components/ProcessSteps";
import ContactHelp from "@/components/ContactHelp";
import Footer from "@/components/Footer";
import FloatingClock from "@/components/FloatingClock";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ProcessSteps />
        <ContactHelp />
      </main>
      <Footer />
      <FloatingClock />
    </div>
  );
};

export default Index;
