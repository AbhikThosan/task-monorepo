import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.menuItem.deleteMany({});
  console.log('✅ Cleared existing menu items');

  // Create top-level menu items
  const overview = await prisma.menuItem.create({
    data: {
      label: 'Overview',
      url: '/overview',
      parentId: null,
      order: 1,
    },
  });

  const about = await prisma.menuItem.create({
    data: {
      label: 'About',
      url: '/about',
      parentId: null,
      order: 2,
    },
  });

  const blog = await prisma.menuItem.create({
    data: {
      label: 'Blog',
      url: '/blog',
      parentId: null,
      order: 3,
    },
  });

  console.log('✅ Created top-level menu items');

  // Create sub-items under Overview
  const companyOverview = await prisma.menuItem.create({
    data: {
      label: 'Company Overview',
      url: '/overview/company',
      parentId: overview.id,
      order: 1,
    },
  });

  const businessOverview = await prisma.menuItem.create({
    data: {
      label: 'Business Overview',
      url: '/overview/business',
      parentId: overview.id,
      order: 2,
    },
  });

  const clientOverview = await prisma.menuItem.create({
    data: {
      label: 'Client Overview',
      url: '/overview/clients',
      parentId: overview.id,
      order: 3,
    },
  });

  console.log('✅ Created Overview sub-items');

  // Create nested items under Company Overview (3 levels deep)
  const external = await prisma.menuItem.create({
    data: {
      label: 'External',
      url: '/overview/company/external',
      parentId: companyOverview.id,
      order: 1,
    },
  });

  const internal = await prisma.menuItem.create({
    data: {
      label: 'Internal',
      url: '/overview/company/internal',
      parentId: companyOverview.id,
      order: 2,
    },
  });

  console.log('✅ Created Company Overview sub-items (3 levels deep)');

  // Create 4th level nested item (External -> Departments)
  await prisma.menuItem.create({
    data: {
      label: 'Departments',
      url: '/overview/company/external/departments',
      parentId: external.id,
      order: 1,
    },
  });

  await prisma.menuItem.create({
    data: {
      label: 'Teams',
      url: '/overview/company/external/teams',
      parentId: external.id,
      order: 2,
    },
  });

  console.log('✅ Created 4th level nested items');

  // Create sub-items under About
  await prisma.menuItem.create({
    data: {
      label: 'Our Story',
      url: '/about/story',
      parentId: about.id,
      order: 1,
    },
  });

  await prisma.menuItem.create({
    data: {
      label: 'Team',
      url: '/about/team',
      parentId: about.id,
      order: 2,
    },
  });

  await prisma.menuItem.create({
    data: {
      label: 'Careers',
      url: '/about/careers',
      parentId: about.id,
      order: 3,
    },
  });

  console.log('✅ Created About sub-items');

  // Create sub-items under Blog
  await prisma.menuItem.create({
    data: {
      label: 'Latest Posts',
      url: '/blog/latest',
      parentId: blog.id,
      order: 1,
    },
  });

  await prisma.menuItem.create({
    data: {
      label: 'Categories',
      url: '/blog/categories',
      parentId: blog.id,
      order: 2,
    },
  });

  console.log('✅ Created Blog sub-items');

  console.log('🎉 Seeding completed successfully!');
  console.log('\n📊 Menu Structure:');
  console.log('  - Overview');
  console.log('    - Company Overview');
  console.log('      - External');
  console.log('        - Departments (4 levels deep!)');
  console.log('        - Teams (4 levels deep!)');
  console.log('      - Internal');
  console.log('    - Business Overview');
  console.log('    - Client Overview');
  console.log('  - About');
  console.log('    - Our Story');
  console.log('    - Team');
  console.log('    - Careers');
  console.log('  - Blog');
  console.log('    - Latest Posts');
  console.log('    - Categories');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

