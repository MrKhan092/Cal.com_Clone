const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.availability.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.eventType.deleteMany({});

  console.log('Seeding Event Types...');
  const event1 = await prisma.eventType.create({
    data: {
      title: '15 Min Meeting',
      description: 'Quick introductory call.',
      duration: 15,
      slug: '15min',
    },
  });

  const event2 = await prisma.eventType.create({
    data: {
      title: '30 Min Discovery',
      description: 'A longer discussion for project scoping.',
      duration: 30,
      slug: '30min',
    },
  });

  console.log('Seeding Availability (Mon-Fri, 9am - 5pm)...');
  const availabilityData = [];
  for (let i = 1; i <= 5; i++) {
    availabilityData.push({
      dayOfWeek: i,
      startTime: '09:00',
      endTime: '17:00',
      timezone: 'UTC',
    });
  }
  await prisma.availability.createMany({ data: availabilityData });

  console.log('Seeding fake bookings...');
  // Tomorrow's date string YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  await prisma.booking.create({
    data: {
      eventTypeId: event1.id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      date: dateStr,
      startTime: '10:00',
      endTime: '10:15',
    },
  });

  await prisma.booking.create({
    data: {
      eventTypeId: event2.id,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      date: dateStr,
      startTime: '14:00',
      endTime: '14:30',
    },
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
