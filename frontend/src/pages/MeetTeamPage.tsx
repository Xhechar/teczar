import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Users, ChevronRight, Linkedin, Mail, UserCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "./home/Footer";
import { ModelType } from "../enums/enums";
import { useSocketInvalidation } from "../hooks/socket.hook";
import { FetchTeamMemberDto } from "../dtos/dto";
import { TeamMemberService } from "../services/team.member.service";

// ─── Member card ──────────────────────────────────────────────────
const MemberCard: React.FC<{ member: FetchTeamMemberDto }> = ({ member }) => {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div className="group bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Photo */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-navy-50 h-60">
        {!imgErr && member.ImageUrl ? (
          <img
            src={member.ImageUrl}
            alt={member.Name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UserCircle2 className="w-24 h-24 text-primary-200" />
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Social icons — revealed on hover */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <a
            href={`mailto:info@raztechnologies.co.ke`}
            className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            title={`Email ${member.Name}`}
          >
            <Mail className="w-4 h-4" />
          </a>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
            href="#"
            className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition-colors"
            title={`${member.Name} on LinkedIn`}
            >
            <Linkedin className="w-4 h-4" />
            </a>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display font-700 text-navy-900 text-lg leading-tight mb-0.5">
          {member.Name}
        </h3>
        <p className="text-primary-600 text-sm font-semibold mb-3">
          {member.Role}
        </p>
        {member.Bio && (
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
            {member.Bio}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Skeleton loader ──────────────────────────────────────────────
const MemberSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
    <div className="skeleton h-60 w-full" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-3/4 rounded-lg" />
      <div className="skeleton h-4 w-1/2 rounded-lg" />
      <div className="skeleton h-3 w-full rounded-lg" />
      <div className="skeleton h-3 w-5/6 rounded-lg" />
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────
const MeetTeamPage: React.FC = () => {
  useSocketInvalidation(ModelType.TeamMember);

  const { data, isLoading } = useQuery({
    queryKey: [ModelType.TeamMember.toLowerCase()],
    queryFn: () => TeamMemberService.FetchAll(),
  });

  const members = (data?.DataList ?? []).filter((m) => m.IsActive);

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />

      {/* ── Hero banner ── */}
      <div
        className="pt-28 pb-16"
        style={{
          background: "linear-gradient(135deg,#0d1a42 0%,#1660eb 100%)",
        }}
      >
        <div className="container-custom text-center">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/50 text-sm mb-4 justify-center">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Meet the Team</span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-5">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-700 text-white mb-4">
            Meet Our Team
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            The passionate engineers, technicians, and professionals behind
            Kenya's most trusted technology installation company.
          </p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container-custom py-14">
        {/* Section header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-display text-2xl font-700 text-navy-900">
              {isLoading ? "Loading…" : `Our People (${members.length})`}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Certified, skilled, and dedicated to delivering excellence.
            </p>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <MemberSkeleton key={i} />
            ))}
          </div>
        ) : members.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {members.map((member) => (
              <MemberCard key={member.MemberId} member={member} />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20 text-slate-400">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
              <Users className="w-10 h-10 opacity-40" />
            </div>
            <p className="text-lg font-medium text-slate-500 mb-2">
              Team profiles coming soon!
            </p>
            <p className="text-sm">
              We're putting our team page together. Check back shortly.
            </p>
          </div>
        )}

        {/* Values strip */}
        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🔧",
              title: "Certified Experts",
              desc: "Every member of our team holds industry certifications and undergoes continuous training.",
            },
            {
              emoji: "🤝",
              title: "Customer-First Culture",
              desc: "We listen, plan, and deliver — building long-term relationships with every client.",
            },
            {
              emoji: "🌍",
              title: "Proudly Kenyan",
              desc: "Homegrown talent serving Kenyan homes and businesses with pride and integrity.",
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

export default MeetTeamPage;