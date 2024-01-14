export interface CreateOrganization {
	name: string;
	logo?: string;
	street: string;
	city: string;
	state: string;
	zip?: string;
	country: string;
	phone?: string;
	website?: string;
}