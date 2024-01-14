import { writable } from 'svelte/store';
import { type Models } from 'appwrite';

export const organizations = writable<Models.Document[]>([]);
export const selectedOrganization = writable(null);
