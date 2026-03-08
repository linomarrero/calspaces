import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CredibilityBar from "@/components/CredibilityBar";
import VideoSection from "@/components/VideoSection";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Demo from "@/components/Demo";
import Testimonials from "@/components/Testimonials";
import Waitlist from "@/components/Waitlist";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CredibilityBar />
        <VideoSection />
        <HowItWorks />
        <Features />
        <Demo />
        <Testimonials />
        <Waitlist />
        <Footer />
      </main>
    </>
  );
}
