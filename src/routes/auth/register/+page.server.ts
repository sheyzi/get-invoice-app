import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { registerSchema } from './schema';
import { superValidate } from 'sveltekit-superforms/server';
import { account, ID } from '$lib/appwrite';
import { AppwriteException } from 'appwrite';

export const load = (async () => {
	return {
		form: await superValidate(registerSchema)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, registerSchema);
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await account.create(ID.unique(), form.data.email, form.data.password, form.data.fullName);
			return {
				form
			};
		} catch (error) {
			if (error instanceof AppwriteException && error.code === 409) {
				form.message = 'User with this email already exists';
				return fail(409, {
					form
				});
			}
			console.log(error);
			form.message = 'Something went wrong, please try again later.';
			return fail(400, {
				form
			});
		}
	}
};
