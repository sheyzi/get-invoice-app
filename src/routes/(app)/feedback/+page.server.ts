import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { feedbackSchema } from './schema';
import { fail, type Actions } from '@sveltejs/kit';

export const load = (async () => {
	return {
		form: await superValidate(feedbackSchema)
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, feedbackSchema);
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
