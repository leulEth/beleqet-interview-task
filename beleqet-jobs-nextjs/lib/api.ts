const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://beleqet-interview-task-production-fd0d.up.railway.app/api/v1';

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
    if (params?.type) url.searchParams.append('type', params.type);
    if (params?.page) url.searchParams.append('page', params.page.toString());
    if (params?.limit) url.searchParams.append('limit', params.limit.toString());

    const res = await fetch(url.toString(), {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return { data: [] };
  }
}

export async function fetchJobById(id: string) {
  try {
    const res = await fetch(`${API_URL}/jobs/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Failed to fetch job');
    return res.json();
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_URL}/jobs`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    // Extract unique categories from jobs
    const categoryMap = new Map();
    if (Array.isArray(data)) {
      data.forEach((job: any) => {
        if (job.category && !categoryMap.has(job.category)) {
          categoryMap.set(job.category, {
            id: job.category,
            label: job.category,
            count: '0',
            icon: 'folder',
          });
        }
      });
    }
    return Array.from(categoryMap.values());
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
