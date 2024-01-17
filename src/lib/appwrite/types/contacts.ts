import { type Models } from 'appwrite';

export interface ContactBase {
	name: string;
	email: string;
	address: string;
	phone?: string;
	vat_id?: string;
}

export interface Contact extends Models.Document, ContactBase {}

export interface CreateContact extends ContactBase {}

export interface UpdateContact extends Partial<CreateContact> {}
