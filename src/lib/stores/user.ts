import { writable } from 'svelte/store';
import type { Models } from 'appwrite';

export const currentUser = writable<Models.User<Models.Preferences> | null>(null);
