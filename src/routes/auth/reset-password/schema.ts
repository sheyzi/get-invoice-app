import { z } from 'zod';

export const resetPasswordSchema = z
	.object({
		password: z
			.string({ required_error: 'Password is required' })
			.trim()
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/, {
				message: `Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number`
			}),
		confirmPassword: z.string({ required_error: 'Confirm password is required' }).trim()
	})
	.superRefine((data, ctx) => {
		if (data.password !== data.confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Passwords do not match',
				path: ['confirmPassword']
			});
		}
	});
