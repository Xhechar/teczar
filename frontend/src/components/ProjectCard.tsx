import React from "react";
import { MapPin, CheckCircle } from "lucide-react";
import {
  type Project
} from "../interfaces/interfaces";
import { 
  getCategoryStyle,
  formatProjectDate, } from "../shared/projects.data";

interface ProjectCardProps {
  project: Project;
  index?: number;
  /** Adds the .reveal scroll-in animation. Turn off for lists that change (filters, "show more"). */
  animate?: boolean;
  /** Appends the completion month to the location line, e.g. "Kilifi County · Apr 2026". */
  showDate?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index = 0,
  animate = true,
  showDate = false,
}) => (
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
      <span
        className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full ${getCategoryStyle(project.category)}`}
      >
        {project.category}
      </span>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-1.5 text-white/70 text-xs mb-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">
            {project.county}
            {showDate && ` · ${formatProjectDate(project.completedAt)}`}
          </span>
        </div>
        <h3 className="font-display font-700 text-white text-lg leading-tight">
          {project.title}
        </h3>
        <p className="text-white/70 text-sm">{project.subtitle}</p>
      </div>
    </div>
    <div className="bg-white p-4">
      <div className="flex flex-wrap gap-2">
        {project.details.map((detail) => (
          <span
            key={detail}
            className="flex items-center gap-1 text-xs text-slate-600 bg-slate-50 rounded-full px-2.5 py-1"
          >
            <CheckCircle className="w-3 h-3 text-green-500" />
            {detail}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default ProjectCard;