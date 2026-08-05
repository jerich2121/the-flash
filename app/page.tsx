import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MotionOrchestrator from "@/components/MotionOrchestrator";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div id="top" className="relative">
      <MotionOrchestrator />

      <main className="relative z-10">
        <Nav />
        <Hero />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
