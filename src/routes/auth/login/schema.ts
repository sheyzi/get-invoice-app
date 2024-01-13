import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string({ required_error: 'Email is required' }).email({ message: 'Not a valid email' }),
	password: z.string({ required_error: 'Password is required' }).trim()
});

export type LoginSchema = typeof loginSchema;
