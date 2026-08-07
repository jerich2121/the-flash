import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HeroTransition from "@/components/HeroTransition";
import TheRun from "@/components/TheRun";
import TheRunFinale from "@/components/TheRunFinale";
import RunBreakdown from "@/components/RunBreakdown";
import SectionBridge from "@/components/SectionBridge";
import FanArtGallery from "@/components/FanArtGallery";
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
        <TheRun />
        <SectionBridge
          id="run-bridge"
          ariaLabel="From the clash to the gallery"
          eyebrow="THE CLASH"
          headline={[
            { text: "THE FIGHT PAUSES — THE" },
            { text: "GALLERY", accent: true },
            { text: "DOESN'T" },
          ]}
          from={{ label: "THE CLASH" }}
          to={{ label: "THE GALLERY" }}
          backgroundSrc="/images/flash-transition-3.webp"
        />
        <FanArtGallery />
        <SectionBridge
          id="gallery-bridge"
          ariaLabel="From the gallery back into the run"
          eyebrow="THAT'S THE GALLERY"
          headline={[
            { text: "THE STILLS FADE — THE" },
            { text: "RUN", accent: true },
            { text: "PICKS BACK UP" },
          ]}
          from={{ label: "THE GALLERY" }}
          to={{ label: "THE RUN" }}
          backgroundSrc="/images/flash-transition-4.webp"
        />
        <TheRunFinale />
        <RunBreakdown />
        <HeroTransition />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
