import Link from "next/link";
import type { Job } from "@/lib/mockData";
import JobCard from "./JobCard";

interface FeaturedJobsProps {
  jobs: Job[];
}

export default function FeaturedJobs({ jobs }: FeaturedJobsProps) {
  const featured = jobs.filter((j: any) => j.featured);

  return (
    <section className="bg-white border-y border-border">
      <div className="container-page py-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-sectionH2">Featured Jobs</h2>
            <p className="text-muted text-sm mt-1">Fresh opportunities from companies hiring right now.</p>
          </div>
          <Link href="/jobs" className="hidden sm:inline-block text-sm font-semibold text-brandGreen hover:underline shrink-0">
            View all jobs →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {featured.length > 0 ? (
            featured.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          ) : (
            <p className="text-muted col-span-full text-center py-8">No featured jobs available</p>
          )}
        </div>
      </div>
    </section>
  );
}
