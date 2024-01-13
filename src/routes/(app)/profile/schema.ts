import { z } from 'zod';

export const profileSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(3, { message: 'Name must be at least 3 characters long' }),
	email: z.string({ required_error: 'Email is required' }).email({ message: 'Not a valid email' })
});

export type ProfileSchema = typeof profileSchema;
