import { CreateHeroSlideDto, UpdateHeroSlideDto } from "../dtos/dto";
import { ReviewStatus, UserRole, MediaType } from "../enums/enums";
import {
  Service,
  Category,
  Product,
  Review,
  Advert,
  HeroSlide,
} from "../interfaces/interfaces";
import { ServiceResult } from "../interfaces/result/service.result";

// ===================== DUMMY SERVICES =====================
const dummyServices: Service[] = [
  {
    ServiceId: "svc-001",
    Title: "Solar Panel Installation",
    Description:
      "Professional solar panel installation for homes and businesses. From 5KVA to 20KVA systems. We handle everything from site assessment to commissioning. Enjoy clean, reliable energy and huge savings on electricity bills.",
    ImageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
    OnOffer: true,
    IsFeatured: true,
    IsDeleted: false,
    CreatedAt: new Date("2024-01-10"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ServiceId: "svc-002",
    Title: "CCTV & IP Camera Installation",
    Description:
      "State-of-the-art CCTV and IP camera systems for residential and commercial properties. We install single-camera setups to 32-channel systems with alarm integration, remote viewing, and cloud backup.",
    ImageUrl:
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80",
    OnOffer: false,
    IsFeatured: true,
    IsDeleted: false,
    CreatedAt: new Date("2024-02-14"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ServiceId: "svc-003",
    Title: "Electrical Installation & Wiring",
    Description:
      "Full house and commercial electrical wiring, panel upgrades, socket installations, lighting, and shower head connections. Certified electricians ensure every installation is safe and code-compliant.",
    ImageUrl:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80",
    OnOffer: false,
    IsFeatured: true,
    IsDeleted: false,
    CreatedAt: new Date("2024-01-20"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ServiceId: "svc-004",
    Title: "Internet & WiFi Setup",
    Description:
      "High-speed internet installation, WiFi network design, and configuration for homes and offices. We optimize signal coverage, set up mesh networks, and troubleshoot connectivity issues for seamless browsing.",
    ImageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
    OnOffer: false,
    IsFeatured: false,
    IsDeleted: false,
    CreatedAt: new Date("2024-03-05"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ServiceId: "svc-005",
    Title: "Electric Fence Installation",
    Description:
      "Secure your property with professional electric fence systems. We design and install perimeter security fences for residential estates, commercial premises, and farms across Kenya.",
    ImageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    OnOffer: true,
    IsFeatured: false,
    IsDeleted: false,
    CreatedAt: new Date("2024-04-12"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ServiceId: "svc-006",
    Title: "Intercom & Access Control Systems",
    Description:
      "Modern intercom and access control solutions including video doorbells, keypad entry, biometric systems, and gate automation for homes, apartments, and offices.",
    ImageUrl:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
    OnOffer: false,
    IsFeatured: false,
    IsDeleted: false,
    CreatedAt: new Date("2024-03-22"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ServiceId: "svc-007",
    Title: "Plumbing Services",
    Description:
      "Comprehensive plumbing for residential and commercial properties. Water heater installation, pipe repairs, drainage, and bathroom fittings. 24/7 emergency response available.",
    ImageUrl:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80",
    OnOffer: false,
    IsFeatured: false,
    IsDeleted: false,
    CreatedAt: new Date("2024-02-28"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ServiceId: "svc-008",
    Title: "Electronic Repairs",
    Description:
      "Expert repair services for solar inverters, UPS systems, TVs, home appliances, and electronic control systems. Fast turnaround with genuine replacement parts and a 90-day service warranty.",
    ImageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
    OnOffer: false,
    IsFeatured: false,
    IsDeleted: false,
    CreatedAt: new Date("2024-05-01"),
    UpdatedAt: new Date("2024-06-01"),
  },
];

export const ServiceService = {
  async getAll(): Promise<ServiceResult<Service>> {
    await new Promise((r) => setTimeout(r, 600));
    return {
      Success: true,
      Title: "Services Retrieved",
      SuccessMessage: "All services fetched successfully",
      DataList: dummyServices,
    };
  },
  async getFeatured(): Promise<ServiceResult<Service>> {
    await new Promise((r) => setTimeout(r, 400));
    return {
      Success: true,
      Title: "Featured Services",
      DataList: dummyServices.filter((s) => s.IsFeatured),
    };
  },
};

// ===================== DUMMY CATEGORIES =====================
const dummyCategories: Category[] = [
  {
    CategoryId: "cat-001",
    Name: "Solar Equipment",
    ImageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&q=80",
    IsDeleted: false,
    CreatedAt: new Date("2024-01-01"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    CategoryId: "cat-002",
    Name: "CCTV & Security",
    ImageUrl:
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=80",
    IsDeleted: false,
    CreatedAt: new Date("2024-01-01"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    CategoryId: "cat-003",
    Name: "Networking",
    ImageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80",
    IsDeleted: false,
    CreatedAt: new Date("2024-01-01"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    CategoryId: "cat-004",
    Name: "Electrical",
    ImageUrl:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80",
    IsDeleted: false,
    CreatedAt: new Date("2024-01-01"),
    UpdatedAt: new Date("2024-06-01"),
  },
];

// ===================== DUMMY PRODUCTS =====================
const dummyProducts: Product[] = [
  {
    ProductId: "prd-001",
    Name: "10KVA Hybrid Solar Inverter",
    Description:
      "High-performance hybrid inverter with MPPT charge controller. Compatible with lithium and lead-acid batteries. Remote monitoring via app. Ideal for homes and small businesses.",
    Price: 85000,
    OfferPrice: 78000,
    OnOffer: true,
    Quantity: 12,
    CategoryId: "cat-001",
    IsFeatured: true,
    IsAvailable: true,
    Category: dummyCategories[0],
    Images: [
      {
        ImageId: "img-001-1",
        ProductId: "prd-001",
        ImageUrl:
          "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80",
        IsDeleted: false,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ],
    IsDeleted: false,
    CreatedAt: new Date("2024-01-15"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ProductId: "prd-002",
    Name: "200Ah Lithium LiFePO4 Battery",
    Description:
      "Long-life lithium iron phosphate battery with built-in BMS. Over 4000 charge cycles, lightweight design, and safe chemistry. Perfect for solar backup systems.",
    Price: 45000,
    OnOffer: false,
    Quantity: 25,
    CategoryId: "cat-001",
    IsFeatured: true,
    IsAvailable: true,
    Category: dummyCategories[0],
    Images: [
      {
        ImageId: "img-002-1",
        ProductId: "prd-002",
        ImageUrl:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
        IsDeleted: false,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ],
    IsDeleted: false,
    CreatedAt: new Date("2024-02-10"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ProductId: "prd-003",
    Name: "400W Monocrystalline Solar Panel",
    Description:
      "High-efficiency 400W monocrystalline panel with anti-reflective coating. Weather-resistant aluminum frame. 25-year power output warranty. Ideal for residential and commercial rooftop installations.",
    Price: 18500,
    OfferPrice: 16500,
    OnOffer: true,
    Quantity: 60,
    CategoryId: "cat-001",
    IsFeatured: false,
    IsAvailable: true,
    Category: dummyCategories[0],
    Images: [
      {
        ImageId: "img-003-1",
        ProductId: "prd-003",
        ImageUrl:
          "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?w=600&q=80",
        IsDeleted: false,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ],
    IsDeleted: false,
    CreatedAt: new Date("2024-02-20"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ProductId: "prd-004",
    Name: "Dahua 8MP IP Dome Camera",
    Description:
      "4K Ultra HD IP dome camera with starlight technology for low-light performance. AI-powered motion detection, two-way audio, and IP67 weatherproof rating. Works with NVR and cloud platforms.",
    Price: 9800,
    OnOffer: false,
    Quantity: 40,
    CategoryId: "cat-002",
    IsFeatured: true,
    IsAvailable: true,
    Category: dummyCategories[1],
    Images: [
      {
        ImageId: "img-004-1",
        ProductId: "prd-004",
        ImageUrl:
          "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80",
        IsDeleted: false,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ],
    IsDeleted: false,
    CreatedAt: new Date("2024-03-05"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ProductId: "prd-005",
    Name: "32-Channel NVR Recorder",
    Description:
      "Professional 32-channel network video recorder supporting 4K resolution. 8TB storage capacity, HDMI/VGA output, remote access via mobile app. Includes motion alerts and pre/post event recording.",
    Price: 32000,
    OnOffer: false,
    Quantity: 15,
    CategoryId: "cat-002",
    IsFeatured: false,
    IsAvailable: true,
    Category: dummyCategories[1],
    Images: [
      {
        ImageId: "img-005-1",
        ProductId: "prd-005",
        ImageUrl:
          "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80",
        IsDeleted: false,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ],
    IsDeleted: false,
    CreatedAt: new Date("2024-03-15"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ProductId: "prd-006",
    Name: "Flat Plate Solar Water Heater 300L",
    Description:
      "Energy-efficient 300-litre flat plate collector water heater. Suitable for family homes and small guest houses. Stainless steel tank, 10-year anti-corrosion warranty. Saves up to 80% on water heating costs.",
    Price: 55000,
    OfferPrice: 49500,
    OnOffer: true,
    Quantity: 8,
    CategoryId: "cat-001",
    IsFeatured: true,
    IsAvailable: true,
    Category: dummyCategories[0],
    Images: [
      {
        ImageId: "img-006-1",
        ProductId: "prd-006",
        ImageUrl:
          "https://images.unsplash.com/photo-1560472355-536de3962603?w=600&q=80",
        IsDeleted: false,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ],
    IsDeleted: false,
    CreatedAt: new Date("2024-04-01"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ProductId: "prd-007",
    Name: "TP-Link EAP670 WiFi 6 Access Point",
    Description:
      "AX3000 WiFi 6 access point with seamless roaming, band steering, and OFDMA technology. Ideal for high-density environments. Ceiling-mount design, PoE powered, managed via Omada SDN controller.",
    Price: 12500,
    OnOffer: false,
    Quantity: 30,
    CategoryId: "cat-003",
    IsFeatured: false,
    IsAvailable: true,
    Category: dummyCategories[2],
    Images: [
      {
        ImageId: "img-007-1",
        ProductId: "prd-007",
        ImageUrl:
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
        IsDeleted: false,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ],
    IsDeleted: false,
    CreatedAt: new Date("2024-04-10"),
    UpdatedAt: new Date("2024-06-01"),
  },
  {
    ProductId: "prd-008",
    Name: "Electric Fence Energizer 5J",
    Description:
      "Heavy-duty 5-joule electric fence energizer powering up to 50km of wire. Works on solar, mains, or battery power. IP65 rated, LED indicators, tamper-proof enclosure. Ideal for large compounds.",
    Price: 22000,
    OnOffer: false,
    Quantity: 18,
    CategoryId: "cat-002",
    IsFeatured: false,
    IsAvailable: true,
    Category: dummyCategories[1],
    Images: [
      {
        ImageId: "img-008-1",
        ProductId: "prd-008",
        ImageUrl:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
        IsDeleted: false,
        CreatedAt: new Date(),
        UpdatedAt: new Date(),
      },
    ],
    IsDeleted: false,
    CreatedAt: new Date("2024-05-05"),
    UpdatedAt: new Date("2024-06-01"),
  },
];

export const ProductsService = {
  async getAll(): Promise<ServiceResult<Product>> {
    await new Promise((r) => setTimeout(r, 700));
    return {
      Success: true,
      Title: "Products Retrieved",
      SuccessMessage: "All products fetched successfully",
      DataList: dummyProducts,
    };
  },
  async getFeatured(): Promise<ServiceResult<Product>> {
    await new Promise((r) => setTimeout(r, 450));
    return {
      Success: true,
      Title: "Featured Products",
      DataList: dummyProducts.filter((p) => p.IsFeatured),
    };
  },
};

// ===================== DUMMY REVIEWS =====================
const dummyReviews: Review[] = [
  {
    ReviewId: "rev-001",
    UserId: "usr-001",
    ProductId: "prd-001",
    Rating: 5,
    Message:
      "Raz Technologies installed our 10KVA solar system flawlessly. The team was professional, punctual, and the system has been running perfectly for 6 months. Our electricity bill dropped by 90%!",
    Status: ReviewStatus.Approved,
    User: {
      UserId: "usr-001",
      FirstName: "James",
      SecondName: "Kamau",
      Email: "james@example.com",
      Phone: "0712345678",
      County: "Nairobi",
      Role: UserRole.Customer,
      PasswordHash: "",
      IsActive: true,
      IsWelcomed: true,
      IsDeleted: false,
      CreatedAt: new Date("2024-01-20"),
      UpdatedAt: new Date(),
    },
    IsDeleted: false,
    CreatedAt: new Date("2024-05-10"),
    UpdatedAt: new Date(),
  },
  {
    ReviewId: "rev-002",
    UserId: "usr-002",
    ProductId: "prd-004",
    Rating: 5,
    Message:
      "Had a 32-channel CCTV system installed for my apartment complex in Eldoret. The quality is outstanding — crystal clear 4K footage even at night. Very impressed with the service.",
    Status: ReviewStatus.Approved,
    User: {
      UserId: "usr-002",
      FirstName: "Grace",
      SecondName: "Wanjiku",
      Email: "grace@example.com",
      Phone: "0722345678",
      County: "Uasin Gishu",
      Role: UserRole.Customer,
      PasswordHash: "",
      IsActive: true,
      IsWelcomed: true,
      IsDeleted: false,
      CreatedAt: new Date("2024-02-10"),
      UpdatedAt: new Date(),
    },
    IsDeleted: false,
    CreatedAt: new Date("2024-05-15"),
    UpdatedAt: new Date(),
  },
  {
    ReviewId: "rev-003",
    UserId: "usr-003",
    ProductId: "prd-006",
    Rating: 4,
    Message:
      "The flat plate water heater they installed has been exceptional. Hot water by 8am every morning without fail. Great value for money. I'd highly recommend Raz Technologies to anyone.",
    Status: ReviewStatus.Approved,
    User: {
      UserId: "usr-003",
      FirstName: "Brian",
      SecondName: "Odhiambo",
      Email: "brian@example.com",
      Phone: "0733345678",
      County: "Kilifi",
      Role: UserRole.Customer,
      PasswordHash: "",
      IsActive: true,
      IsWelcomed: true,
      IsDeleted: false,
      CreatedAt: new Date("2024-03-05"),
      UpdatedAt: new Date(),
    },
    IsDeleted: false,
    CreatedAt: new Date("2024-05-20"),
    UpdatedAt: new Date(),
  },
  {
    ReviewId: "rev-004",
    UserId: "usr-004",
    ProductId: "prd-001",
    Rating: 5,
    Message:
      "Excellent WiFi setup for our office. Before, we had dead zones everywhere. Now we have seamless coverage across all three floors. The technical team was knowledgeable and quick.",
    Status: ReviewStatus.Approved,
    User: {
      UserId: "usr-004",
      FirstName: "Amina",
      SecondName: "Hassan",
      Email: "amina@example.com",
      Phone: "0744345678",
      County: "Mombasa",
      Role: UserRole.Customer,
      PasswordHash: "",
      IsActive: true,
      IsWelcomed: true,
      IsDeleted: false,
      CreatedAt: new Date("2024-03-15"),
      UpdatedAt: new Date(),
    },
    IsDeleted: false,
    CreatedAt: new Date("2024-05-25"),
    UpdatedAt: new Date(),
  },
  {
    ReviewId: "rev-005",
    UserId: "usr-005",
    ProductId: "prd-002",
    Rating: 5,
    Message:
      "Had the electric fence and intercom installed together. The team handled both installations on the same day, and everything works perfectly. My family feels much safer now.",
    Status: ReviewStatus.Approved,
    User: {
      UserId: "usr-005",
      FirstName: "Peter",
      SecondName: "Mwangi",
      Email: "peter@example.com",
      Phone: "0755345678",
      County: "Nakuru",
      Role: UserRole.Customer,
      PasswordHash: "",
      IsActive: true,
      IsWelcomed: true,
      IsDeleted: false,
      CreatedAt: new Date("2024-04-01"),
      UpdatedAt: new Date(),
    },
    IsDeleted: false,
    CreatedAt: new Date("2024-05-28"),
    UpdatedAt: new Date(),
  },
];

export const ReviewsService = {
  async getApproved(): Promise<ServiceResult<Review>> {
    await new Promise((r) => setTimeout(r, 500));
    return {
      Success: true,
      Title: "Reviews Retrieved",
      DataList: dummyReviews,
    };
  },
};

// ===================== DUMMY ADVERTS =====================
const dummyAdverts: Advert[] = [
  {
    AdvertId: "adv-001",
    MediaUrl: "https://www.youtube.com/embed/RpggAHMFTFU",
    MediaType: MediaType.Video,
    Title: "Solar Power — Power Your Future",
    IsActive: true,
    IsDeleted: false,
    CreatedAt: new Date("2024-04-01"),
    UpdatedAt: new Date(),
  },
  {
    AdvertId: "adv-002",
    MediaUrl: "https://www.youtube.com/embed/5c1XSbqb5Ac",
    MediaType: MediaType.Video,
    Title: "CCTV Security — See Everything, Miss Nothing",
    IsActive: true,
    IsDeleted: false,
    CreatedAt: new Date("2024-04-10"),
    UpdatedAt: new Date(),
  },
  {
    AdvertId: "adv-003",
    MediaUrl: "https://www.youtube.com/embed/FvJ0PalL7fA",
    MediaType: MediaType.Video,
    Title: "Smart Home Technology Explained",
    IsActive: true,
    IsDeleted: false,
    CreatedAt: new Date("2024-04-20"),
    UpdatedAt: new Date(),
  },
];

export const AdvertsService = {
  async getActive(): Promise<ServiceResult<Advert>> {
    await new Promise((r) => setTimeout(r, 400));
    return {
      Success: true,
      Title: "Adverts Retrieved",
      DataList: dummyAdverts.filter((a) => a.IsActive),
    };
  },
};

export const dummyHeroSlides: HeroSlide[] = [
  {
    SlideId: "slide-001",
    ImageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1600&q=85",
    Tag: "Solar Installation",
    Title: "Power Your Home",
    TitleAccent: "With Clean Solar Energy.",
    Description:
      "From 5KVA to 20KVA systems, we design, supply, and install solar solutions that cut your electricity bills by up to 90%. Residential, commercial, and backup systems — all across Kenya.",
    CtaLabel: "Get Solar Quote",
    CtaLink: "/explore?tab=services",
    SortOrder: 1,
    IsActive: true,
    IsDeleted: false,
    CreatedAt: new Date("2024-01-01"),
    UpdatedAt: new Date(),
  },
  {
    SlideId: "slide-002",
    ImageUrl:
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1600&q=85",
    Tag: "CCTV & Security",
    Title: "See Everything.",
    TitleAccent: "Miss Nothing.",
    Description:
      "Professional IP camera and CCTV installations with 4K clarity, night vision, remote viewing, and alarm integration. Single cameras to 32-channel enterprise systems.",
    CtaLabel: "Secure Your Property",
    CtaLink: "/explore?tab=services",
    SortOrder: 2,
    IsActive: true,
    IsDeleted: false,
    CreatedAt: new Date("2024-01-01"),
    UpdatedAt: new Date(),
  },
  {
    SlideId: "slide-003",
    ImageUrl:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&q=85",
    Tag: "Electrical Works",
    Title: "Safe, Certified",
    TitleAccent: "Electrical Installations.",
    Description:
      "Complete house and commercial wiring, DB board upgrades, socket and lighting installations, and shower head connections. Every job done by licensed electricians.",
    CtaLabel: "Book an Electrician",
    CtaLink: "/explore?tab=services",
    SortOrder: 3,
    IsActive: true,
    IsDeleted: false,
    CreatedAt: new Date("2024-01-01"),
    UpdatedAt: new Date(),
  },
  {
    SlideId: "slide-004",
    ImageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1600&q=85",
    Tag: "Internet & WiFi",
    Title: "Seamless Connectivity",
    TitleAccent: "Everywhere You Are.",
    Description:
      "WiFi 6 mesh network design, fibre installation, and signal optimization for homes and offices. No more dead zones. Full coverage and fast speeds.",
    CtaLabel: "Upgrade Your Network",
    CtaLink: "/explore?tab=services",
    SortOrder: 4,
    IsActive: true,
    IsDeleted: false,
    CreatedAt: new Date("2024-01-01"),
    UpdatedAt: new Date(),
  },
  {
    SlideId: "slide-005",
    ImageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=85",
    Tag: "Electric Fencing",
    Title: "Protect What",
    TitleAccent: "Matters Most.",
    Description:
      "Heavy-duty electric perimeter fencing for residential estates, commercial premises, and farms. Professional installation with alarm integration.",
    CtaLabel: "Secure Your Perimeter",
    CtaLink: "/explore?tab=services",
    SortOrder: 5,
    IsActive: false,
    IsDeleted: false,
    CreatedAt: new Date("2024-01-01"),
    UpdatedAt: new Date(),
  },
  {
    SlideId: "slide-006",
    ImageUrl:
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1600&q=85",
    Tag: "Plumbing Services",
    Title: "Reliable Plumbing,",
    TitleAccent: "Done Right.",
    Description:
      "Water heater installation, pipe repairs, solar water heaters (300L+), drainage, and bathroom fittings for homes and businesses. Emergency response 24/7.",
    CtaLabel: "Book a Plumber",
    CtaLink: "/explore?tab=services",
    SortOrder: 6,
    IsActive: true,
    IsDeleted: false,
    CreatedAt: new Date("2024-01-01"),
    UpdatedAt: new Date(),
  },
];

export const AdminSliderService = {
  /** Fetch all slides (active + inactive, admin view) */
  async getAll(): Promise<ServiceResult<HeroSlide>> {
    await new Promise((r) => setTimeout(r, 350));
    return {
      Success: true,
      Title: "Slides Retrieved",
      SuccessMessage: "Hero slides loaded successfully.",
      DataList: [...dummyHeroSlides].sort((a, b) => a.SortOrder - b.SortOrder),
    };
  },

  /** Fetch only active slides ordered by SortOrder — used by the landing page */
  async getActive(): Promise<ServiceResult<HeroSlide>> {
    await new Promise((r) => setTimeout(r, 300));
    return {
      Success: true,
      Title: "Active Slides",
      DataList: dummyHeroSlides
        .filter((s) => s.IsActive && !s.IsDeleted)
        .sort((a, b) => a.SortOrder - b.SortOrder),
    };
  },

  /** Create a new slide */
  async create(dto: CreateHeroSlideDto): Promise<ServiceResult<HeroSlide>> {
    await new Promise((r) => setTimeout(r, 500));
    // TODO: replace with api.post<ServiceResult<HeroSlide>>('/api/hero-slides', dto)
    console.log("[AdminSliderService.create]", dto);
    return {
      Success: true,
      Title: "Slide Created",
      SuccessMessage: "Hero slide created successfully.",
    };
  },

  /** Update an existing slide */
  async update(
    id: string,
    dto: UpdateHeroSlideDto,
  ): Promise<ServiceResult<HeroSlide>> {
    await new Promise((r) => setTimeout(r, 400));
    // TODO: replace with api.put<ServiceResult<HeroSlide>>(`/api/hero-slides/${id}`, dto)
    console.log("[AdminSliderService.update]", id, dto);
    return {
      Success: true,
      Title: "Slide Updated",
      SuccessMessage: "Hero slide updated successfully.",
    };
  },

  /** Toggle IsActive on a slide */
  async toggleActive(id: string): Promise<ServiceResult<HeroSlide>> {
    await new Promise((r) => setTimeout(r, 300));
    // TODO: replace with api.patch<ServiceResult<HeroSlide>>(`/api/hero-slides/${id}/toggle`)
    return {
      Success: true,
      Title: "Slide Toggled",
      SuccessMessage: "Slide visibility updated.",
    };
  },

  /** Update sort order for all slides in one call */
  async reorder(orderedIds: string[]): Promise<ServiceResult<HeroSlide>> {
    await new Promise((r) => setTimeout(r, 400));
    // TODO: replace with api.patch<ServiceResult<HeroSlide>>('/api/hero-slides/reorder', { orderedIds })
    console.log("[AdminSliderService.reorder]", orderedIds);
    return {
      Success: true,
      Title: "Order Saved",
      SuccessMessage: "Slide order updated successfully.",
    };
  },

  /** Soft-delete a slide */
  async softDelete(id: string): Promise<ServiceResult<HeroSlide>> {
    await new Promise((r) => setTimeout(r, 300));
    // TODO: replace with api.delete<ServiceResult<HeroSlide>>(`/api/hero-slides/${id}`)
    return {
      Success: true,
      Title: "Slide Deleted",
      SuccessMessage: "Hero slide removed.",
    };
  },
};