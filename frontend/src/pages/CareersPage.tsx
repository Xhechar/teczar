import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Briefcase,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronRight,
  X,
  User,
  Mail,
  Phone,
  FileText,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useToast } from "../components/Toast";
import { useQuery } from "@tanstack/react-query";
import { ModelType } from "../enums/enums";
import { useSocketInvalidation } from "../hooks/socket.hook";
import { Job } from "../interfaces/interfaces";
import { JobService } from "../services/job.service";
import Footer from "./home/Footer";

interface ApplyForm {
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  CoverLetter: string;
  ResumeUrl?: string;
}

const ApplyModal: React.FC<{ job: Job; onClose: () => void }> = ({
  job,
  onClose,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyForm>();

  const inputCls = (hasErr = false) =>
    `w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
      hasErr
        ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-red-50/30"
        : "border-slate-200 focus:border-primary-400 focus:ring-primary-100 bg-white"
    }`;

  const onSubmit = async (data: ApplyForm) => {
    setLoading(true);
    try {
      // TODO: replace with api.post('/job-applications', { JobId: job.JobId, ...data })
      await new Promise((r) => setTimeout(r, 700));
      setSubmitted(true);
      toast.success(
        "Application Submitted!",
        `We'll review your application for ${job.Title} and get back to you.`,
      );
    } catch {
      toast.error(
        "Submission Failed",
        "Please try again or email your CV directly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ animation: "fadeUp .25s ease-out" }}
      >
        {/* Header */}
        <div
          className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 z-10"
          style={{ background: "linear-gradient(135deg,#0d1a42,#1660eb)" }}
        >
          <div>
            <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-1">
              Apply Now
            </p>
            <h3 className="font-display font-700 text-white text-lg leading-tight">
              {job.Title}
            </h3>
            {job.Location && (
              <p className="text-sm text-white/60 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.Location}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-all shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Success state */}
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h4 className="font-display font-700 text-navy-900 text-xl mb-2">
              Application Received!
            </h4>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Thank you for applying for <strong>{job.Title}</strong>. Our team
              will review your application and get in touch within 3–5 business
              days.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-xl font-semibold text-white text-sm"
              style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  First Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    {...register("FirstName", {
                      required: "Required",
                      minLength: { value: 2, message: "Too short" },
                    })}
                    className={`${inputCls(!!errors.FirstName)} pl-10`}
                    placeholder="James"
                  />
                </div>
                {errors.FirstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.FirstName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("LastName", {
                    required: "Required",
                    minLength: { value: 2, message: "Too short" },
                  })}
                  className={inputCls(!!errors.LastName)}
                  placeholder="Kamau"
                />
                {errors.LastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.LastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  {...register("Email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  })}
                  type="email"
                  className={`${inputCls(!!errors.Email)} pl-10`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.Email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.Email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  {...register("Phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^(\+254|0)[7][0-9]{8}$/,
                      message: "Enter a valid Kenyan number",
                    },
                  })}
                  className={`${inputCls(!!errors.Phone)} pl-10`}
                  placeholder="0712 345 678"
                />
              </div>
              {errors.Phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.Phone.message}
                </p>
              )}
            </div>

            {/* Resume URL (optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Resume / CV Link{" "}
                <span className="text-slate-400 font-normal normal-case">
                  (optional)
                </span>
              </label>
              <input
                {...register("ResumeUrl", {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: "Must be a valid URL (https://…)",
                  },
                })}
                className={inputCls(!!errors.ResumeUrl)}
                placeholder="https://drive.google.com/your-cv"
              />
              {errors.ResumeUrl && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.ResumeUrl.message}
                </p>
              )}
            </div>

            {/* Cover letter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                Cover Letter <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                <textarea
                  {...register("CoverLetter", {
                    required: "Please write a brief cover letter",
                    minLength: { value: 50, message: "At least 50 characters" },
                  })}
                  rows={4}
                  className={`${inputCls(!!errors.CoverLetter)} pl-10 resize-none`}
                  placeholder="Tell us why you're a great fit for this role…"
                />
              </div>
              {errors.CoverLetter && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.CoverLetter.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#1660eb,#0d1a42)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" /> Submit Application
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── Job card ─────────────────────────────────────────────────────
const JobCard: React.FC<{ job: Job; onApply: (j: Job) => void }> = ({
  job,
  onApply,
}) => {
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

        {expanded && (
          <div className="mt-5 pt-5 border-t border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              {job.Description}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => onApply(job)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg,#1660eb,#0d1a42)",
                }}
              >
                <Briefcase className="w-4 h-4" /> Apply Now
              </button>
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

// ─── Page ─────────────────────────────────────────────────────────
const CareersPage: React.FC = () => {
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  useSocketInvalidation(ModelType.Job);

  let { data: jobs } = useQuery({
    queryKey: [ModelType.Job.toLowerCase()],
    queryFn: () => JobService.FetchActive(),
  });

  let activeJobs = jobs?.DataList ?? [];

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

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
            Be part of Kenya's fastest-growing technology company. We're looking
            for passionate individuals who love solving problems and delivering
            results.
          </p>
        </div>
      </div>

      <div className="container-custom py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-700 text-navy-900">
            Open Positions ({activeJobs.length})
          </h2>
        </div>
        <div className="space-y-4 max-w-4xl">
          {activeJobs.map((job) => (
            <JobCard key={job.JobId} job={job} onApply={setApplyJob} />
          ))}
        </div>

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

      {applyJob && (
        <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />
      )}
    </div>
  );
};

export default CareersPage;