import React from "react";
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
  useScrollReveal([]);

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