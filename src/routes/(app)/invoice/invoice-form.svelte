<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	import * as Table from '$lib/components/ui/table';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import * as Card from '$lib/components/ui/card';

	import { ActiveOrg } from '$lib/components/ui/active-org';
	import { Check, ChevronsUpDown, Loader2, Plus, Trash } from 'lucide-svelte';
	import { activeOrganizationStore } from '$lib/stores/organization';

	import {
		createInvoice,
		type ContactBase,
		type CreateContact,
		type CreateInvoice,
		type Contact,
		getActiveOrganization
	} from '$lib/appwrite';
	import { page } from '$app/stores';
	import { cn, formatCurrency } from '$lib/utils';
	import { tick } from 'svelte';
	import { invoiceSchema } from './schema';
	import { z } from 'zod';
	import { toast } from 'svelte-sonner';

	let switchingOrganizations = false;
	let selectedContact: Contact | null = null;

	let formData: any = {
		title: '',
		from: {
			name: '',
			email: '',
			address: '',
			phone: '',
			vat_id: ''
		},
		to: {
			name: '',
			email: '',
			address: '',
			phone: '',
			vat_id: ''
		},
		invoice_prefix: 'INV-',
		date: '',
		due_date: '',
		items: [],
		notes: '',
		tax_rate: 10,
		currency_symbol: '₦'
	};

	$: if (selectedContact) {
		formData.to = {
			name: selectedContact.name,
			email: selectedContact.email,
			address: selectedContact.address,
			phone: selectedContact.phone ?? '',
			vat_id: selectedContact.vat_id ?? ''
		};
	}

	$: formData.from = {
		name: $activeOrganizationStore?.name ?? '',
		email: $activeOrganizationStore?.email ?? '',
		address: `${$activeOrganizationStore?.street}, ${$activeOrganizationStore?.city}, ${$activeOrganizationStore?.state}, ${$activeOrganizationStore?.country}`,
		phone: $activeOrganizationStore?.phone ?? '',
		vat_id: $activeOrganizationStore?.vat_id ?? ''
	};

	$: {
		formData.tax_rate = isNaN(Number(formData.tax_rate)) ? 0 : Number(formData.tax_rate);

		if (formData.tax_rate > 100) {
			formData.tax_rate = 100;
		} else if (formData.tax_rate < 0) {
			formData.tax_rate = 0;
		}
	}

	$: {
		if (formData.items.length) {
			formData.items = formData.items.map((item: any) => {
				item.quantity = isNaN(Number(item.quantity))
					? 1
					: item.quantity < 1
						? 1
						: Number(item.quantity);
				item.unit_price = isNaN(Number(item.unit_price)) ? 0 : Number(item.unit_price);
				return item;
			});
		}
	}

	const selectContact = (value: any) => {
		selectedContact = $activeOrganizationStore?.contacts.find(
			(contact: any) => contact.$id === value
		);
	};

	let isPopoverOpen = false;

	const handleSelectContact = async (contactId: string, popperId: string) => {
		try {
			switchingOrganizations = true;
			closeAndFocusTrigger(popperId);
			await selectContact(contactId);
		} catch (error) {
			console.error(error);
		} finally {
			switchingOrganizations = false;
		}
	};

	function closeAndFocusTrigger(triggerId: string) {
		isPopoverOpen = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	let errors: any = {};
	let loading = false;

	const handleSubmit = async () => {
		errors = {};
		loading = true;
		try {
			if (!$activeOrganizationStore) {
				toast.error('Please select an organization to continue.');
			} else {
				try {
					invoiceSchema.parse(formData);

					const dataToSend: CreateInvoice = {
						title: formData.title,
						tax_rate: formData.tax_rate,
						currency_symbol: formData.currency_symbol,
						date: new Date(formData.date),
						due_date: new Date(formData.due_date),
						items: formData.items,
						notes: formData.notes,
						invoice_prefix: formData.invoice_prefix,
						invoice_no: '001'
					};

					if (selectedContact) {
						await createInvoice(dataToSend, selectedContact.$id);
						const activeOrganization = await getActiveOrganization();
						activeOrganizationStore.set(activeOrganization);
						toast.success('Invoice created successfully.');
					} else {
						toast.error('Please select a contact to continue.');
					}
				} catch (error) {
					if (error instanceof z.ZodError) {
						errors = error.flatten().fieldErrors;
						toast.error('Please check the form for errors.');
						errors.items = [];

						if (errors.items_length) {
							toast.error('Please add at least one item.');
						}
						error.issues.forEach((issue) => {
							if (issue.path[0] === 'items') {
								if (errors.items[issue.path[1]] === undefined) errors.items[issue.path[1]] = {};

								if (errors.items[issue.path[1]][issue.path[2]] === undefined) {
									errors.items[issue.path[1]][issue.path[2]] = [issue.message];
								} else {
									errors.items[issue.path[1]][issue.path[2]].push(issue.message);
								}
							}
						});

						console.log(errors);
						return;
					}

					console.error(error);

					toast.error('Something went wrong. Please try again later.');
				}
			}
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex flex-col-reverse md:flex-row">
	<div
		class="flex items-center justify-between space-y-2 px-1 md:flex-col md:items-start md:justify-start"
	>
		<Label required class="text-sm font-semibold">Contact:</Label>
		<Popover.Root bind:open={isPopoverOpen} let:ids>
			<Popover.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					variant="outline"
					role="combobox"
					size="sm"
					aria-expanded={isPopoverOpen}
					class="w-[200px] justify-between"
				>
					<div class="flex w-full items-center justify-center">
						{selectedContact?.name || 'Select a contact'}
					</div>
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</Popover.Trigger>
			<Popover.Content class="w-[200px] p-0">
				<Command.Root>
					<Command.Input placeholder="Search framework..." />
					<Command.Empty class="p-0">
						<Button
							href="/contacts/create?redirect={$page.url.pathname}"
							variant="outline"
							size="sm"
							class="w-full"
						>
							<Plus class="mr-2 h-4 w-4" />
							New contact
						</Button>
					</Command.Empty>
					<Command.Group>
						{#each $activeOrganizationStore?.contacts as contact}
							<Command.Item
								class="cursor-pointer"
								value={contact.$id}
								onSelect={(currentValue) => {
									handleSelectContact(currentValue, ids.trigger);
								}}
							>
								<Check
									class={cn(
										'mr-2 h-4 w-4 ',
										selectedContact?.$id !== contact.$id && 'text-transparent'
									)}
								/>

								{contact.name}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	</div>
	<ActiveOrg required bind:switchingOrganizations fullWidth={false} isVertical />
</div>

<div class="mt-5 rounded border p-5 shadow">
	{#if switchingOrganizations}
		<div class="flex h-full items-center justify-center">
			<Loader2 class="h-8 w-8 text-gray-500" />
		</div>
	{:else}
		<div class="grid h-full w-full grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
			<div class="grid md:col-span-2 md:grid-cols-2">
				<div class="flex space-x-4">
					<Label class="text-xs" required for="title">TITLE:</Label>
					<div class="w-full">
						<Input
							class="w-full"
							placeholder="LMS Development Invoice"
							name="title"
							id="title"
							bind:value={formData.title}
						/>
						{#if errors.title}
							{#each errors.title as error}
								<p class="mt-1 text-xs text-destructive">{error}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>
			<div class="mt-10 space-y-4">
				<h3 class="font-semibold">FROM: <span class="text-destructive">*</span></h3>
				{#if !activeOrganizationStore}
					<div class="flex items-center justify-center">
						<p class="text-sm text-gray-500">Please select an organization to continue.</p>
					</div>
				{:else}
					<div class="grid grid-cols-5 items-center space-y-4">
						<Label class="text-xs">NAME</Label>
						<Input
							class="col-span-4 w-full rounded border border-muted-foreground p-2"
							disabled
							bind:value={formData.from.name}
						/>
						<Label class="text-xs">EMAIL</Label>
						<Input
							class="col-span-4  w-full rounded border border-muted-foreground p-2"
							disabled
							bind:value={formData.from.email}
						/>
						<Label class="text-xs">ADDRESS</Label>
						<Input
							class="col-span-4  w-full rounded border border-muted-foreground p-2"
							disabled
							bind:value={formData.from.address}
						/>
						<Label class="text-xs">PHONE</Label>
						<Input
							class="col-span-4 w-full rounded border border-muted-foreground p-2"
							disabled
							bind:value={formData.from.phone}
						/>
						<Label class="text-xs">VAT ID</Label>
						<Input
							class="col-span-4 w-full rounded border border-muted-foreground p-2"
							disabled
							bind:value={formData.from.vat_id}
						/>
					</div>
				{/if}
			</div>
			<div class="mt-10 space-y-4">
				<h3 class="font-semibold">TO: <span class="text-destructive">*</span></h3>

				{#if !selectedContact}
					<div
						class="flex w-full items-center justify-center rounded bg-destructive/20 p-5 text-destructive dark:bg-destructive dark:text-foreground"
					>
						<p class="text-sm">Please select a contact to continue.</p>
					</div>
				{:else}
					<div class="grid grid-cols-5 items-center space-y-4">
						<Label class="text-xs">NAME</Label>
						<Input
							class="col-span-4 w-full rounded border border-muted-foreground p-2"
							disabled
							bind:value={formData.to.name}
						/>
						<Label class="text-xs">EMAIL</Label>
						<Input
							class="col-span-4  w-full rounded border border-muted-foreground p-2"
							disabled
							bind:value={formData.to.email}
						/>
						<Label class="text-xs">ADDRESS</Label>
						<Input
							class="col-span-4  w-full rounded border border-muted-foreground p-2"
							disabled
							bind:value={formData.to.address}
						/>
						<Label class="text-xs">PHONE</Label>
						<Input
							class="col-span-4 w-full rounded border border-muted-foreground p-2"
							disabled
							bind:value={formData.to.phone}
						/>
						<Label class="text-xs">VAT ID</Label>
						<Input
							class="col-span-4 w-full rounded border border-muted-foreground p-2"
							disabled
							bind:value={formData.to.vat_id}
						/>
					</div>
				{/if}
			</div>
			<div class="my-5 md:col-span-2">
				<Separator />
			</div>

			<div class="space-y-4">
				<div class="grid grid-cols-5 gap-y-4">
					<Label class="text-xs" for="invoice_prefix" required>NUMBER:</Label>
					<div class="col-span-4">
						<div class="flex w-full space-x-2">
							<Input
								class=" rounded border border-muted-foreground p-2"
								id="invoice_prefix"
								bind:value={formData.invoice_prefix}
								placeholder="INV-"
							/>
							<Input
								class=" rounded border border-muted-foreground p-2"
								id="invoice_no"
								disabled
								value="0001"
								placeholder="0001"
							/>
						</div>
						{#if errors.invoice_prefix}
							{#each errors.invoice_prefix as error}
								<p class="mt-1 text-xs text-destructive">{error}</p>
							{/each}
						{/if}
					</div>

					<Label class="text-xs" for="date" required>DATE:</Label>
					<div class="col-span-4 w-full">
						<Input
							class="w-full rounded border border-muted-foreground p-2"
							id="date"
							type="date"
							bind:value={formData.date}
						/>
						{#if errors.date}
							{#each errors.date as error}
								<p class="mt-1 text-xs text-destructive">{error}</p>
							{/each}
						{/if}
					</div>
					<Label class="text-xs" for="due_date" required>DUE DATE:</Label>
					<div class="col-span-4 w-full">
						<Input
							class="w-full rounded border border-muted-foreground p-2"
							id="due_date"
							type="date"
							bind:value={formData.due_date}
						/>
						{#if errors.due_date}
							{#each errors.due_date as error}
								<p class="mt-1 text-xs text-destructive">{error}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<div class="grid grid-cols-5 gap-y-4">
					<Label class="text-xs" for="tax_rate">TAX RATE (%):</Label>

					<div class="col-span-4 space-x-2">
						<Input
							class="w-full rounded border border-muted-foreground p-2"
							id="tax_rate"
							type="number"
							max={100}
							min={0}
							bind:value={formData.tax_rate}
							placeholder="10%"
						/>
						{#if errors.tax_rate}
							{#each errors.tax_rate as error}
								<p class="mt-1 text-xs text-destructive">{error}</p>
							{/each}
						{/if}
					</div>
					<Label class="text-xs" for="currency_symbol">CURRENCY SYMBOL:</Label>

					<div class="col-span-4 space-x-2">
						<Input
							class="col-span-4 w-full rounded border border-muted-foreground p-2"
							id="currency_symbol"
							bind:value={formData.currency_symbol}
							placeholder="₦"
						/>
						{#if errors.currency_symbol}
							{#each errors.currency_symbol as error}
								<p class="mt-1 text-xs text-destructive">{error}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<div class="my-5 md:col-span-2">
				<Separator />
			</div>

			<div class="md:col-span-2">
				<h3 class="font-semibold uppercase">Items</h3>
			</div>
			<div class="w-full md:col-span-2">
				<Table.Root class="hidden w-full md:block">
					<Table.Header>
						<Table.Row>
							<Table.Head class="min-w-[200px]">Name</Table.Head>
							<Table.Head class="w-full">Description</Table.Head>
							<Table.Head class="min-w-[70px]">Qty</Table.Head>
							<Table.Head class="min-w-[100px]">Unit Price</Table.Head>
							<Table.Head class="min-w-[50px]">Tax</Table.Head>
							<Table.Head></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each formData.items as item, i (i)}
							<Table.Row>
								<Table.Cell class="align-top font-medium">
									<Input bind:value={item.name} placeholder="Item Name" />
									{#if errors.items && errors.items[i] && errors.items[i].name}
										{#each errors.items[i].name as error}
											<p class="mt-1 text-xs text-destructive">{error}</p>
										{/each}
									{/if}
								</Table.Cell>
								<Table.Cell class="align-top font-medium">
									<Textarea bind:value={item.description} placeholder="Item Description" />
									{#if errors.items && errors.items[i] && errors.items[i].description}
										{#each errors.items[i].description as error}
											<p class="mt-1 text-xs text-destructive">{error}</p>
										{/each}
									{/if}
								</Table.Cell>
								<Table.Cell class="align-top font-medium">
									<Input bind:value={item.quantity} placeholder="Item Quantity" />
									{#if errors.items && errors.items[i] && errors.items[i].quantity}
										{#each errors.items[i].quantity as error}
											<p class="mt-1 text-xs text-destructive">{error}</p>
										{/each}
									{/if}
								</Table.Cell>
								<Table.Cell class="align-top font-medium">
									<Input bind:value={item.unit_price} placeholder="Item Unit Price" />
									{#if errors.items && errors.items[i] && errors.items[i].unit_price}
										{#each errors.items[i].unit_price as error}
											<p class="mt-1 text-xs text-destructive">{error}</p>
										{/each}
									{/if}
								</Table.Cell>
								<Table.Cell class="align-top font-medium">
									<Checkbox bind:checked={item.is_taxable} class="p-2" />
								</Table.Cell>
								<Table.Cell class="align-top font-medium">
									<Button
										variant="destructive"
										size="sm"
										on:click={() => {
											formData.items = formData.items.filter((_, index) => index !== i);
										}}
									>
										<Trash class="h-4 w-4" />
									</Button>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>

					{#if formData.items.length < 1}
						<Table.Footer class=" bg-background text-foreground">
							<Table.Row class="border-b-0">
								<Table.Cell colspan={6} class=" text-center">
									<p>No items added yet.</p>
								</Table.Cell>
							</Table.Row>
						</Table.Footer>
					{/if}
				</Table.Root>

				<div class="space-y-4 md:hidden">
					{#each formData.items as item, i (i)}
						<Card.Root>
							<Card.Content class="p-5">
								<div>
									<Label class="text-xs">NAME:</Label>
									<Input
										class="w-full rounded border border-muted-foreground p-2"
										bind:value={item.name}
										placeholder="Item Name"
									/>
								</div>

								<div class="mt-5">
									<Label class="text-xs">DESCRIPTION:</Label>
									<Textarea
										class="w-full rounded border border-muted-foreground p-2"
										bind:value={item.description}
										placeholder="Item Description"
									/>
								</div>

								<div class="mt-5">
									<Label class="text-xs">QUANTITY:</Label>
									<Input
										class="w-full rounded border border-muted-foreground p-2"
										bind:value={item.quantity}
										placeholder="Item Quantity"
									/>
								</div>

								<div class="mt-5">
									<Label class="text-xs">UNIT PRICE:</Label>
									<Input
										class="w-full rounded border border-muted-foreground p-2"
										bind:value={item.unit_price}
										placeholder="Item Unit Price"
									/>
								</div>

								<div class="mt-5 flex items-center justify-between">
									<Label class="text-xs">TAX:</Label>
									<Checkbox bind:checked={item.is_taxable} class="p-2" />
								</div>

								<!-- Remove Item -->
								<div class="mt-5 flex justify-end">
									<Button
										variant="destructive"
										size="sm"
										class="w-full"
										on:click={() => {
											formData.items = formData.items.filter((_, index) => index !== i);
										}}
									>
										<Trash class="mr-2 h-4 w-4" />
										Remove Item
									</Button>
								</div>
							</Card.Content>
						</Card.Root>

						{#if i !== formData.items.length - 1}
							<Separator />
						{/if}
					{:else}
						<Card.Root>
							<Card.Content class="p-3 text-center">
								<p>No items added yet.</p>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>

				<div class="mt-5 flex justify-end">
					<Button
						variant="default"
						size="sm"
						on:click={() => {
							formData.items = [
								...formData.items,
								{
									name: '',
									description: '',
									quantity: 1,
									unit_price: 0,
									is_taxable: true
								}
							];
						}}
					>
						<Plus class="mr-2 h-4 w-4" />
						Add Item
					</Button>
				</div>
			</div>

			<div class="my-5 md:col-span-2">
				<Separator />

				<div class="mt-3 flex justify-between">
					<h3 class="font-semibold">Total</h3>
					<div class="flex flex-col items-end">
						<div class="flex items-center space-x-2">
							<p class="text-sm">Subtotal:</p>
							<p class="text-sm font-semibold">
								{formatCurrency(
									formData.items.reduce((acc, item) => {
										if (item.unit_price) {
											return acc + item.quantity * item.unit_price;
										} else {
											return acc;
										}
									}, 0)
								)}
							</p>
						</div>
						<div class="flex items-center space-x-2">
							<p class="text-sm">Tax:</p>
							<p class="text-sm font-semibold">
								{formatCurrency(
									formData.items.reduce(
										(acc, item) =>
											acc +
											(item.is_taxable
												? item.quantity * item.unit_price * (formData.tax_rate / 100)
												: 0),
										0
									)
								)}
							</p>
						</div>
						<div class="flex items-center space-x-2">
							<p class="text-sm">Total:</p>
							<p class="text-sm font-semibold">
								{formatCurrency(
									formData.items.reduce(
										(acc, item) =>
											acc +
											item.quantity * item.unit_price +
											(item.is_taxable
												? item.quantity * item.unit_price * (formData.tax_rate / 100)
												: 0),
										0
									)
								)}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-4 md:col-span-2">
				<Label class="text-xs" for="notes">NOTES:</Label>
				<Textarea
					class=" w-full rounded border border-muted-foreground p-2"
					id="notes"
					placeholder="Notes"
					rows={5}
				/>
			</div>

			<div class="mt-5 md:col-span-2">
				<Button class="w-full" variant="default" on:click={handleSubmit}>
					{#if loading}
						<Loader2 class="animate-spin" />
					{:else}
						Create Invoice
					{/if}
				</Button>
			</div>
		</div>
	{/if}
</div>
