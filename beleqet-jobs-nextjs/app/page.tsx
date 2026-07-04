import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedJobs from "@/components/FeaturedJobs";
import WhyChoose from "@/components/WhyChoose";
import CTABanner from "@/components/CTABanner";
import { fetchJobs, fetchCategories } from "@/lib/api";

export default async function HomePage() {
  // Fetch jobs (featured ones will be displayed)
  const jobsData = await fetchJobs();
  const jobs = jobsData.items || [];

  // Fetch categories
  const categories = await fetchCategories();

  // Stats - using static data for now as backend may not have this endpoint
  const stats = [
    { label: "Active Jobs", value: "10,000+", icon: "briefcase" },
    { label: "Hiring Companies", value: "5,000+", icon: "building-2" },
    { label: "Registered Job Seekers", value: "50,000+", icon: "users" },
    { label: "Satisfaction Rate", value: "98%", icon: "smile" },
  ];

  return (
    <>
      <Hero />
      <StatsBar stats={stats} />
      <CategoryGrid categories={categories.length > 0 ? categories : []} />
      <FeaturedJobs jobs={jobs} />
      <WhyChoose />
      <CTABanner />
    </>
  );
}
