import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { organizationSchema } from './schema';
import { superValidate } from 'sveltekit-superforms/server';

export const load = (async () => {
	return {
		form: await superValidate(organizationSchema)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, organizationSchema);

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
