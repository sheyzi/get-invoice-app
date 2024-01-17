import { writable } from 'svelte/store';
import { type Models } from 'appwrite';

export const organizationsStore = writable<Models.Document[]>([]);
export const activeOrganizationStore = writable<Models.Document | null>(null);
