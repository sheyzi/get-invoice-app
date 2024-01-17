import { database, ID, getActiveOrganization, updateOrganization } from '$lib/appwrite';
import { PUBLIC_CONTACTS_COLLECTION_ID, PUBLIC_APPWRITE_DATABASE_ID } from '$env/static/public';
import type { CreateContact, UpdateContact } from '.';

export const createContact = async (data: CreateContact) => {
	const organization = await getActiveOrganization();

	if (!organization) {
		throw new Error('No active organization');
	}

	const contact = await database.createDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_CONTACTS_COLLECTION_ID,
		ID.unique(),
		data
	);

	try {
		await updateOrganization(organization?.$id, {
			contacts: [...organization.contacts, contact.$id]
		});

		return contact;
	} catch (error) {
		await database.deleteDocument(
			PUBLIC_APPWRITE_DATABASE_ID,
			PUBLIC_CONTACTS_COLLECTION_ID,
			contact.$id
		);

		throw error;
	}
};

export const getContact = async (id: string) => {
	return await database.getDocument(PUBLIC_APPWRITE_DATABASE_ID, PUBLIC_CONTACTS_COLLECTION_ID, id);
};

export const updateContact = async (id: string, data: UpdateContact) => {
	return await database.updateDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_CONTACTS_COLLECTION_ID,
		id,
		data
	);
};

export const deleteContact = async (id: string) => {
	return await database.deleteDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_CONTACTS_COLLECTION_ID,
		id
	);
};
