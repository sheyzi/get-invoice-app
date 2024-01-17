import { z } from 'zod';

export const contactSchema = z.object({
	name: z
		.string({ required_error: 'Please enter a name' })
		.min(1, { message: 'Please enter a name' }),
	email: z
		.string({ required_error: 'Please enter an email' })
		.email({ message: 'Please enter a valid email' }),
	address: z
		.string({ required_error: 'Please enter an address' })
		.min(1, { message: 'Please enter an address' }),
	phone: z
		.string()
		.regex(/^\+[0-9]{8,15}$/, {
			message: 'Please enter a valid phone number'
		})
		.optional(),
	vat_id: z.string().optional()
});

export type ContactSchema = typeof contactSchema;
