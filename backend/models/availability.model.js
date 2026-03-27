const { z } = require('zod');
const availabilitySchema = z.array(z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:MM'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:MM'),
  timezone: z.string().default('UTC')
}));

module.exports = { availabilitySchema };