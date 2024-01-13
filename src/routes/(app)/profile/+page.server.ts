import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { profileSchema } from './schema';
import { fail } from '@sveltejs/kit';

export const load = (async () => {
	return {
		form: await superValidate(profileSchema)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, profileSchema);
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
