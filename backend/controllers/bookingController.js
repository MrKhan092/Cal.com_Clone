const prisma = require('../config/db');
const { bookingSchema } = require('../models/booking.model');

const getBookings = async (req, res) => {
  try {
    const { filter } = req.query; // upcoming | past | all
    const now = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const where = { status: 'confirmed' };
    if (filter === 'upcoming') where.date = { gte: now };
    else if (filter === 'past') where.date = { lt: now };

    const bookings = await prisma.booking.findMany({
      where,
      include: { eventType: true },
      orderBy: { date: filter === 'past' ? 'desc' : 'asc' }
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const createBooking = async (req, res) => {
  try {
    const data = bookingSchema.parse(req.body);

    const toMins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

    // Double booking check
    const existing = await prisma.booking.findMany({
      where: { date: data.date, status: 'confirmed' }
    });
    const conflict = existing.some(b =>
      toMins(data.startTime) < toMins(b.endTime) &&
      toMins(b.startTime) < toMins(data.endTime)
    );
    if (conflict) return res.status(409).json({ error: 'Time slot is already booked' });

    const booking = await prisma.booking.create({
      data: { ...data, status: 'confirmed' },
      include: { eventType: true }
    });
    res.status(201).json(booking);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' }
    });
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Booking not found' });
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

module.exports = { getBookings, createBooking, cancelBooking };