import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Stack from "@/components/sections/Stack";
import Timeline from "@/components/sections/Timeline";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/ui/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Stack />
      <Timeline />
      <Contact />
      <Footer />
    </main>
  );
}