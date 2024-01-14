import { account, database, ID, Query } from './appwrite';
import type { CreateOrganization } from './types';
import { createOrganization, listOrganizations, deleteOrganization } from './organizations';

export type { CreateOrganization };

export { account, database, ID, Query, createOrganization, listOrganizations, deleteOrganization };
