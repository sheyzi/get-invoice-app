import { database, ID, updateOrganization, getActiveOrganization } from '$lib/appwrite';
import { PUBLIC_INVOICE_COLLECTION_ID, PUBLIC_APPWRITE_DATABASE_ID } from '$env/static/public';

export const createInvoice = async (name: string) => {
	const organization = await getActiveOrganization();

	if (!organization) {
		throw new Error('No active organization');
	}

	const invoice = await database.createDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_INVOICE_COLLECTION_ID,
		ID.unique(),
		{
			name
		}
	);

	try {
		await updateOrganization(organization?.$id, {
			invoices: [...organization.invoices, invoice.$id]
		});

		return invoice;
	} catch (error) {
		await database.deleteDocument(
			PUBLIC_APPWRITE_DATABASE_ID,
			PUBLIC_INVOICE_COLLECTION_ID,
			invoice.$id
		);
		throw error;
	}
};
