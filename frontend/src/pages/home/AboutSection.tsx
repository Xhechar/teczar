import React from "react";
import {
  Award,
  Users,
  MapPin,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { useCounterAnimation } from "../../hooks/Helper";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: React.ElementType;
  color: string;
}

const STATS: StatItem[] = [
  {
    value: 500,
    suffix: "+",
    label: "Projects Completed",
    icon: CheckCircle,
    color: "text-primary-600 bg-primary-50",
  },
  {
    value: 10,
    suffix: "+",
    label: "Counties Served",
    icon: MapPin,
    color: "text-amber-600 bg-amber-50",
  },
  {
    value: 98,
    suffix: "%",
    label: "Client Satisfaction",
    icon: TrendingUp,
    color: "text-green-600 bg-green-50",
  },
  {
    value: 6,
    suffix: "+ yrs",
    label: "Industry Experience",
    icon: Award,
    color: "text-purple-600 bg-purple-50",
  },
];

const AnimatedStat: React.FC<{ stat: StatItem; inView: boolean }> = ({
  stat,
  inView,
}) => {
  const ref = useCounterAnimation(stat.value, 2000, inView);
  const Icon = stat.icon;

  return (
    <div className="reveal flex flex-col items-center text-center gap-4 p-6 bg-white rounded-2xl shadow-card">
      <div
        className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <div className="flex items-end justify-center gap-0.5">
          <span
            ref={ref}
            className="text-4xl font-900 text-navy-900 leading-none"
          >
            0
          </span>
          <span className="text-xl font-700 text-navy-600 mb-0.5">
            {stat.suffix}
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1 font-medium">{stat.label}</p>
      </div>
    </div>
  );
};

const AboutSection: React.FC = () => {
  const [inView, setInView] = React.useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section-padding bg-white" ref={sectionRef}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="reveal badge badge-primary mb-4">
              <Users className="w-3 h-3" /> About Raz Technologies
            </div>
            <h2 className="reveal section-title mb-5">
              Kenya's Leading{" "}
              <span className="text-gradient">Technology & Installation</span>{" "}
              Company
            </h2>
            <p className="reveal stagger-2 text-slate-500 leading-relaxed mb-5">
              Founded with a commitment to bringing world-class technology
              solutions to Kenyan homes and businesses, Raz Technologies has
              grown to become a trusted name across the country. From Nairobi to
              Mombasa, Kisumu to Kakamega — we bring expertise to every project.
            </p>
            <p className="reveal stagger-3 text-slate-500 leading-relaxed mb-8">
              Our team of certified engineers and technicians specializes in
              solar installations, CCTV systems, smart networking, electrical
              works, electric fencing, intercom systems, and plumbing — all
              under one roof.
            </p>

            <div className="reveal stagger-4 space-y-3">
              {[
                "All technicians are certified and insured",
                "Free site assessment before every installation",
                "90-day service warranty on all work",
                "Genuine products from verified manufacturers",
                "M-PESA payments accepted — safe and convenient",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — image collage */}
          <div className="reveal stagger-2 relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&q=80"
                alt="Solar installation"
                className="rounded-2xl object-cover h-52 w-full shadow-card"
              />
              <img
                src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=500&q=80"
                alt="CCTV installation"
                className="rounded-2xl object-cover h-52 w-full shadow-card mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80"
                alt="Electrical work"
                className="rounded-2xl object-cover h-52 w-full shadow-card -mt-4"
              />
              <img
                src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&q=80"
                alt="Network setup"
                className="rounded-2xl object-cover h-52 w-full shadow-card mt-4"
              />
            </div>

            {/* Experience badge */}
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-card-hover p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-900 text-xl">
                6+
              </div>
              <div>
                <p className="font-700 text-navy-900 text-sm leading-tight">
                  Years of
                </p>
                <p className="font-700 text-navy-900 text-sm leading-tight">
                  Excellence
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-20">
          {STATS.map((stat) => (
            <AnimatedStat key={stat.label} stat={stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;