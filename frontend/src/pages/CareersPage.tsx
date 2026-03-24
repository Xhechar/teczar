import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Job } from "../interfaces/interfaces";
import Footer from "./home/Footer";
import { useQuery } from "@tanstack/react-query";
import { ModelType } from "../enums/enums";
import { JobService } from "../services/job.service";
import { useSocketInvalidation } from "../hooks/socket.hook";
import { useToast } from "../components/Toast";
import { FetchJobDto } from "../dtos/dto";

const JobCard: React.FC<{ job: FetchJobDto }> = ({ job }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden transition-all duration-300">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-50 text-green-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                Hiring Now
              </span>
            </div>
            <h3 className="font-display font-700 text-lg text-navy-900">
              {job.Title}
            </h3>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
              {job.Location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {job.Location}
                </span>
              )}
              {job.SalaryRange && (
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  {job.SalaryRange}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-primary-600 text-primary-600 text-sm font-semibold hover:bg-primary-600 hover:text-white transition-all duration-200"
          >
            View Details
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Expanded description */}
        {expanded && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              {job.Description}
            </p>
            <div className="flex gap-3">
              <Link
                to={`/careers/apply/${job.JobId}`}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg,#1660eb,#0d1a42)",
                }}
              >
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </Link>
              <a
                href="mailto:careers@raztechnologies.co.ke"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold border-2 border-slate-200 text-slate-600 hover:border-primary-400 hover:text-primary-600 transition-all duration-200"
              >
                Email CV
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CareersPage: React.FC = () => {
  useSocketInvalidation(ModelType.Job);

  let {data: jobs} = useQuery({
    queryKey: [ModelType.Job.toLowerCase()],
    queryFn: () => JobService.FetchActive()
  });

  let activeJobs = jobs?.DataList ?? [];

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      {/* Header */}
      <div
        className="pt-28 pb-16"
        style={{
          background: "linear-gradient(135deg,#0d1a42 0%,#1660eb 100%)",
        }}
      >
        <div className="container-custom text-center">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-4 justify-center">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Careers</span>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-5">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-700 text-white mb-4">
            Join Our Team
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            Be part of RAZ technologies company. We're looking
            for passionate individuals who love solving problems and delivering
            results.
          </p>
        </div>
      </div>

      {/* Jobs */}
      <div className="container-custom py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-700 text-navy-900">
            Open Positions ({activeJobs.length})
          </h2>
        </div>
        <div className="space-y-4 max-w-4xl">
          {activeJobs.map((job) => (
            <JobCard key={job.JobId} job={job} />
          ))}
        </div>

        {/* No openings message */}
        {activeJobs.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No open positions at the moment. Check back soon!</p>
            <p className="text-sm mt-2">
              Or send your CV to{" "}
              <a
                href="mailto:careers@raztechnologies.co.ke"
                className="text-primary-500 hover:underline"
              >
                careers@raztechnologies.co.ke
              </a>
            </p>
          </div>
        )}

        {/* Culture section */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🚀",
              title: "Growth Focused",
              desc: "We invest in training and upskilling. Your growth is our growth.",
            },
            {
              emoji: "🤝",
              title: "Collaborative Culture",
              desc: "Work with a team that values ideas from every level.",
            },
            {
              emoji: "💡",
              title: "Innovation Driven",
              desc: "We constantly adopt new technologies to deliver better solutions.",
            },
          ].map(({ emoji, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 shadow-card text-center"
            >
              <div className="text-4xl mb-4">{emoji}</div>
              <h4 className="font-display font-700 text-navy-900 mb-2">
                {title}
              </h4>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CareersPage;