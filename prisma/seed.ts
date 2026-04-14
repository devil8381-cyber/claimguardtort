import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding sample claimants...');

  const samples = [
    {
      trackingId: 'CLM-2024-001',
      firstName: 'John',
      lastName: 'Martinez',
      email: 'john.martinez@email.com',
      phone: '(555) 123-4567',
      claimType: 'Camp Lejeune',
      status: 'Submitted',
      state: 'NC',
      filedDate: '2024-01-15',
      notes: 'Initial claim filed',
    },
    {
      trackingId: 'CLM-2024-002',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '(555) 234-5678',
      claimType: 'Roundup',
      status: 'Under Review',
      state: 'OH',
      filedDate: '2024-02-20',
      notes: 'Medical records submitted',
    },
    {
      trackingId: 'CLM-2024-003',
      firstName: 'Robert',
      lastName: 'Williams',
      email: 'rwilliams@email.com',
      phone: null,
      claimType: 'Hernia Mesh',
      status: 'Validated',
      state: 'TX',
      filedDate: '2024-03-10',
      notes: 'Surgery date confirmed',
    },
    {
      trackingId: 'CLM-2024-004',
      firstName: 'Linda',
      lastName: 'Davis',
      email: 'l.davis@email.com',
      phone: '(555) 456-7890',
      claimType: 'Talc',
      status: 'Completed',
      state: 'FL',
      filedDate: '2023-11-05',
      notes: 'Settlement received',
    },
    {
      trackingId: 'CLM-2024-005',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'mbrown55@email.com',
      phone: '(555) 567-8901',
      claimType: 'Paraquat',
      status: 'Decision',
      state: 'CA',
      filedDate: '2024-01-30',
      notes: 'Awaiting decision letter',
    },
  ];

  for (const sample of samples) {
    const existing = await db.claimant.findUnique({
      where: { trackingId: sample.trackingId },
    });

    if (existing) {
      console.log(`  ⏭️  ${sample.trackingId} already exists, skipping`);
    } else {
      await db.claimant.create({ data: sample });
      console.log(`  ✅ Created ${sample.trackingId}: ${sample.firstName} ${sample.lastName}`);
    }
  }

  console.log('🎉 Seeding complete!');
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect());
