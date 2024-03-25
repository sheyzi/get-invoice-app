import { ID, database } from './appwrite';

import type { CreateFeedback } from '.';
import { PUBLIC_FEEDBACK_COLLECTION_ID, PUBLIC_APPWRITE_DATABASE_ID } from '$env/static/public';

export const createFeedback = async (data: CreateFeedback) => {
	return await database.createDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_FEEDBACK_COLLECTION_ID,
		ID.unique(),
		data
	);
};
