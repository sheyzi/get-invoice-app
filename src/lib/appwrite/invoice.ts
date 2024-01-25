import {
	database,
	ID,
	// updateOrganization,
	getActiveOrganization,
	// updateContact,
	type CreateInvoice,
	getContact,
	type UpdateInvoice
} from '$lib/appwrite';
import {
	PUBLIC_INVOICE_COLLECTION_ID,
	PUBLIC_INVOICE_ITEMS_COLLECTION_ID,
	PUBLIC_APPWRITE_DATABASE_ID
} from '$env/static/public';

export const createInvoice = async (data: CreateInvoice, contact_id: string) => {
	const organization = await getActiveOrganization();

	if (!organization) {
		throw new Error('No active organization');
	}

	const contact = await getContact(contact_id);

	if (!contact) {
		throw new Error('Contact not found');
	}

	const invoice = await database.createDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_INVOICE_COLLECTION_ID,
		ID.unique(),
		{
			...data
		}
	);

	try {
		await database.updateDocument(
			PUBLIC_APPWRITE_DATABASE_ID,
			PUBLIC_INVOICE_COLLECTION_ID,
			invoice.$id,
			{
				contact: contact.$id,
				organization: organization.$id
			}
		);
		return invoice;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getInvoice = async (invoice_id: string) => {
	return await database.getDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_INVOICE_COLLECTION_ID,
		invoice_id
	);
};

export const updateInvoice = async (invoice_id: string, data: UpdateInvoice) => {
	return await database.updateDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_INVOICE_COLLECTION_ID,
		invoice_id,
		data
	);
};

export const updateInvoiceItem = async (
	item_id: string,
	data: Partial<CreateInvoice['items'][0]>
) => {
	return await database.updateDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_INVOICE_ITEMS_COLLECTION_ID,
		item_id,
		data
	);
};

export const deleteInvoice = async (invoice_id: string) => {
	return await database.deleteDocument(
		PUBLIC_APPWRITE_DATABASE_ID,
		PUBLIC_INVOICE_COLLECTION_ID,
		invoice_id
	);
};
