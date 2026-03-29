import React, { useState } from "react";
import { MapPin, CheckCircle, ArrowRight, ChevronDown } from "lucide-react";
import { useScrollReveal } from "../../hooks/Helper";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  county: string;
  image: string;
  tag: string;
  tagColor: string;
  details: string[];
}

const ALL_PROJECTS: Project[] = [
  {
    id: "proj-001",
    title: "10KVA Solar Installation",
    subtitle: "Bungalow House",
    county: "Kakamega County",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=700&q=80",
    tag: "Solar",
    tagColor: "bg-amber-400 text-white",
    details: ["10KW System", "Lithium Batteries", "Grid-tie Inverter", "Monitoring App"],
  },
  {
    id: "proj-002",
    title: "IP Camera Installation",
    subtitle: "Commercial Complex",
    county: "Eldoret Town",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=700&q=80",
    tag: "CCTV",
    tagColor: "bg-primary-600 text-white",
    details: ["32-Channel NVR", "IP Cameras", "Alarm System", "Remote Access"],
  },
  {
    id: "proj-003",
    title: "20KVA Solar Back-Up System",
    subtitle: "Apartment Complex",
    county: "Kilifi County",
    image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=700&q=80",
    tag: "Solar",
    tagColor: "bg-amber-400 text-white",
    details: ["20KW System", "3-Phase Inverter", "Battery Storage", "24hr Backup"],
  },
  {
    id: "proj-004",
    title: "Flat Plate Water Heater",
    subtitle: "Residential Home",
    county: "Nairobi County",
    image: "https://res.cloudinary.com/dakyiye2e/image/upload/v1774798144/opdwivkrxpyx2wrfzacd.jpg",
    tag: "Plumbing",
    tagColor: "bg-teal-500 text-white",
    details: ["300L Capacity", "Flat Plate System", "Hot Water All Day", "10yr Warranty"],
  },
  {
    id: "proj-005",
    title: "Electrical Installation",
    subtitle: "Full House Wiring",
    county: "Homabay County",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&q=80",
    tag: "Electrical",
    tagColor: "bg-yellow-500 text-white",
    details: ["Complete Wiring", "Sockets & Lights", "Shower Heads", "DB Board"],
  },
  {
    id: "proj-006",
    title: "5KVA Solar Installation",
    subtitle: "Family Home",
    county: "Kisumu County",
    image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=700&q=80",
    tag: "Solar",
    tagColor: "bg-amber-400 text-white",
    details: ["5KW System", "Lithium Battery", "Hybrid Inverter", "App Monitoring"],
  },
];

const PREVIEW_COUNT = 4;

const ProjectCard: React.FC<{ project: Project; index: number; animate?: boolean }> = ({ project, index, animate = true }) => (
  <div
    className={`${animate ? "reveal" : ""} group relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-400`}
    style={animate ? { transitionDelay: `${(index % 4) * 0.08}s` } : undefined}
  >
    <div className="relative h-56 overflow-hidden">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/30 to-transparent" />
      <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${project.tagColor}`}>
        {project.tag}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          {project.county}
        </div>
        <h3 className="font-display font-700 text-white text-lg leading-tight">{project.title}</h3>
        <p className="text-white/70 text-sm">{project.subtitle}</p>
      </div>
    </div>
    <div className="bg-white p-4">
      <div className="flex flex-wrap gap-2">
        {project.details.map((detail) => (
          <span key={detail}
            className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 rounded-full px-2.5 py-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            {detail}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const ProjectsSection: React.FC = () => {
  const [showAll, setShowAll] = useState(false);

  const initialCards = ALL_PROJECTS.slice(0, PREVIEW_COUNT);
  const extraCards   = ALL_PROJECTS.slice(PREVIEW_COUNT);

  useScrollReveal([]);

  const handleGetQuote = () => {
    const el = document.getElementById("contact");
    if (el) {
      const navbarHeight = 72;
      const top = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section id="projects" className="section-padding bg-surface-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="reveal badge badge-primary mb-4 mx-auto w-fit">
            <CheckCircle className="w-3 h-3" /> Completed Projects
          </div>
          <h2 className="reveal section-title">
            Real Installations,{" "}
            <span className="text-gradient">Real Results</span>
          </h2>
          <p className="reveal stagger-2 section-subtitle mx-auto mt-3">
            Hundreds of successful projects across Kenya. From Nairobi
            apartments to Kakamega bungalows — we've got the experience to
            handle yours.
          </p>
        </div>

        {/* Grid — initial 4 animate in on scroll, extras appear instantly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {initialCards.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              animate={true}
            />
          ))}
          {showAll &&
            extraCards.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                animate={false}
              />
            ))}
        </div>

        {/* View More toggle */}
        {!showAll && ALL_PROJECTS.length > PREVIEW_COUNT && (
          <div className="text-center mb-4">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300"
            >
              View All Projects
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* CTA banner */}
        <div
          className="mt-16 reveal relative overflow-hidden rounded-3xl p-10 text-center"
          style={{
            background: "linear-gradient(135deg, #0d1a42 0%, #1660eb 100%)",
          }}
        >
          <div className="absolute inset-0 mesh-pattern opacity-20" />
          <div className="relative z-10">
            <h3 className="font-display text-3xl md:text-4xl font-700 text-white mb-3">
              Ready to Start Your Project?
            </h3>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Join hundreds of satisfied clients across Kenya. Get a free site
              assessment and personalized quote today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Scroll to contact section programmatically */}
              <button onClick={handleGetQuote} className="btn-amber">
                Get a Free Consultation
                <ArrowRight className="w-4 h-4" />
              </button>
              <a href="tel:+254746430693" className="btn-outline">
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;