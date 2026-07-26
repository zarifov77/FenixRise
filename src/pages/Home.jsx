import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/sections/Hero";
import Stats from "../components/sections/Stats";
import Features from "../components/sections/Features";
import HowItWorks from "../components/sections/HowItWorks";
import Universities from "../components/sections/Universities";
import Testimonials from "../components/sections/Testimonials";
import CTA from "../components/sections/CTA";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    if (!target) return;

    const timeout = window.setTimeout(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    return () => window.clearTimeout(timeout);
  }, [location.hash]);

  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Universities />
      <Testimonials />
      <CTA />
    </>
  );
}
