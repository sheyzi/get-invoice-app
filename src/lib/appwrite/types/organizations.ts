export interface CreateOrganization {
	name: string;
	logo?: string;
	email: string;
	street: string;
	city: string;
	state: string;
	zip?: string;
	country: string;
	phone?: string;
	website?: string;
	last_invoice_number?: string;
	vat_id?: string;
}

export interface UpdateOrganization extends Partial<CreateOrganization> {
	invoices?: string[];
	contacts?: string[];
}
