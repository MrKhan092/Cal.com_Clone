const { z } = require('zod');

const bookingSchema = z.object({
  eventTypeId: z.string().min(1, 'Event type is required'),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:MM')
});

module.exports = { bookingSchema };