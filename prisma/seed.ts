import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.claimHistory.deleteMany();
  await prisma.claim.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.newsletter.deleteMany();
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

  // Create claims with various statuses and more varied history
  const claims = [
    {
      trackingId: 'CLM-2024-001',
      status: 'Pending',
      claimType: 'Camp Lejeune Water Contamination',
      description: 'Claim related to water contamination exposure at Camp Lejeune military base between 1953 and 1987. Claimant resided on base during service and was diagnosed with a qualifying condition.',
      filedDate: new Date('2024-01-15'),
      lastUpdated: new Date('2024-03-10'),
      notes: 'Initial filing submitted. Awaiting document verification from claim administrator. Medical records have been requested from the VA hospital.',
      nextSteps: 'Submit additional medical records from VA. Complete the exposure timeline questionnaire. Wait for initial review by claims administrator.',
      claimantId: claimants[0].id,
      history: [
        { status: 'Pending', notes: 'Claim submitted to Camp Lejeune Justice Act claims portal', date: new Date('2024-01-15') },
        { status: 'Pending', notes: 'Acknowledgment received from Department of the Navy', date: new Date('2024-01-28') },
        { status: 'Pending', notes: 'Assigned case reviewer — Reviewer ID: CLJ-4821', date: new Date('2024-02-12') },
        { status: 'Pending', notes: 'Additional documentation requested: VA medical records from 2019-2023', date: new Date('2024-03-10') },
      ],
    },
    {
      trackingId: 'CLM-2024-002',
      status: 'Under Review',
      claimType: 'Roundup (Glyphosate) Herbicide',
      description: 'Claim for non-Hodgkin lymphoma diagnosis following prolonged residential use of Roundup herbicide over a 15-year period.',
      filedDate: new Date('2024-02-10'),
      lastUpdated: new Date('2024-05-15'),
      notes: 'Claim is currently under review by the settlement administrator. Medical evidence and expert testimony being evaluated.',
      nextSteps: 'Await review completion. Our legal team is coordinating with the expert witness panel for medical causation testimony.',
      claimantId: claimants[1].id,
      history: [
        { status: 'Pending', notes: 'Claim filed with Roundup settlement program', date: new Date('2024-02-10') },
        { status: 'Pending', notes: 'Purchase receipts and product documentation verified', date: new Date('2024-02-28') },
        { status: 'Pending', notes: 'Medical records submitted — pathology reports confirmed NHL diagnosis', date: new Date('2024-03-15') },
        { status: 'Under Review', notes: 'Assigned to senior reviewer — Reviewer ID: RDP-7712', date: new Date('2024-04-01') },
        { status: 'Under Review', notes: 'Medical expert review initiated — oncologist report requested', date: new Date('2024-04-20') },
        { status: 'Under Review', notes: 'Expert testimony review panel scheduled for late May', date: new Date('2024-05-15') },
      ],
    },
    {
      trackingId: 'CLM-2024-003',
      status: 'Approved',
      claimType: 'Talcum Powder (Ovarian Cancer)',
      description: 'Claim for ovarian cancer linked to long-term use of talcum powder products manufactured by Johnson & Johnson.',
      filedDate: new Date('2023-06-20'),
      lastUpdated: new Date('2024-04-10'),
      notes: 'Claim approved for compensation under the talc settlement agreement. Final payment amount calculated and disbursement scheduled.',
      nextSteps: 'Payment processing in progress. Expected disbursement within 30-60 days. Tax advisor consultation recommended.',
      claimantId: claimants[2].id,
      history: [
        { status: 'Pending', notes: 'Claim filed with talc multidistrict litigation (MDL No. 2738)', date: new Date('2023-06-20') },
        { status: 'Pending', notes: 'Product purchase history documentation verified', date: new Date('2023-08-05') },
        { status: 'Under Review', notes: 'Initial review completed — moved to active review queue', date: new Date('2023-10-15') },
        { status: 'Under Review', notes: 'Medical documentation verified — Stage IIIC ovarian cancer diagnosis confirmed', date: new Date('2023-12-10') },
        { status: 'Correction Needed', notes: 'Minor form correction required — date of diagnosis field update', date: new Date('2024-01-20') },
        { status: 'Under Review', notes: 'Corrected documents resubmitted and accepted', date: new Date('2024-02-05') },
        { status: 'Under Review', notes: 'Settlement eligibility confirmed — Tier 2 qualification met', date: new Date('2024-03-01') },
        { status: 'Approved', notes: 'Claim approved for compensation — Tier 2 settlement amount calculated', date: new Date('2024-04-10') },
      ],
    },
    {
      trackingId: 'CLM-2024-004',
      status: 'Denied',
      claimType: 'Hernia Mesh (Medical Device)',
      description: 'Claim for chronic pain and revision surgery following implantation of a defective hernia mesh product.',
      filedDate: new Date('2024-03-05'),
      lastUpdated: new Date('2024-08-10'),
      notes: 'Claim initially denied due to insufficient documentation linking the mesh product to the claimed injuries. Appeal window is open — 90 days from denial date.',
      nextSteps: 'Contact our team immediately to file an appeal. Additional surgical records and expert medical opinions can strengthen the case for resubmission.',
      claimantId: claimants[3].id,
      history: [
        { status: 'Pending', notes: 'Claim filed with hernia mesh MDL settlement program', date: new Date('2024-03-05') },
        { status: 'Pending', notes: 'Surgical records and implant identification documentation submitted', date: new Date('2024-03-25') },
        { status: 'Under Review', notes: 'Initial documentation review — product lot number verified', date: new Date('2024-05-10') },
        { status: 'Correction Needed', notes: 'Additional evidence requested — post-operative complications records needed', date: new Date('2024-06-15') },
        { status: 'Denied', notes: 'Insufficient documentation provided — causal link between mesh and injuries not established', date: new Date('2024-08-10') },
      ],
    },
    {
      trackingId: 'CLM-2024-005',
      status: 'Correction Needed',
      claimType: 'Paraquat Herbicide (Parkinson\'s Disease)',
      description: 'Claim for Parkinson\'s disease diagnosis following occupational exposure to paraquat herbicide as a licensed agricultural applicator.',
      filedDate: new Date('2024-04-22'),
      lastUpdated: new Date('2024-09-05'),
      notes: 'Discrepancy detected in exposure dates on the claim form. Employment records from the agricultural cooperative need to be reconciled with the stated exposure period.',
      nextSteps: 'Our team will guide you through the correction process. Please gather employment records from the agricultural cooperative covering the 2010-2020 period.',
      claimantId: claimants[4].id,
      history: [
        { status: 'Pending', notes: 'Claim submitted to paraquat MDL settlement program', date: new Date('2024-04-22') },
        { status: 'Pending', notes: 'Applicator license and certification verified', date: new Date('2024-05-10') },
        { status: 'Under Review', notes: 'Initial review in progress — employment history being verified', date: new Date('2024-06-30') },
        { status: 'Under Review', notes: 'Medical records under review — neurologist diagnosis of Parkinson\'s confirmed', date: new Date('2024-07-20') },
        { status: 'Correction Needed', notes: 'Exposure date discrepancy detected — employment records from 2010-2020 period required for reconciliation', date: new Date('2024-09-05') },
      ],
    },
    {
      trackingId: 'CLM-2024-006',
      status: 'Under Review',
      claimType: 'AFFF Firefighting Foam (PFAS)',
      description: 'Claim for thyroid disease and elevated PFAS blood levels following exposure to AFFF firefighting foam during 20-year career as a civilian firefighter at a military installation.',
      filedDate: new Date('2024-05-12'),
      lastUpdated: new Date('2024-10-28'),
      notes: 'Claim proceeding through review. Expert medical evaluation and environmental exposure assessment scheduled.',
      nextSteps: 'Await medical evaluation results and environmental exposure report. Our team is coordinating with the review panel and toxicology experts.',
      claimantId: claimants[5].id,
      history: [
        { status: 'Pending', notes: 'Claim filed with AFFF/PFAS litigation settlement program', date: new Date('2024-05-12') },
        { status: 'Pending', notes: 'Firefighter employment records and base assignment history received', date: new Date('2024-06-01') },
        { status: 'Pending', notes: 'Blood test results showing elevated PFAS levels submitted', date: new Date('2024-07-10') },
        { status: 'Under Review', notes: 'Medical review initiated — endocrinologist report on thyroid condition requested', date: new Date('2024-08-15') },
        { status: 'Under Review', notes: 'Environmental exposure assessment commissioned', date: new Date('2024-09-20') },
        { status: 'Under Review', notes: 'Expert evaluation and toxicology review scheduled for November', date: new Date('2024-10-28') },
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

  // Create newsletter subscribers
  const newsletterSubscribers = [
    { email: 'john.doe@example.com', claimType: 'Camp Lejeune Water Contamination', updates: true, deadlines: true, tips: true },
    { email: 'jane.smith@example.com', claimType: 'Roundup (Glyphosate) Herbicide', updates: true, deadlines: true, tips: false },
    { email: 'mike.johnson@example.com', claimType: null, updates: true, deadlines: false, tips: true },
    { email: 'lisa.brown@example.com', claimType: 'Talcum Powder (Ovarian Cancer)', updates: false, deadlines: true, tips: true },
    { email: 'newsletter-fan@example.com', claimType: null, updates: true, deadlines: true, tips: true },
  ];

  for (const sub of newsletterSubscribers) {
    await prisma.newsletter.create({ data: sub });
  }

  console.log('✅ Seed data created successfully!');
  console.log(`  - ${claimants.length} claimants`);
  console.log(`  - ${claims.length} claims`);
  console.log(`  - ${newsletterSubscribers.length} newsletter subscribers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
