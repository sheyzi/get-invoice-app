interface CreateItems {
	name: string;
	description?: string;
	quantity: number;
	unit_price: number;
	is_taxable: boolean;
}

export interface CreateInvoice {
	invoice_prefix: string;
	invoice_no: string;
	currency_symbol: string;
	notes?: string;
	tax_rate: number;
	date: Date;
	due_date: Date;
	items: CreateItems[] | string[];
	discount: number;
	paid?: boolean;
}

export interface UpdateInvoice extends Partial<CreateInvoice> {
	items?: CreateItems[] | string[];
}
