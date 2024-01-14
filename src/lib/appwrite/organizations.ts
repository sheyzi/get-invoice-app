import { account, database, ID, Query } from '$lib/appwrite';
import type { CreateOrganization } from '$lib/appwrite/types';
import { PUBLIC_APPWRITE_DATABASE_ID, PUBLIC_ORGANIZATION_COLLECTION_ID } from '$env/static/public';

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

export const deleteOrganization = async (id: string) => {
	return await database.deleteDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_ORGANIZATION_COLLECTION_ID,
		id
	);
};
