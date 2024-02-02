import { account, listOrganizations, getOrganization } from '$lib/appwrite';
import { activeOrganizationStore } from '$lib/stores/organization';
import { AppwriteException, type Models } from 'appwrite';
import { toast } from 'svelte-sonner';

export const setActiveOrganization = async (organizationId: string | null) => {
	if (!organizationId) {
		activeOrganizationStore.set(null);

		return null;
	}

	try {
		if (organizationId === 'null') {
			await account.updatePrefs({
				activeOrganization: null
			});

			activeOrganizationStore.set(null);

			return null;
		} else {
			const organization = await getOrganization(organizationId);

			await account.updatePrefs({
				activeOrganization: organizationId
			});

			activeOrganizationStore.set(organization);

			return organization;
		}
	} catch (error) {
		if (error instanceof AppwriteException && error.code === 404) {
			toast.error('Organization not found');
		}

		console.error(error);
		toast.error('Failed to set active organization');
	}
};

export const getActiveOrganization = async (retries = 0): Promise<Models.Document | null> => {
	const { prefs } = await account.get();

	if (!prefs.activeOrganization || prefs.activeOrganization === 'null') {
		const organizations = await listOrganizations();
		if (organizations.length > 0) {
			await setActiveOrganization(organizations[0].$id);

			return organizations[0];
		} else {
			return null;
		}
	} else {
		try {
			const organization = await getOrganization(prefs.activeOrganization);

			return organization;
		} catch (error) {
			if (error instanceof AppwriteException && error.code === 404) {
				if (retries < 1) {
					await setActiveOrganization('null');

					return await getActiveOrganization(retries + 1);
				} else {
					return null;
				}
			}
			console.error(error);
			toast.error('Failed to get active organization');
			return null;
		}
	}
};

export const forgotPassword = async (email: string, redirect_url: string) => {
	return await account.createRecovery(email, redirect_url);
};

export const resetPassword = async (
	userId: string,
	secret: string,
	password: string,
	passwordAgain: string
) => {
	return await account.updateRecovery(userId, secret, password, passwordAgain);
};
