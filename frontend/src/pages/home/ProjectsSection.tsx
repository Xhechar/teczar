import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useScrollReveal } from "../../hooks/Helper";
import ProjectCard from "../../components/ProjectCard";
import { PROJECTS, getLatestProjects } from "../../shared/projects.data";

// How many projects the homepage previews. The rest live on /projects.
const HOME_PREVIEW_COUNT = 4;

const ProjectsSection: React.FC = () => {
  const latest = getLatestProjects(HOME_PREVIEW_COUNT);

  useScrollReveal([]);

  const handleGetQuote = () => {
    // Scroll to contact with an offset for the fixed navbar
    const el = document.getElementById("contact");
    if (el) {
      const navbarHeight = 72;
      const top =
        el.getBoundingClientRect().top + window.scrollY - navbarHeight;
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

        {/* Latest projects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {latest.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* View all → dedicated page */}
        <div className="text-center mb-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border-2 border-primary-600 text-primary-600 font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300"
          >
            View All Projects ({PROJECTS.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

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
              <button onClick={handleGetQuote} className="btn-amber">
                Get a Free Quote
                <ArrowRight className="w-4 h-4" />
              </button>
              <a href="tel:+254700000000" className="btn-outline">
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
