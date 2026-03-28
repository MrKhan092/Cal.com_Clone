const prisma = require('../config/db');
const { bookingSchema } = require('../models/booking.model');
const emailService = require('../services/emailService');

const getBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { eventType: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to fetch bookings' });
  }
};

const createBooking = async (req, res) => {
  try {
    const data = bookingSchema.parse(req.body);

    const toMins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

    // Double booking check with 15-minute Buffer padding
    const BUFFER_MINS = 15;
    const existing = await prisma.booking.findMany({
      where: { date: data.date, status: 'confirmed' }
    });
    const conflict = existing.some(b => {
      const paddedBStart = Math.max(0, toMins(b.startTime) - BUFFER_MINS);
      const paddedBEnd = toMins(b.endTime) + BUFFER_MINS;
      return toMins(data.startTime) < paddedBEnd && paddedBStart < toMins(data.endTime);
    });
    if (conflict) return res.status(409).json({ error: 'Time slot is already booked' });

    const booking = await prisma.booking.create({
      data: { ...data, status: 'confirmed' },
      include: { eventType: true }
    });
    
    // Send confirmation email
    await emailService.sendBookingConfirmation(booking);

    res.status(201).json(booking);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    res.status(500).json({ error: err.message || 'Failed to create booking' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'cancelled' },
      include: { eventType: true }
    });
    
    // Send cancellation email
    await emailService.sendBookingCancellation(booking);

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Booking not found' });
    res.status(500).json({ error: err.message || 'Failed to cancel booking' });
  }
};

module.exports = { getBookings, createBooking, cancelBooking };