import { z } from 'zod';

const MAX_FILE_SIZE = 5000000;

export const organizationSchema = z.object({
	name: z
		.string({ required_error: 'Organization name is required' })
		.min(1, { message: 'Organization name is required' })
		.max(255, { message: 'Organization name is too long' }),
	logo: z
		.any()
		.refine((image) => image.size < MAX_FILE_SIZE, 'Image is too large')
		.refine((image) => {
			const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
			if (image.size === 0) return true;
			return allowedTypes.includes(image.type);
		}, 'Only .jpg, .jpeg, .png and .webp formats are supported.')
		.optional(),
	email: z.string().email({ message: 'Email must be a valid email address' }),
	street: z.string().min(1, { message: 'Street is required' }),
	city: z.string().min(1, { message: 'City is required' }),
	state: z.string().min(1, { message: 'State is required' }),
	zip: z.string().optional(),
	country: z.string().min(1, { message: 'Country is required' }),
	phone: z
		.string()
		.regex(/^\+[0-9]{8,15}$/, {
			message: 'Phone number must be a valid international phone number'
		})
		.optional(),
	website: z.string().optional(),
	vat_id: z.string().optional()
});

export type OrganizationSchema = typeof organizationSchema;
