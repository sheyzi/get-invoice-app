import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { organizationSchema } from '../schema';
import { superValidate } from 'sveltekit-superforms/server';
import { storage, ID } from '../../../../lib/appwrite';
import { PUBLIC_APPWRITE_BUCKET_ID } from '$env/static/public';
import { ZodError, type AnyZodObject, type ZodObject, type z } from 'zod';

export const load = (async () => {
	return {
		form: await superValidate(organizationSchema)
	};
}) satisfies PageServerLoad;

const validateOrganizationForm = async (formData: FormData) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const data: Record<string, any> = {};
	const errors: Record<string, string[]> = {};

	for (const [key, value] of formData.entries()) {
		data[key] = value;
	}

	try {
		const validatedData = organizationSchema.parse(data);
		return {
			data: validatedData,
			errors,
			isValid: true
		};
	} catch (error) {
		if (error instanceof ZodError) {
			error.errors.forEach((error) => {
				if (error.path) {
					errors[error.path[0]] = [error.message];
				}
			});

			if (data.logo) {
				data.logo = undefined;
			}

			return {
				data,
				errors,
				isValid: false
			};
		} else {
			throw error;
		}
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const form = await validateOrganizationForm(formData);

		if (!form.isValid) {
			return fail(400, {
				form
			});
		}

		if (form.data.logo) {
			const logo = form.data.logo as File;
			form.data.logo = URL.createObjectURL(logo);
		}

		return {
			form
		};

		// try {
		// 	const logo = formData.get('logo');
		// 	let logoUrl: URL | undefined;

		// 	if (logo instanceof File) {
		// 		// Save logo
		// 		const savedLogo = await storage.createFile(PUBLIC_APPWRITE_BUCKET_ID, ID.unique(), logo);

		// 		logoUrl = await storage.getFileView(PUBLIC_APPWRITE_BUCKET_ID, savedLogo.$id);

		// 		form.data.logo = logoUrl;
		// 	}

		// 	return {
		// 		form
		// 	};
		// } catch (error) {
		// 	return fail(400, {
		// 		form
		// 	});
		// }
	}
};
