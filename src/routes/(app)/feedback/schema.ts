import { z } from 'zod';

export const feedbackSchema = z.object({
	title: z
		.string({ required_error: 'Title is required' })
		.min(1, 'Title is required')
		.max(100, 'Title is too long'),
	message: z
		.string({ required_error: 'Message is required' })
		.min(1, 'Message is required')
		.max(5000, 'Message is too long')
});

export type FeedbackSchema = typeof feedbackSchema;
