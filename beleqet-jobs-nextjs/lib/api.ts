import type { Job } from './mockData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://beleqet-interview-task-production-fd0d.up.railway.app/api/v1';

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

const jobTypeMap: Record<string, string> = {
  FULL_TIME: 'Full Time',
  PART_TIME: 'Part Time',
  REMOTE: 'Remote',
  HYBRID: 'Hybrid',
  CONTRACT: 'Contract',
};

const frontendToBackendTypeMap: Record<string, string> = {
  'Full Time': 'FULL_TIME',
  'Part Time': 'PART_TIME',
  'Remote': 'REMOTE',
  'Hybrid': 'HYBRID',
  'Contract': 'CONTRACT',
};

export function mapBackendJobToFrontend(job: any): Job {
  return {
    id: job.id,
    title: job.title,
    company: job.company?.name || job.companyName || 'Unknown Company',
    location: job.location,
    type: (jobTypeMap[job.type] || job.type || 'Full Time') as any,
    category: job.category?.slug || 'general',
    postedAgo: getRelativeTime(job.createdAt),
    featured: job.featured || false,
    description: job.description || '',
    tags: job.tags || [],
  };
}

export async function fetchJobs(params?: {
  q?: string;
  category?: string;
  location?: string;
  type?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const url = new URL(`${API_URL}/jobs`);
    if (params?.q) url.searchParams.append('q', params.q);
    if (params?.category) url.searchParams.append('category', params.category);
    if (params?.location) url.searchParams.append('location', params.location);
    if (params?.type) {
      const backendType = frontendToBackendTypeMap[params.type] || params.type;
      url.searchParams.append('type', backendType);
    }
    if (params?.page) url.searchParams.append('page', params.page.toString());
    if (params?.limit) url.searchParams.append('limit', params.limit.toString());

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    const data = await res.json();
    
    // Support either direct array or paginated object `{ items, total, ... }`
    const items = Array.isArray(data) ? data : data.items || [];
    return {
      items: items.map(mapBackendJobToFrontend),
      total: data.total || items.length,
    };
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { items: [], total: 0 };
  }
}

export async function fetchJobById(id: string) {
  try {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch job');
    const data = await res.json();
    return mapBackendJobToFrontend(data);
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}/jobs/categories`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return data.map((cat: any) => ({
      id: cat.slug, // Use slug for filtering/queries
      label: cat.label,
      count: '10+',
      icon: cat.icon || 'laptop',
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
