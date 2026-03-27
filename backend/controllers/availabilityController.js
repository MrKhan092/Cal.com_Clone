const prisma = require('../config/db');
const { availabilitySchema } = require('../models/availability.model');

const getAvailability = async (req, res) => {
  try {
    const availability = await prisma.availability.findMany({ orderBy: { dayOfWeek: 'asc' } });
    res.json(availability);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const data = availabilitySchema.parse(req.body);
    await prisma.$transaction([
      prisma.availability.deleteMany({}),
      prisma.availability.createMany({ data })
    ]);
    const updated = await prisma.availability.findMany({ orderBy: { dayOfWeek: 'asc' } });
    res.json(updated);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Failed to update availability' });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { date, eventTypeId } = req.query;
    if (!date || !eventTypeId) {
      return res.status(400).json({ error: 'date and eventTypeId are required' });
    }

    const eventType = await prisma.eventType.findUnique({ where: { id: eventTypeId } });
    if (!eventType) return res.status(404).json({ error: 'Event type not found' });

    const dayOfWeek = new Date(date).getDay();
    const availability = await prisma.availability.findFirst({ where: { dayOfWeek } });
    if (!availability) return res.json([]);

    const toMins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const fromMins = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

    // Generate all slots
    const slots = [];
    let cursor = toMins(availability.startTime);
    const end = toMins(availability.endTime);
    while (cursor + eventType.duration <= end) {
      slots.push({ startTime: fromMins(cursor), endTime: fromMins(cursor + eventType.duration) });
      cursor += eventType.duration;
    }

    // Remove already booked slots
    const existingBookings = await prisma.booking.findMany({
      where: { date, status: 'confirmed' }
    });

    const freeSlots = slots.filter(slot =>
      !existingBookings.some(b =>
        toMins(slot.startTime) < toMins(b.endTime) &&
        toMins(b.startTime) < toMins(slot.endTime)
      )
    );

    res.json(freeSlots);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
};

module.exports = { getAvailability, updateAvailability, getAvailableSlots };