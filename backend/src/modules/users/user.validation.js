import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const userIdSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
