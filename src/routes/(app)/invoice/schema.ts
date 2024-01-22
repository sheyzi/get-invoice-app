import { z } from 'zod';

// let formData = {
// 	title: '',
// 	from: {
// 		name: '',
// 		email: '',
// 		address: '',
// 		phone: '',
// 		vat_id: ''
// 	},
// 	to: {
// 		name: '',
// 		email: '',
// 		address: '',
// 		phone: '',
// 		vat_id: ''
// 	},
// 	invoice_no: '',
// 	date: new Date(),
// 	due_date: new Date(),
// 	items: [
// 		{
// 			name: '',
// 			description: '',
// 			quantity: 1,
// 			unit_price: 0,
// 			is_taxable: true
// 		}
// 	],
// 	notes: '',
// 	tax_rate: 10,
// 	currency_symbol: '₦'
// };

export const invoiceSchema = z
	.object({
		title: z
			.string({ required_error: 'Title is required' })
			.min(1, { message: 'Title is required' })
			.max(100, { message: 'Title is too long' }),
		invoice_prefix: z.string().min(1, { message: 'Invoice prefix is required' }),
		date: z.string({ required_error: 'Date is required' }).min(1, { message: 'Date is required' }),
		due_date: z
			.string({ required_error: 'Due date is required' })
			.min(1, { message: 'Due date is required' }),
		items: z.array(
			z.object({
				name: z.string().min(1, { message: 'Name is required' }),
				description: z.string().optional(),
				quantity: z.number().int().min(1, { message: 'Quantity must be at least 1' }),
				unit_price: z.number().int().positive({ message: 'Unit price must be positive' }),
				is_taxable: z.boolean()
			})
		),
		notes: z.string().optional(),
		tax_rate: z.number().int({ message: 'Tax rate must be an integer' }).min(0).max(100),
		currency_symbol: z
			.string()
			.min(1, { message: 'Currency symbol is required' })
			.max(5, { message: 'Currency symbol is too long' })
	})
	.superRefine((data, ctx) => {
		if (data.tax_rate < 0 || data.tax_rate > 100) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Tax rate must be between 0 and 100',
				path: ['tax_rate']
			});
		}

		if (data.items.length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Invoice must have at least one item',
				path: ['items_length']
			});
		}

		const date = new Date(data.date);
		const due_date = new Date(data.due_date);

		if (date > due_date) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Due date must be after date',
				path: ['due_date']
			});
		}
	});
