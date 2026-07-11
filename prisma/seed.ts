import { config } from "dotenv";
import { PrismaClient, EnquiryStatus, Prisma } from "@prisma/client";
import { awards } from "../src/data/awards";
import { projects } from "../src/data/projects";
import { services } from "../src/data/services";
import { skillCategories } from "../src/data/skills";

// Prisma CLI / tsx do not load Next.js `.env.local` automatically.
config({ path: ".env.local" });
config({ path: ".env" });

/**
 * Seeds one safe demonstration enquiry and CMS content from static data
 * when the Project table is empty. Does not seed binary images.
 * Run after migrations: npm run db:seed
 */
const prisma = new PrismaClient();

async function seedDemoEnquiry() {
  const existing = await prisma.enquiry.findUnique({
    where: { referenceNumber: "ENQ-DEMO-0001" },
  });

  if (existing) {
    console.log("Demo enquiry already exists:", existing.referenceNumber);
    return;
  }

  const enquiry = await prisma.enquiry.create({
    data: {
      referenceNumber: "ENQ-DEMO-0001",
      fullName: "Demo Client",
      email: "demo.client@example.com",
      phone: null,
      companyName: "Example Pty Ltd",
      country: "Australia",
      service: "Business website",
      budgetRange: "AUD 3,000–7,500",
      timeline: "Within 6–8 weeks",
      projectDescription:
        "This is a demonstration enquiry used for local admin testing. It contains no real client data.",
      consentAccepted: true,
      status: EnquiryStatus.PENDING,
      confirmationEmailSent: false,
      approvalEmailSent: false,
      activities: {
        create: {
          action: "CREATED",
          detail: "Seeded demonstration enquiry",
        },
      },
    },
  });

  console.log("Seeded demo enquiry:", enquiry.referenceNumber);
}

async function seedCmsContent() {
  const projectCount = await prisma.project.count();
  if (projectCount > 0) {
    console.log("CMS content already seeded (projects exist). Skipping.");
    return;
  }

  console.log("Seeding CMS content from static data files...");

  await prisma.project.createMany({
    data: projects.map((project, index) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      summary: project.summary,
      problem: project.problem,
      solution: project.solution,
      categories: project.category,
      status: project.status,
      technologies: project.technologies,
      features: project.features,
      liveUrl: project.liveUrl ?? null,
      caseStudyUrl: project.caseStudyUrl ?? null,
      githubUrl: project.githubUrl ?? null,
      featured: project.featured ?? false,
      isPrivateClient: project.isPrivateClient ?? false,
      published: true,
      sortOrder: index,
      caseStudy: project.caseStudy
        ? (project.caseStudy as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull,
    })),
  });

  await prisma.award.createMany({
    data: awards.map((award, index) => ({
      id: award.id,
      title: award.title,
      organizer: award.organizer,
      year: award.year,
      description: award.description,
      projectName: award.projectName,
      verificationLink: award.verificationLink,
      sortOrder: index,
      published: true,
    })),
  });

  for (const [categoryIndex, category] of skillCategories.entries()) {
    await prisma.skillCategory.create({
      data: {
        id: category.id,
        title: category.title,
        description: category.description,
        sortOrder: categoryIndex,
        skills: {
          create: category.skills.map((skill, skillIndex) => ({
            name: skill.name,
            level: skill.level,
            sortOrder: skillIndex,
          })),
        },
      },
    });
  }

  await prisma.service.createMany({
    data: services.map((service, index) => ({
      id: service.id,
      title: service.title,
      outcome: service.outcome,
      icon: service.icon,
      imageUrl: service.image,
      sortOrder: index,
      published: true,
    })),
  });

  console.log(
    `Seeded ${projects.length} projects, ${awards.length} awards, ${skillCategories.length} skill categories, ${services.length} services.`,
  );
}

async function main() {
  await seedDemoEnquiry();
  await seedCmsContent();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
