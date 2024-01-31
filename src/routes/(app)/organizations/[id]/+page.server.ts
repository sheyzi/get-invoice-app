import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { organizationSchema } from '../schema';
import { fail, type Actions } from '@sveltejs/kit';

export const load = (async () => {}) satisfies PageServerLoad;

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
