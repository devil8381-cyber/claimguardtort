import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.claimHistory.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.claimant.deleteMany();

  // Create claimants
  const claimants = await Promise.all([
    prisma.claimant.create({
      data: {
        firstName: 'James',
        lastName: 'Richardson',
        email: 'james.richardson@email.com',
        phone: '(555) 123-4567',
      },
    }),
    prisma.claimant.create({
      data: {
        firstName: 'Maria',
        lastName: 'Gonzalez',
        email: 'maria.gonzalez@email.com',
        phone: '(555) 234-5678',
      },
    }),
    prisma.claimant.create({
      data: {
        firstName: 'Robert',
        lastName: 'Chen',
        email: 'robert.chen@email.com',
        phone: '(555) 345-6789',
      },
    }),
    prisma.claimant.create({
      data: {
        firstName: 'Sarah',
        lastName: 'Thompson',
        email: 'sarah.thompson@email.com',
        phone: '(555) 456-7890',
      },
    }),
    prisma.claimant.create({
      data: {
        firstName: 'David',
        lastName: 'Williams',
        email: 'david.williams@email.com',
        phone: '(555) 567-8901',
      },
    }),
    prisma.claimant.create({
      data: {
        firstName: 'Patricia',
        lastName: 'Martinez',
        email: 'patricia.martinez@email.com',
        phone: '(555) 678-9012',
      },
    }),
  ]);

  // Create claims with various statuses
  const claims = [
    {
      trackingId: 'CLM-2024-001',
      status: 'Pending',
      claimType: 'Product Liability',
      description: 'Claim related to defective medical device - Hip replacement implant',
      filedDate: new Date('2024-09-15'),
      lastUpdated: new Date('2024-11-20'),
      notes: 'Initial filing submitted. Awaiting document verification from claim administrator.',
      nextSteps: 'Submit additional medical records. Wait for initial review by claims administrator.',
      claimantId: claimants[0].id,
      history: [
        { status: 'Pending', notes: 'Claim submitted to claims administrator', date: new Date('2024-09-15') },
        { status: 'Pending', notes: 'Acknowledgment received, assigned case reviewer', date: new Date('2024-10-01') },
        { status: 'Pending', notes: 'Additional documentation requested', date: new Date('2024-11-20') },
      ],
    },
    {
      trackingId: 'CLM-2024-002',
      status: 'Under Review',
      claimType: 'Environmental Tort',
      description: 'Water contamination claim affecting residential property',
      filedDate: new Date('2024-06-10'),
      lastUpdated: new Date('2024-12-01'),
      notes: 'Claim is currently under review by the settlement administrator. Medical evidence being evaluated.',
      nextSteps: 'Await review completion. Our team is monitoring for any required follow-up documentation.',
      claimantId: claimants[1].id,
      history: [
        { status: 'Pending', notes: 'Claim filed', date: new Date('2024-06-10') },
        { status: 'Pending', notes: 'Documents verified', date: new Date('2024-07-15') },
        { status: 'Under Review', notes: 'Assigned to senior reviewer', date: new Date('2024-09-20') },
        { status: 'Under Review', notes: 'Medical records under evaluation', date: new Date('2024-12-01') },
      ],
    },
    {
      trackingId: 'CLM-2024-003',
      status: 'Approved',
      claimType: 'Pharmaceutical Liability',
      description: 'Claim for adverse effects from prescribed medication',
      filedDate: new Date('2024-01-20'),
      lastUpdated: new Date('2024-10-15'),
      notes: 'Claim approved. Compensation amount calculated and disbursement scheduled.',
      nextSteps: 'Awaiting payment processing. Expected disbursement within 30-60 days.',
      claimantId: claimants[2].id,
      history: [
        { status: 'Pending', notes: 'Claim filed', date: new Date('2024-01-20') },
        { status: 'Under Review', notes: 'Initial review completed', date: new Date('2024-03-15') },
        { status: 'Under Review', notes: 'Medical documentation verified', date: new Date('2024-05-10') },
        { status: 'Correction Needed', notes: 'Minor form correction required', date: new Date('2024-07-01') },
        { status: 'Under Review', notes: 'Corrected documents resubmitted', date: new Date('2024-07-20') },
        { status: 'Approved', notes: 'Claim approved for compensation', date: new Date('2024-10-15') },
      ],
    },
    {
      trackingId: 'CLM-2024-004',
      status: 'Denied',
      claimType: 'Product Liability',
      description: 'Claim related to defective consumer electronics causing property damage',
      filedDate: new Date('2024-04-05'),
      lastUpdated: new Date('2024-11-10'),
      notes: 'Claim initially denied due to insufficient documentation. Appeal window is open.',
      nextSteps: 'Contact our team immediately to file an appeal. Additional evidence can strengthen your case for resubmission.',
      claimantId: claimants[3].id,
      history: [
        { status: 'Pending', notes: 'Claim filed', date: new Date('2024-04-05') },
        { status: 'Under Review', notes: 'Initial documentation review', date: new Date('2024-05-20') },
        { status: 'Correction Needed', notes: 'Additional evidence requested', date: new Date('2024-08-15') },
        { status: 'Denied', notes: 'Insufficient documentation provided', date: new Date('2024-11-10') },
      ],
    },
    {
      trackingId: 'CLM-2024-005',
      status: 'Correction Needed',
      claimType: 'Environmental Tort',
      description: 'Claim for soil contamination impact on agricultural land',
      filedDate: new Date('2024-08-22'),
      lastUpdated: new Date('2024-12-05'),
      notes: 'Signature mismatch detected on claim form. Documents need to be re-signed and resubmitted.',
      nextSteps: 'Our team will guide you through the re-signing process. Schedule a document correction session.',
      claimantId: claimants[4].id,
      history: [
        { status: 'Pending', notes: 'Claim submitted', date: new Date('2024-08-22') },
        { status: 'Under Review', notes: 'Initial review in progress', date: new Date('2024-09-30') },
        { status: 'Correction Needed', notes: 'Signature verification failed - re-signing required', date: new Date('2024-12-05') },
      ],
    },
    {
      trackingId: 'CLM-2024-006',
      status: 'Under Review',
      claimType: 'Pharmaceutical Liability',
      description: 'Claim for complications from surgical mesh product',
      filedDate: new Date('2024-03-12'),
      lastUpdated: new Date('2024-11-28'),
      notes: 'Claim proceeding through review. Expert medical evaluation scheduled.',
      nextSteps: 'Await medical evaluation results. Our team is coordinating with the review panel.',
      claimantId: claimants[5].id,
      history: [
        { status: 'Pending', notes: 'Claim filed', date: new Date('2024-03-12') },
        { status: 'Pending', notes: 'All documentation received', date: new Date('2024-04-25') },
        { status: 'Under Review', notes: 'Medical review initiated', date: new Date('2024-06-15') },
        { status: 'Under Review', notes: 'Expert evaluation scheduled', date: new Date('2024-11-28') },
      ],
    },
  ];

  for (const claim of claims) {
    const { history, ...claimData } = claim;
    const createdClaim = await prisma.claim.create({
      data: claimData,
    });

    for (const h of history) {
      await prisma.claimHistory.create({
        data: {
          ...h,
          claimId: createdClaim.id,
        },
      });
    }
  }

  console.log('✅ Seed data created successfully!');
  console.log(`  - ${claimants.length} claimants`);
  console.log(`  - ${claims.length} claims`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
