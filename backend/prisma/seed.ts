import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Beleqet database...');

  // ── Job Categories ─────────────────────────────────────────────────────────
  const rawJobCategories = [
    "Accounting And Finance", "Advisory And Consultancy", "Aeronautics And Aerospace",
    "Agriculture", "Architecture And Urban Planning", "Beauty And Grooming",
    "Broker And Case Closer", "Business And Commerce", "Chemical And Biomedical Engineering",
    "Clothing And Textile", "Construction And Civil Engineering", "Creative Art And Design",
    "Customer Service And Care", "Data Mining And Analytics", "Documentation And Writing Services",
    "Entertainment", "Environmental And Energy Engineering", "Event Management And Organization",
    "Fashion Design", "Food And Drink Preparation Or Service", "Gardening And Landscaping",
    "Health Care", "Horticulture", "Hospitality And Tourism", "Human Resource And Talent Management",
    "Information Technology", "Installation And Maintenance Technician", "Janitorial And Other Office Services",
    "Labor Work And Masonry", "Law", "Livestock And Animal Husbandry", "Logistic And Supply Chain",
    "Manufacturing And Production", "Marketing And Advertisement", "Mechanical And Electrical Engineering",
    "Media And Communication", "Multimedia Content Production", "Pharmaceutical",
    "Project Management And Administration", "Psychiatry, Psychology And Social Work",
    "Purchasing And Procurement", "Research And Data Analytics", "Sales And Promotion",
    "Secretarial And Office Management", "Security And Safety", "Shop And Office Attendant",
    "Software Design And Development", "Teaching And Tutor", "Training And Consultancy",
    "Training And Mentorship", "Translation And Transcription", "Transportation",
    "Transportation And Delivery", "Veterinary", "Woodwork And Carpentry"
  ];

  const categories = await Promise.all(
    rawJobCategories.map(cat => {
      const slug = cat.toLowerCase().replace(/[, ]+/g, '-').replace(/-+$/g, '');
      return prisma.jobCategory.upsert({
        where: { slug },
        update: {},
        create: { slug, label: cat, icon: 'briefcase' }
      });
    })
  );
  console.log(`✅ ${categories.length} job categories created`);

  // ── Freelance Categories ───────────────────────────────────────────────────
  await Promise.all([
    prisma.freelanceCategory.upsert({ where: { slug: 'graphic-design' },    update: {}, create: { slug: 'graphic-design',    label: 'Graphic Design',         icon: 'palette' } }),
    prisma.freelanceCategory.upsert({ where: { slug: 'web-development' },   update: {}, create: { slug: 'web-development',   label: 'Web Development',        icon: 'code-2' } }),
    prisma.freelanceCategory.upsert({ where: { slug: 'digital-marketing' }, update: {}, create: { slug: 'digital-marketing', label: 'Digital Marketing',      icon: 'megaphone' } }),
    prisma.freelanceCategory.upsert({ where: { slug: 'video-animation' },   update: {}, create: { slug: 'video-animation',   label: 'Video & Animation',      icon: 'clapperboard' } }),
    prisma.freelanceCategory.upsert({ where: { slug: 'writing' },           update: {}, create: { slug: 'writing',           label: 'Writing & Translation',  icon: 'pen-line' } }),
  ]);
  console.log('✅ Freelance categories created');

  // ── Employer User ──────────────────────────────────────────────────────────
  const hash = await bcrypt.hash('Employer@123!', 12);

  const employer = await prisma.user.upsert({
    where: { email: 'employer@beleqet.com' },
    update: {},
    create: {
      email: 'employer@beleqet.com',
      passwordHash: hash,
      firstName: 'Demo',
      lastName: 'Employer',
      role: 'EMPLOYER',
      emailVerified: true,
    },
  });
  console.log('✅ Employer user created (employer@beleqet.com / Employer@123!)');

  // ── Demo Companies ─────────────────────────────────────────────────────────
  const company = await prisma.company.upsert({
    where: { userId: employer.id },
    update: {},
    create: {
      userId: employer.id,
      name: 'Beleqet Tech',
      description: 'Leading technology company in Ethiopia specializing in digital transformation.',
      industry: 'Technology',
      size: '50-200',
      location: 'Addis Ababa, Ethiopia',
      verified: true,
    },
  });
  console.log('✅ Demo company created: Beleqet Tech');

  // ── Helper: find category by slug ──────────────────────────────────────────
  const findCat = (slug: string) => {
    const found = categories.find(c => c.slug === slug);
    if (!found) throw new Error(`Category not found: ${slug}`);
    return found.id;
  };

  // ── Job Listings ───────────────────────────────────────────────────────────
  const now = new Date();
  const future = (days: number) => new Date(now.getTime() + days * 86400000);

  const jobDefs = [
    // Information Technology
    {
      title: 'Senior Fullstack Developer',
      description: 'Join our engineering team to build and maintain scalable web applications using React, Node.js, and PostgreSQL. You will design system architecture, conduct code reviews, and mentor junior developers.',
      requirements: '5+ years of experience in fullstack development. Strong knowledge of React, TypeScript, Node.js. Experience with cloud platforms (AWS/GCP). Excellent problem-solving skills.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('information-technology'),
      salaryMin: 80000, salaryMax: 120000, currency: 'ETB',
      deadline: future(60),
      featured: true,
      tags: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      experienceLevel: 'Senior',
      yearsOfExperience: '5+',
    },
    {
      title: 'Mobile App Developer (Flutter)',
      description: 'Develop cross-platform mobile applications for iOS and Android using Flutter. Work closely with UI/UX designers and backend engineers to deliver high-quality products.',
      requirements: '3+ years Flutter/Dart experience. Knowledge of REST APIs and state management. Published apps on Google Play or App Store preferred.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('information-technology'),
      salaryMin: 60000, salaryMax: 90000, currency: 'ETB',
      deadline: future(45),
      featured: true,
      tags: ['Flutter', 'Dart', 'iOS', 'Android'],
      experienceLevel: 'Mid',
      yearsOfExperience: '3+',
    },
    {
      title: 'DevOps Engineer',
      description: 'Manage CI/CD pipelines, containerization with Docker and Kubernetes, and cloud infrastructure on AWS. Ensure high availability, security, and scalability of our systems.',
      requirements: 'Experience with Docker, Kubernetes, Terraform. AWS/GCP certification a plus. Strong Linux/shell scripting skills.',
      location: 'Remote',
      type: 'REMOTE' as const,
      categoryId: findCat('information-technology'),
      salaryMin: 70000, salaryMax: 100000, currency: 'ETB',
      deadline: future(30),
      featured: false,
      tags: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
      experienceLevel: 'Senior',
      yearsOfExperience: '4+',
    },

    // Software Design And Development
    {
      title: 'Backend Engineer (NestJS)',
      description: 'Design and implement RESTful APIs and microservices using NestJS and TypeScript. Collaborate with product teams to deliver features on time.',
      requirements: 'Strong NestJS/Express knowledge. Prisma ORM experience. PostgreSQL and Redis knowledge required.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('software-design-and-development'),
      salaryMin: 55000, salaryMax: 85000, currency: 'ETB',
      deadline: future(50),
      featured: true,
      tags: ['NestJS', 'TypeScript', 'PostgreSQL', 'Prisma'],
      experienceLevel: 'Mid',
      yearsOfExperience: '3+',
    },

    // Data Mining And Analytics
    {
      title: 'Data Analyst',
      description: 'Analyze business data and produce reports and dashboards to support strategic decision-making. Work with sales, marketing, and operations teams.',
      requirements: 'Proficiency in SQL, Python (Pandas, NumPy). Experience with Tableau or Power BI. Strong analytical and communication skills.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('data-mining-and-analytics'),
      salaryMin: 45000, salaryMax: 70000, currency: 'ETB',
      deadline: future(40),
      featured: false,
      tags: ['SQL', 'Python', 'Tableau', 'Power BI'],
      experienceLevel: 'Mid',
      yearsOfExperience: '2+',
    },

    // Accounting And Finance
    {
      title: 'Senior Accountant',
      description: 'Manage financial records, prepare financial statements, and ensure compliance with local regulations. Oversee AP/AR processes and work with auditors.',
      requirements: 'BA in Accounting/Finance. CPA or ACCA preferred. 5+ years experience. Strong Excel skills.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('accounting-and-finance'),
      salaryMin: 40000, salaryMax: 65000, currency: 'ETB',
      deadline: future(35),
      featured: true,
      tags: ['Accounting', 'Finance', 'IFRS', 'Excel'],
      experienceLevel: 'Senior',
      yearsOfExperience: '5+',
    },
    {
      title: 'Financial Analyst',
      description: 'Conduct financial analysis, budgeting, and forecasting to support business planning. Prepare presentations for senior management.',
      requirements: 'BA in Finance or Economics. 2+ years in financial analysis. Advanced Excel and financial modeling skills.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('accounting-and-finance'),
      salaryMin: 35000, salaryMax: 55000, currency: 'ETB',
      deadline: future(25),
      featured: false,
      tags: ['Financial Modeling', 'Excel', 'Budgeting', 'Forecasting'],
      experienceLevel: 'Mid',
      yearsOfExperience: '2+',
    },

    // Marketing And Advertisement
    {
      title: 'Digital Marketing Manager',
      description: 'Lead digital marketing campaigns across social media, SEO, and email. Manage a small team of content creators and analyze campaign performance.',
      requirements: '4+ years digital marketing experience. Google Ads and Meta Ads certified. Strong analytical and copywriting skills.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('marketing-and-advertisement'),
      salaryMin: 45000, salaryMax: 70000, currency: 'ETB',
      deadline: future(30),
      featured: true,
      tags: ['SEO', 'Google Ads', 'Social Media', 'Content Marketing'],
      experienceLevel: 'Senior',
      yearsOfExperience: '4+',
    },

    // Health Care
    {
      title: 'General Practitioner',
      description: 'Provide primary healthcare services including diagnosis, treatment, and patient counseling. Work in a modern clinic with a supportive team.',
      requirements: 'MD degree. Licensed to practice in Ethiopia. 2+ years clinical experience. Strong interpersonal skills.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('health-care'),
      salaryMin: 70000, salaryMax: 120000, currency: 'ETB',
      deadline: future(45),
      featured: true,
      tags: ['Medicine', 'Primary Care', 'Clinical'],
      experienceLevel: 'Mid',
      yearsOfExperience: '2+',
    },
    {
      title: 'Nurse (BSc)',
      description: 'Deliver professional nursing care in a hospital setting. Administer medications, monitor patient conditions, and coordinate with physicians.',
      requirements: 'BSc in Nursing. Licensed by Ethiopian Nurses Association. Minimum 1 year experience in hospital setting.',
      location: 'Hawassa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('health-care'),
      salaryMin: 30000, salaryMax: 50000, currency: 'ETB',
      deadline: future(40),
      featured: false,
      tags: ['Nursing', 'Patient Care', 'Hospital'],
      experienceLevel: 'Junior',
      yearsOfExperience: '1+',
    },

    // Human Resource And Talent Management
    {
      title: 'HR Manager',
      description: 'Lead HR operations including recruitment, onboarding, performance management, and employee relations. Develop HR policies aligned with company culture.',
      requirements: 'BA/MA in HRM or related field. 5+ years HR experience. Strong knowledge of Ethiopian labor law.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('human-resource-and-talent-management'),
      salaryMin: 45000, salaryMax: 70000, currency: 'ETB',
      deadline: future(30),
      featured: false,
      tags: ['Recruitment', 'HR Policy', 'Employee Relations', 'Labor Law'],
      experienceLevel: 'Senior',
      yearsOfExperience: '5+',
    },

    // Sales And Promotion
    {
      title: 'Sales Representative',
      description: 'Drive revenue growth by acquiring new clients and maintaining existing accounts. Present products and services to potential customers and close deals.',
      requirements: '2+ years B2B sales experience. Excellent communication and negotiation skills. Results-driven with a track record of meeting targets.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('sales-and-promotion'),
      salaryMin: 25000, salaryMax: 45000, currency: 'ETB',
      deadline: future(20),
      featured: false,
      tags: ['Sales', 'B2B', 'Negotiation', 'CRM'],
      experienceLevel: 'Junior',
      yearsOfExperience: '2+',
    },

    // Construction And Civil Engineering
    {
      title: 'Civil Engineer (Site)',
      description: 'Oversee construction projects from planning to completion. Manage site teams, ensure safety standards, and coordinate with architects and contractors.',
      requirements: 'BSc in Civil Engineering. 3+ years site experience. Familiarity with AutoCAD and project management tools.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('construction-and-civil-engineering'),
      salaryMin: 40000, salaryMax: 65000, currency: 'ETB',
      deadline: future(45),
      featured: false,
      tags: ['Civil Engineering', 'AutoCAD', 'Project Management', 'Construction'],
      experienceLevel: 'Mid',
      yearsOfExperience: '3+',
    },

    // Teaching And Tutor
    {
      title: 'Mathematics Teacher (Secondary)',
      description: 'Teach mathematics to secondary school students. Prepare lesson plans, conduct assessments, and support student learning.',
      requirements: 'BA/BSc in Mathematics or Education. Teaching certification. Minimum 2 years classroom experience.',
      location: 'Dire Dawa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('teaching-and-tutor'),
      salaryMin: 20000, salaryMax: 35000, currency: 'ETB',
      deadline: future(30),
      featured: false,
      tags: ['Teaching', 'Mathematics', 'Secondary School'],
      experienceLevel: 'Junior',
      yearsOfExperience: '2+',
    },

    // Logistic And Supply Chain
    {
      title: 'Logistics Coordinator',
      description: 'Coordinate import/export operations, manage shipping documents, and liaise with freight forwarders and customs authorities.',
      requirements: '2+ years in logistics or supply chain. Knowledge of INCOTERMS and customs procedures. Excellent organizational skills.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('logistic-and-supply-chain'),
      salaryMin: 30000, salaryMax: 50000, currency: 'ETB',
      deadline: future(25),
      featured: false,
      tags: ['Logistics', 'Supply Chain', 'Customs', 'INCOTERMS'],
      experienceLevel: 'Mid',
      yearsOfExperience: '2+',
    },

    // Remote / Hybrid jobs
    {
      title: 'Content Writer (Remote)',
      description: 'Create engaging blog posts, articles, social media content, and marketing copy for our brand. Collaborate with the marketing team to develop content strategies.',
      requirements: 'Excellent written English. 2+ years content writing experience. SEO knowledge a plus. Portfolio required.',
      location: 'Remote, Ethiopia',
      type: 'REMOTE' as const,
      categoryId: findCat('documentation-and-writing-services'),
      salaryMin: 20000, salaryMax: 35000, currency: 'ETB',
      deadline: future(20),
      featured: false,
      tags: ['Content Writing', 'SEO', 'Copywriting', 'Remote'],
      experienceLevel: 'Junior',
      yearsOfExperience: '2+',
    },
    {
      title: 'UX/UI Designer',
      description: 'Design user-centered interfaces for web and mobile applications. Conduct user research, create wireframes and prototypes, and collaborate with developers.',
      requirements: 'Portfolio demonstrating UX/UI work. Proficient in Figma. Understanding of user-centered design principles. 3+ years experience.',
      location: 'Addis Ababa, Ethiopia',
      type: 'HYBRID' as const,
      categoryId: findCat('creative-art-and-design'),
      salaryMin: 45000, salaryMax: 70000, currency: 'ETB',
      deadline: future(35),
      featured: true,
      tags: ['Figma', 'UX Research', 'UI Design', 'Prototyping'],
      experienceLevel: 'Mid',
      yearsOfExperience: '3+',
    },
    {
      title: 'Project Manager',
      description: 'Lead cross-functional teams to deliver projects on time and within budget. Manage stakeholder relationships, project scope, and risk mitigation.',
      requirements: 'PMP or Prince2 certification preferred. 5+ years PM experience. Proficient in Jira, Asana, or similar tools.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('project-management-and-administration'),
      salaryMin: 55000, salaryMax: 90000, currency: 'ETB',
      deadline: future(40),
      featured: true,
      tags: ['Project Management', 'Agile', 'PMP', 'Stakeholder Management'],
      experienceLevel: 'Senior',
      yearsOfExperience: '5+',
    },
    {
      title: 'Legal Counsel',
      description: 'Provide legal advice on corporate matters, contracts, employment law, and regulatory compliance. Draft and review agreements and represent the company in legal proceedings.',
      requirements: 'LLB/LLM degree. Bar membership. 4+ years corporate law experience. Strong drafting skills.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('law'),
      salaryMin: 60000, salaryMax: 100000, currency: 'ETB',
      deadline: future(45),
      featured: false,
      tags: ['Corporate Law', 'Contract Drafting', 'Compliance', 'Employment Law'],
      experienceLevel: 'Senior',
      yearsOfExperience: '4+',
    },
    {
      title: 'Security Officer',
      description: 'Monitor premises, control access, and ensure safety of staff and assets. Conduct regular patrols and respond to incidents.',
      requirements: 'Security training certificate. 1+ year experience. Physical fitness. Ability to work shifts.',
      location: 'Addis Ababa, Ethiopia',
      type: 'FULL_TIME' as const,
      categoryId: findCat('security-and-safety'),
      salaryMin: 12000, salaryMax: 20000, currency: 'ETB',
      deadline: future(15),
      featured: false,
      tags: ['Security', 'Guard', 'Safety'],
      experienceLevel: 'Junior',
      yearsOfExperience: '1+',
    },
  ];

  let created = 0;
  for (const job of jobDefs) {
    await prisma.job.create({
      data: {
        ...job,
        companyId: company.id,
        status: 'PUBLISHED',
        companyName: company.name,
      },
    });
    created++;
  }
  console.log(`✅ ${created} job listings created`);
  console.log('\n🎉 Database seeded successfully!');
  console.log('   Employer login: employer@beleqet.com / Employer@123!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
