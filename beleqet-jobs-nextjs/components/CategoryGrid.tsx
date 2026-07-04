import Link from "next/link";
import {
  Briefcase,
  Laptop,
  Megaphone,
  Landmark,
  HeartPulse,
  GraduationCap,
  Cog,
  Truck,
  ShoppingBag,
  Leaf,
  Scale,
  Building2,
  Globe,
  FlaskConical,
  BarChart2,
  Shield,
  Pencil,
  Users,
  Zap,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

interface Category {
  id: string;
  label: string;
  count: string;
  icon: string;
}

interface CategoryGridProps {
  categories: Category[];
  limit?: number;
}

// Map by backend icon value
const iconMap: Record<string, LucideIcon> = {
  laptop: Laptop,
  megaphone: Megaphone,
  landmark: Landmark,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  cog: Cog,
  "more-horizontal": MoreHorizontal,
  briefcase: Briefcase,
};

// Slug-based smart mapping for specific category types
function getIconForCategory(slug: string, fallbackIcon: string): LucideIcon {
  if (iconMap[fallbackIcon]) return iconMap[fallbackIcon];

  const slugIconMap: Record<string, LucideIcon> = {
    "information-technology": Laptop,
    "software-design-and-development": Laptop,
    "data-mining-and-analytics": BarChart2,
    "research-and-data-analytics": BarChart2,
    "marketing-and-advertisement": Megaphone,
    "media-and-communication": Globe,
    "multimedia-content-production": Pencil,
    "accounting-and-finance": Landmark,
    "advisory-and-consultancy": Briefcase,
    "training-and-consultancy": Briefcase,
    "training-and-mentorship": GraduationCap,
    "teaching-and-tutor": GraduationCap,
    "health-care": HeartPulse,
    "pharmaceutical": FlaskConical,
    "chemical-and-biomedical-engineering": FlaskConical,
    "construction-and-civil-engineering": Building2,
    "architecture-and-urban-planning": Building2,
    "mechanical-and-electrical-engineering": Cog,
    "environmental-and-energy-engineering": Zap,
    "transportation": Truck,
    "transportation-and-delivery": Truck,
    "logistic-and-supply-chain": Truck,
    "sales-and-promotion": ShoppingBag,
    "shop-and-office-attendant": ShoppingBag,
    "purchasing-and-procurement": ShoppingBag,
    "agriculture": Leaf,
    "horticulture": Leaf,
    "gardening-and-landscaping": Leaf,
    "livestock-and-animal-husbandry": Leaf,
    "law": Scale,
    "security-and-safety": Shield,
    "human-resource-and-talent-management": Users,
    "customer-service-and-care": Users,
    "project-management-and-administration": Users,
    "creative-art-and-design": Pencil,
    "documentation-and-writing-services": Pencil,
    "translation-and-transcription": Pencil,
  };

  for (const key of Object.keys(slugIconMap)) {
    if (slug.includes(key) || key.includes(slug)) {
      return slugIconMap[key];
    }
  }

  return slugIconMap[slug] ?? MoreHorizontal;
}

export default function CategoryGrid({ categories, limit = 14 }: CategoryGridProps) {
  const displayed = categories.slice(0, limit);
  const remaining = categories.length - limit;

  return (
    <section className="container-page py-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-sectionH2">Browse Jobs by Category</h2>
          <p className="text-muted text-sm mt-1">Explore opportunities across growing industries and find jobs that match your skills.</p>
        </div>
        <Link href="/jobs" className="hidden sm:inline-block text-sm font-semibold text-brandGreen hover:underline shrink-0">
          View all categories →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {displayed.map((cat) => {
          const Icon = getIconForCategory(cat.id, cat.icon);
          return (
            <Link
              key={cat.id}
              href={`/jobs?category=${cat.id}`}
              className="flex flex-col items-center text-center gap-2 rounded-xl border border-border bg-white px-3 py-5 hover:border-brandGreen hover:shadow-card transition-all"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brandGreen/10 text-brandGreen">
                <Icon size={18} />
              </span>
              <span className="text-xs font-semibold text-ink leading-tight">{cat.label}</span>
              <span className="text-[11px] text-muted">{cat.count} jobs</span>
            </Link>
          );
        })}

        {remaining > 0 && (
          <Link
            href="/jobs"
            className="flex flex-col items-center text-center gap-2 rounded-xl border border-dashed border-brandGreen/40 bg-brandGreen/5 px-3 py-5 hover:border-brandGreen hover:bg-brandGreen/10 transition-all"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brandGreen/15 text-brandGreen">
              <MoreHorizontal size={18} />
            </span>
            <span className="text-xs font-semibold text-brandGreen leading-tight">+{remaining} More</span>
            <span className="text-[11px] text-muted">View all</span>
          </Link>
        )}
      </div>
    </section>
  );
}
