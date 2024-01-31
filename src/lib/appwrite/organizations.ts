import { account, database, ID, Query, storage } from '$lib/appwrite';
import type { CreateOrganization, UpdateOrganization } from '$lib/appwrite/types';
import {
	PUBLIC_APPWRITE_DATABASE_ID,
	PUBLIC_ORGANIZATION_COLLECTION_ID,
	PUBLIC_APPWRITE_BUCKET_ID
} from '$env/static/public';

export const createOrganization = async (data: CreateOrganization) => {
	const owner = await account.get();

	return await database.createDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_ORGANIZATION_COLLECTION_ID,
		ID.unique(),
		{ ...data, owner: owner.$id }
	);
};

export const listOrganizations = async () => {
	const owner = await account.get();

	return (
		await database.listDocuments(PUBLIC_APPWRITE_DATABASE_ID, PUBLIC_ORGANIZATION_COLLECTION_ID, [
			Query.equal('owner', owner.$id),
			Query.orderDesc('$createdAt')
		])
	).documents;
};

export const getOrganization = async (id: string) => {
	return await database.getDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_ORGANIZATION_COLLECTION_ID,
		id
	);
};

export const deleteOrganization = async (id: string) => {
	const organization = await getOrganization(id);

	if (organization.logo) {
		try {
			await storage.deleteFile(
				PUBLIC_APPWRITE_BUCKET_ID,
				organization.logo.split('/').at(-2) as string
			);
		} catch (error) {
			console.error(error);
		}
	}

	return await database.deleteDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_ORGANIZATION_COLLECTION_ID,
		id
	);
};

export const updateOrganization = async (id: string, data: UpdateOrganization) => {
	return await database.updateDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_ORGANIZATION_COLLECTION_ID,
		id,
		data
	);
};
