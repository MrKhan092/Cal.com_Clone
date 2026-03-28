// controllers/eventController.js
const prisma = require('../config/db');
const { eventTypeSchema, updateEventTypeSchema } = require('../models/eventType.model');

const getEventTypes = async (req, res) => {
  try {
    const eventTypes = await prisma.eventType.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(eventTypes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event types' });
  }
};

const createEventType = async (req, res) => {
  try {
    const data = eventTypeSchema.parse(req.body);
    const eventType = await prisma.eventType.create({ data });
    res.status(201).json(eventType);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    if (err.code === 'P2002') return res.status(409).json({ error: 'Slug already exists' });
    res.status(500).json({ error: 'Failed to create event type' });
  }
};

const updateEventType = async (req, res) => {
  try {
    const data = updateEventTypeSchema.parse(req.body);
    const eventType = await prisma.eventType.update({ where: { id: req.params.id }, data });
    res.json(eventType);
  } catch (err) {
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors });
    if (err.code === 'P2025') return res.status(404).json({ error: 'Event type not found' });
    res.status(500).json({ error: 'Failed to update event type' });
  }
};

const deleteEventType = async (req, res) => {
  try {
    await prisma.eventType.delete({ where: { id: req.params.id } });
    res.json({ message: 'Event type deleted' });
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Event type not found' });
    res.status(500).json({ error: 'Failed to delete event type' });
  }
};

module.exports = { getEventTypes, createEventType, updateEventType, deleteEventType };