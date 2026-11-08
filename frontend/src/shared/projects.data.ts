import type { Project } from "../interfaces/interfaces";

// Badge colours per category. Add a line here when you introduce a new category.
export const CATEGORY_STYLES: Record<string, string> = {
  Solar: "bg-amber-400 text-white",
  CCTV: "bg-primary-600 text-white",
  Plumbing: "bg-teal-500 text-white",
  Electrical: "bg-yellow-500 text-white",
  WiFi: "bg-electric-500 text-white",
  Security: "bg-navy-700 text-white",
};
const DEFAULT_CATEGORY_STYLE = "bg-slate-600 text-white";

export const getCategoryStyle = (category: string): string =>
  CATEGORY_STYLES[category] ?? DEFAULT_CATEGORY_STYLE;


export const PROJECTS: Project[] = [
   {
    id: "proj-001",
    title: "PTZ Camera Installation",
    subtitle: "Personal Apartment",
    county: "Elgeyo Marakwet",
    image:
      "https://res.cloudinary.com/dakyiye2e/image/upload/v1793776642/ujlqdiji8g9nygsmh7hx.jpg",
    details: [
      "32-Channel NVR",
      "IP Camera",
      "Alarm system",
      "Remote Access",
    ],
    completedAt: "2026-04-15T00:00:00Z",
    category: "CCTV",
  },
  {
    id: "proj-002",
    title: "16-Channel HD Camera Installation",
    subtitle: "Business Complex",
    county: "Eldoret Town",
    image:
      "https://res.cloudinary.com/dakyiye2e/image/upload/v1793773901/xpztzpbcl2ngy9d6kvkb.jpg",
    details: ["16-Channel DVR", "HD Camera", "Alarm System", "Remote Access"],
    completedAt: "2026-03-10T00:00:00Z",
    category: "CCTV",
  },
  {
    id: "proj-003",
    title: "Electrical Dropping",
    subtitle: "Local Rentals",
    county: "Eldoret Town",
    image:
      "https://res.cloudinary.com/dakyiye2e/image/upload/v1793780076/axkntaoexhzei4vzxog9.jpg",
    details: [
      "Socket Outlets",
      "Lighting Outlets",
      "Shower Points",
      "Cooker Outlets",
    ],
    completedAt: "2026-02-20T00:00:00Z",
    category: "Electrical",
  },
  {
    id: "proj-004",
    title: "10KVA Solar Installation",
    subtitle: "Bungalow House",
    county: "Kakamega County",
    image:
      "https://res.cloudinary.com/dakyiye2e/image/upload/v1774802946/o8pfvwzshyjbjowfpboc.jpg",
    details: [
      "10KW System",
      "Lithium Batteries",
      "Grid-tie Inverter",
      "Monitoring App",
    ],
    completedAt: "2026-01-15T00:00:00Z",
    category: "Solar",
  },
  {
    id: "proj-005",
    title: "IP Camera Installation",
    subtitle: "Commercial Complex",
    county: "Eldoret Town",
    image:
      "https://res.cloudinary.com/dakyiye2e/image/upload/v1774803049/ojrnxa0aj0n0yggpdoeh.jpg",
    details: ["32-Channel NVR", "IP Cameras", "Alarm System", "Remote Access"],
    completedAt: "2025-12-10T00:00:00Z",
    category: "CCTV",
  },
  {
    id: "proj-006",
    title: "20KVA Solar Back-Up System",
    subtitle: "Apartment Complex",
    county: "Migori County",
    image:
      "https://res.cloudinary.com/dakyiye2e/image/upload/v1774809453/sdibugy7fvlbtzg0smfe.jpg",
    details: [
      "20KW System",
      "3-Phase Inverter",
      "Battery Storage",
      "24hr Backup",
    ],
    completedAt: "2025-11-05T00:00:00Z",
    category: "Solar",
  },
  {
    id: "proj-007",
    title: "Direct Solar Water Heater",
    subtitle: "Residential Home",
    county: "Migori County",
    image:
      "https://res.cloudinary.com/dakyiye2e/image/upload/v1774798144/opdwivkrxpyx2wrfzacd.jpg",
    details: [
      "300L Capacity",
      "Direct Solar Systems",
      "Hot Water All Day",
      "10yr Warranty",
    ],
    completedAt: "2025-10-01T00:00:00Z",
    category: "Solar",
  },
  {
    id: "proj-008",
    title: "Electrical Fence Installation",
    subtitle: "Full Perimeter Wall Installation",
    county: "Homabay County",
    image:
      "https://res.cloudinary.com/dakyiye2e/image/upload/v1774809726/zykx8tt1nljro5kqiuxe.jpg",
    details: ["Complete Wiring", "HV Fence Energizer", "Strainers", "HT Wire"],
    completedAt: "2025-09-15T00:00:00Z",
    category: "Electrical",
  },
  {
    id: "proj-009",
    title: "5KVA Back-Up Solar System",
    subtitle: "Family Home",
    county: "Bungoma County",
    image:
      "https://res.cloudinary.com/dakyiye2e/image/upload/v1774809545/wmlp63elgzlj61ynmjfk.jpg",
    details: [
      "5KW System",
      "Lithium Battery",
      "Hybrid Inverter",
      "App Monitoring",
    ],
    completedAt: "2025-08-20T00:00:00Z",
    category: "Solar",
  },
  {
    id: "proj-010",
    title: "CCTV Solar Back-Up System",
    subtitle: "Business Apartments",
    county: "Uasin Gishu County",
    image:
      "https://res.cloudinary.com/dakyiye2e/image/upload/v1774810054/qflnoqpsylefxsljwqni.jpg",
    details: [
      "2KW System",
      "Lithium Battery",
      "Hybrid Inverter",
      "App Monitoring",
    ],
    completedAt: "2025-07-10T00:00:00Z",
    category: "Solar",
  },
  {
    id: "proj-011",
    title: "Solar 2KVA System",
    subtitle: "Business Apartments",
    county: "Uasin Gishu County",
    image:
      "https://res.cloudinary.com/dakyiye2e/image/upload/v1778659169/h883zi7vxbtbb2ta4n05.jpg",
    details: [
      "2KVA System",
      "Lithium Battery",
      "App Monitoring",
    ],
    completedAt: "2025-06-15T00:00:00Z",
    category: "Solar",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────
export const byNewest = (a: Project, b: Project) =>
  b.completedAt.localeCompare(a.completedAt);

/** Most recent N projects — used by the homepage section. */
export const getLatestProjects = (count: number): Project[] =>
  [...PROJECTS].sort(byNewest).slice(0, count);

/** "Sep 2026" */
export const formatProjectDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-KE", {
    month: "short",
    year: "numeric",
  });

export const getProjectYear = (iso: string): string => iso.slice(0, 4);
