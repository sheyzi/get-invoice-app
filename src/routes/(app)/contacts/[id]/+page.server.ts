import type { Actions, PageServerLoad } from './$types';
import { contactSchema } from '../schema';
import { superValidate } from 'sveltekit-superforms/server';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	return {
		form: await superValidate(contactSchema)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, contactSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		return {
			form
		};
	}
};
