import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { ProjectsDrive } from "@/components/sections/ProjectsDrive";
import { ResultsPodium } from "@/components/sections/ResultsPodium";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <ProjectsDrive />
        <ResultsPodium />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
