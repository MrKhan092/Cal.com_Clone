const { z } = require('zod');

const eventTypeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  duration: z.number().int().min(5, 'Minimum 5 minutes'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, hyphens')
});

const updateEventTypeSchema = eventTypeSchema.partial();

module.exports = { eventTypeSchema, updateEventTypeSchema };