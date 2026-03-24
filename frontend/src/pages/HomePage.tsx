import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useScrollReveal } from "../hooks/Helper";
import AboutSection from "./home/AboutSection";
import AdvertsSection from "./home/AdvertsSection";
import ContactSection from "./home/ContactSection";
import Footer from "./home/Footer";
import HeroSection from "./home/HeroSection";
import ProductsSection from "./home/ProductsSection";
import ProjectsSection from "./home/ProjectsSection";
import ReviewsSection from "./home/ReviewsSection";
import ServicesSection from "./home/ServicesSection";

const HomePage: React.FC = () => {
  // Initialize scroll reveal animations
  useScrollReveal();

  // Re-run reveal on any content change
  useEffect(() => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right",
      );
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
          el.classList.add("visible");
        }
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar transparent />
      <HeroSection />
      <ServicesSection />
      <ProductsSection />
      <AboutSection />
      <ProjectsSection />
      <AdvertsSection />
      <ReviewsSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default HomePage;