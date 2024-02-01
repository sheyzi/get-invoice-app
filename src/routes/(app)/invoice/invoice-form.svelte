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
	import { Check, ChevronsUpDown, Loader2, Plus, Trash, XCircle, Pen } from 'lucide-svelte';
	import { activeOrganizationStore } from '$lib/stores/organization';

	import {
		createInvoice,
		type CreateInvoice,
		type Contact,
		getActiveOrganization,
		updateInvoiceItem,
		type UpdateInvoice,
		updateInvoice,
		updateOrganization,
		getInvoice
	} from '$lib/appwrite';
	import { page } from '$app/stores';
	import { cn, formatCurrency } from '$lib/utils';
	import { onMount, tick } from 'svelte';
	import { invoiceSchema, itemSchema } from './schema';
	import { z } from 'zod';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let switchingOrganizations = false;
	let selectedContact: Contact | null = null;
	export let invoiceToEdit: any = null;

	let formData: any = {
		
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
		invoice_no: $activeOrganizationStore?.last_invoice_number
			? Number($activeOrganizationStore?.last_invoice_number) + 1
			: 1,
		date: '',
		due_date: '',
		items: [],
		notes: '',
		tax_rate: 10,
		currency_symbol: '₦',
		discount: 0
	};

	onMount(() => {
		if (invoiceToEdit) {
			formData = {
				from: {
					name: invoiceToEdit.organization.name,
					email: invoiceToEdit.organization.email,
					address: `${invoiceToEdit.organization.street}, ${invoiceToEdit.organization.city}, ${invoiceToEdit.organization.state}, ${invoiceToEdit.organization.country}`,
					phone: invoiceToEdit.organization.phone,
					vat_id: invoiceToEdit.organization.vat_id
				},
				to: {
					name: invoiceToEdit.contact.name,
					email: invoiceToEdit.contact.email,
					address: invoiceToEdit.contact.address,
					phone: invoiceToEdit.contact.phone,
					vat_id: invoiceToEdit.contact.vat_id
				},
				invoice_prefix: invoiceToEdit.invoice_prefix,
				invoice_no: invoiceToEdit.invoice_no,
				date: new Date(invoiceToEdit.date).toISOString().split('T')[0],
				due_date: new Date(invoiceToEdit.due_date).toISOString().split('T')[0],
				items: invoiceToEdit.items,
				notes: invoiceToEdit.notes,
				tax_rate: invoiceToEdit.tax_rate,
				currency_symbol: invoiceToEdit.currency_symbol,
				discount: invoiceToEdit.discount
			};

			selectedContact = invoiceToEdit.contact;
		}
	});

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
		formData.discount = isNaN(Number(formData.discount)) ? 0 : Number(formData.discount);

		if (formData.discount > 100) {
			formData.discount = 100;
		} else if (formData.discount < 0) {
			formData.discount = 0;
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

	$: subtotal = formData.items.reduce((acc: number, item: any) => {
		if (item.unit_price) {
			return acc + item.quantity * item.unit_price;
		} else {
			return acc;
		}
	}, 0);

	$: tax = formData.items.reduce((acc: number, item: any) => {
		return (
			acc + (item.is_taxable ? item.quantity * item.unit_price * (formData.tax_rate / 100) : 0)
		);
	}, 0);

	$: discount = formData.items.reduce((acc: number, item: any) => {
		return acc + item.quantity * item.unit_price * (formData.discount / 100);
	}, 0);

	$: total = formData.items.reduce((acc: number, item: any) => {
		return acc + item.quantity * item.unit_price + tax - discount;
	}, 0);

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

					if (!invoiceToEdit) {
						const dataToSend: CreateInvoice = {
							tax_rate: formData.tax_rate,
							currency_symbol: formData.currency_symbol,
							date: new Date(formData.date),
							due_date: new Date(formData.due_date),
							items: formData.items,
							notes: formData.notes,
							invoice_prefix: formData.invoice_prefix,
							invoice_no: formData.invoice_no,
							discount: formData.discount
						};

						if (selectedContact) {
							const invoice = await createInvoice(dataToSend, selectedContact.$id);
							await updateOrganization($activeOrganizationStore.$id, {
								last_invoice_number: JSON.stringify(formData.invoice_no).padStart(
									5 - JSON.stringify(formData.invoice_no).length,
									'0'
								)
							});
							const activeOrganization = await getActiveOrganization();
							activeOrganizationStore.set(activeOrganization);
							toast.success('Invoice created successfully.');
							await goto(`/invoice/${invoice.$id}`);
						} else {
							toast.error('Please select a contact to continue.');
						}
					} else {
						let dataToSend: UpdateInvoice = {
							tax_rate: formData.tax_rate,
							currency_symbol: formData.currency_symbol,
							date: new Date(formData.date),
							due_date: new Date(formData.due_date),
							notes: formData.notes,
							invoice_prefix: formData.invoice_prefix,
							discount: formData.discount,
							items: []
						};

						formData.items.forEach((item: any) => {
							if (item.$id) {
								dataToSend.items?.push(item.$id);
							} else {
								dataToSend.items?.push(item);
							}
						});

						await updateInvoice(invoiceToEdit.$id, dataToSend);

						const activeOrganization = await getActiveOrganization();
						activeOrganizationStore.set(activeOrganization);
						toast.success('Invoice updated successfully.');
						await goto(`/invoice/${invoiceToEdit.$id}`);
					}
				} catch (error) {
					if (error instanceof z.ZodError) {
						errors = error.flatten().fieldErrors;
						toast.error('Please check the form for errors.');
						errors.items = [];

						if (errors.items_length) {
							toast.error('Please add at least one item.');
						}

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

	let itemModalOpen = false;
	let itemEditMode = false;
	let itemEditIndex = 0;
	let focusedItem: any = {
		name: '',
		description: '',
		quantity: 1,
		unit_price: 0,
		is_taxable: true
	};
	let itemErrors: any = {};

	$: focusedItem.unit_price = isNaN(Number(focusedItem.unit_price))
		? 0
		: Number(focusedItem.unit_price);

	$: focusedItem.quantity = isNaN(Number(focusedItem.quantity))
		? 1
		: focusedItem.quantity < 1
			? 1
			: Number(focusedItem.quantity);

	const openItemModal = () => {
		itemModalOpen = true;
	};

	const closeItemModal = () => {
		itemModalOpen = false;
	};

	const addItem = () => {
		itemErrors = {};

		try {
			itemSchema.parse(focusedItem);

			formData.items = [...formData.items, focusedItem];
			focusedItem = {
				name: '',
				description: '',
				quantity: 1,
				unit_price: 0,
				is_taxable: true
			};
			closeItemModal();
		} catch (error) {
			if (error instanceof z.ZodError) {
				itemErrors = error.flatten().fieldErrors;
				toast.error('Please check the form for errors.');
				return;
			}

			console.error(error);

			toast.error('Something went wrong. Please try again later.');
		}
	};

	let updatingItem = false;

	const updateItem = async () => {
		updatingItem = true;
		itemErrors = {};

		try {
			itemSchema.parse(focusedItem);

			formData.items[itemEditIndex] = focusedItem;

			if (focusedItem.$id) {
				await updateInvoiceItem(focusedItem.$id, {
					name: focusedItem.name,
					description: focusedItem.description,
					quantity: focusedItem.quantity,
					unit_price: focusedItem.unit_price,
					is_taxable: focusedItem.is_taxable
				});
			}

			focusedItem = {
				name: '',
				description: '',
				quantity: 1,
				unit_price: 0,
				is_taxable: true
			};
			closeItemModal();
		} catch (error) {
			if (error instanceof z.ZodError) {
				itemErrors = error.flatten().fieldErrors;
				toast.error('Please check the form for errors.');
				return;
			}

			console.error(error);

			toast.error('Something went wrong. Please try again later.');
		} finally {
			updatingItem = false;
		}
	};

	let togglingPaymentStatus = false;

	const togglePaymentStatus = async () => {
		togglingPaymentStatus = true;
		try {
			await updateInvoice(invoiceToEdit.$id, {
				paid: invoiceToEdit.paid ? false : true
			});

			const activeOrganization = await getActiveOrganization();
			activeOrganizationStore.set(activeOrganization);
			invoiceToEdit = await getInvoice(invoiceToEdit.$id);
			toast.success(`Invoice marked as ${invoiceToEdit.paid ? 'paid' : 'unpaid'}.`);
		} catch (error) {
			console.error(error);
			toast.error('Something went wrong. Please try again later.');
		} finally {
			togglingPaymentStatus = false;
		}
	};
</script>

<div class="fixed left-0 top-0 z-50 h-screen w-screen px-5" class:hidden={!itemModalOpen}>
	<div class="absolute left-0 top-0 h-screen w-screen bg-black/50"></div>
	<div class="absolute left-0 top-0 flex h-screen w-screen items-center justify-center">
		<Card.Root class="bg-background md:min-w-[500px]">
			<Card.Header class="mb-0">
				<div class="flex items-center justify-between">
					<h3 class="font-semibold">{itemEditMode ? `Edit ${focusedItem.name}` : 'Add Item'}</h3>
					<Button variant="ghost" size="icon" on:click={closeItemModal}>
						<XCircle />
					</Button>
				</div>
			</Card.Header>
			<Card.Content class="p-5">
				<div class="space-y-4">
					<div class="space-y-2">
						<Label required class="text-xs">NAME:</Label>
						<Input
							class="w-full rounded border border-muted-foreground p-2"
							placeholder="Item Name"
							bind:value={focusedItem.name}
						/>

						{#if itemErrors.name}
							{#each itemErrors.name as error}
								<p class="mt-1 text-xs text-destructive">{error}</p>
							{/each}
						{/if}
					</div>

					<div class="space-y-2">
						<Label class="text-xs">DESCRIPTION:</Label>
						<Textarea
							class="w-full rounded border border-muted-foreground p-2"
							placeholder="Item Description"
							bind:value={focusedItem.description}
						/>

						{#if itemErrors.description}
							{#each itemErrors.description as error}
								<p class="mt-1 text-xs text-destructive">{error}</p>
							{/each}
						{/if}
					</div>

					<div class="grid grid-cols-2 gap-4">
						<div class="space-y-2">
							<Label required class="text-xs">UNIT PRICE:</Label>
							<Input
								class="w-full rounded border border-muted-foreground p-2"
								placeholder="8000"
								bind:value={focusedItem.unit_price}
							/>

							{#if itemErrors.unit_price}
								{#each itemErrors.unit_price as error}
									<p class="mt-1 text-xs text-destructive">{error}</p>
								{/each}
							{/if}
						</div>
						<div class="space-y-2">
							<Label required class="text-xs">QUANTITY:</Label>
							<Input
								class="w-full rounded border border-muted-foreground p-2"
								placeholder="Item Quantity"
								bind:value={focusedItem.quantity}
							/>

							{#if itemErrors.quantity}
								{#each itemErrors.quantity as error}
									<p class="mt-1 text-xs text-destructive">{error}</p>
								{/each}
							{/if}
						</div>

						<div class="space-y-2">
							<Label class="text-xs">TAX:</Label>
							<Checkbox class="p-2" bind:checked={focusedItem.is_taxable} />

							{#if itemErrors.is_taxable}
								{#each itemErrors.is_taxable as error}
									<p class="mt-1 text-xs text-destructive">{error}</p>
								{/each}
							{/if}
						</div>
					</div>

					<div class="mt-5 flex justify-end">
						<Button variant="default" on:click={itemEditMode ? updateItem : addItem}>
							{#if updatingItem}
								<Loader2 class="h-4 w-4 animate-spin" />
							{:else}
								{itemEditMode ? 'Update Item' : 'Add Item'}
							{/if}
						</Button>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>

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

<div class="relative mt-5 rounded border p-5 shadow">
	{#if switchingOrganizations}
		<div class="flex h-full items-center justify-center">
			<Loader2 class="h-8 w-8 text-gray-500" />
		</div>
	{:else}
		<div class="grid h-full w-full grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
			
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
								value={JSON.stringify(formData.invoice_no).padStart(
									5 - JSON.stringify(formData.invoice_no).length,
									'0'
								)}
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

					<Label class="text-xs" for="discount">DISCOUNT (%):</Label>

					<div class="col-span-4 space-x-2">
						<Input
							class="w-full rounded border border-muted-foreground p-2"
							id="discount"
							type="number"
							max={100}
							min={0}
							bind:value={formData.discount}
							placeholder="0%"
						/>
						{#if errors.discount}
							{#each errors.discount as error}
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
					<Table.Header class="w-full">
						<Table.Row>
							<Table.Head class="min-w-full">Info</Table.Head>
							<Table.Head class="min-w-full">Qty</Table.Head>
							<Table.Head class="min-w-full">Unit Price</Table.Head>
							<Table.Head class="min-w-full">Tax</Table.Head>
							<Table.Head class="min-w-full">Discount</Table.Head>
							<Table.Head class="min-w-full">Total</Table.Head>
							<Table.Head class="min-w-full"></Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each formData.items as item, i (i)}
							<Table.Row>
								<Table.Cell class="align-top">
									<p class="font-semibold">{item.name}</p>
									<p class="text-sm text-muted-foreground">{item.description}</p>
								</Table.Cell>
								<Table.Cell class="align-top">
									<p>{item.quantity}</p>
								</Table.Cell>
								<Table.Cell class="align-top font-medium">
									<p>{formatCurrency(item.unit_price)}</p>
								</Table.Cell>
								<Table.Cell class="align-top font-medium">
									{#if item.is_taxable}
										<p>
											{formatCurrency(item.quantity * item.unit_price * (formData.tax_rate / 100))}
										</p>
									{:else}
										<p>0</p>
									{/if}
								</Table.Cell>

								<Table.Cell class="align-top font-medium">
									<p>
										-{formatCurrency(item.quantity * item.unit_price * (formData.discount / 100))}
									</p>
								</Table.Cell>

								<Table.Cell class="align-top font-medium">
									{#if item.is_taxable}
										<p>
											{formatCurrency(
												item.quantity * item.unit_price +
													item.quantity * item.unit_price * (formData.tax_rate / 100) -
													item.quantity * item.unit_price * (formData.discount / 100)
											)}
										</p>
									{:else}
										<p>
											{formatCurrency(
												item.quantity * item.unit_price -
													item.quantity * item.unit_price * (formData.discount / 100)
											)}
										</p>
									{/if}
								</Table.Cell>
								<Table.Cell class="align-top font-medium">
									<Button
										variant="secondary"
										size="icon"
										on:click={() => {
											itemEditMode = true;
											itemEditIndex = i;
											focusedItem = item;
											openItemModal();
										}}
									>
										<Pen class="h-4 w-4" />
									</Button>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>

				<div class="space-y-4 md:hidden">
					{#each formData.items as item, i (i)}
						<Card.Root>
							<Card.Content class="space-y-4 p-5">
								<div>
									<div class="flex items-center space-x-2">
										<p class="text-sm">Name:</p>
										<p class="text-sm font-semibold">
											{item.name}
										</p>
									</div>
								</div>

								<div class:hidden={!item.description.length}>
									<p class="text-sm">Description:</p>
									<p class="mt-2 text-sm font-semibold text-muted-foreground">
										{item.description}
									</p>
								</div>

								<div class="flex items-center space-x-2">
									<p class="text-sm">Quantity:</p>
									<p class="text-sm font-semibold">
										{item.quantity}
									</p>
								</div>

								<div class="flex items-center space-x-2">
									<p class="text-sm">Unit Price:</p>
									<p class="text-sm font-semibold">
										{formatCurrency(item.unit_price)}
									</p>
								</div>

								<div class="flex items-center space-x-2">
									<p class="text-sm">Tax:</p>
									<p class="text-sm font-semibold">
										{formatCurrency(
											item.is_taxable
												? item.quantity * item.unit_price * (formData.tax_rate / 100)
												: 0
										)}
									</p>
								</div>

								<div class="flex items-center space-x-2">
									<p class="text-sm">Discount:</p>
									<p class="text-sm font-semibold">
										{formatCurrency(item.quantity * item.unit_price * (formData.discount / 100))}
									</p>
								</div>

								<div class="flex items-center space-x-2">
									<p class="text-sm">Total:</p>
									<p class="text-sm font-semibold">
										{formatCurrency(
											item.is_taxable
												? item.quantity * item.unit_price +
														item.quantity * item.unit_price * (formData.tax_rate / 100) -
														item.quantity * item.unit_price * (formData.discount / 100)
												: item.quantity * item.unit_price -
														item.quantity * item.unit_price * (formData.discount / 100)
										)}
									</p>
								</div>

								<div class="mt-5 flex justify-end">
									<!-- <Button
										variant="destructive"
										size="sm"
										class="w-full"
										on:click={() => {
											formData.items = formData.items.filter((_, index) => index !== i);
										}}
									>
										<Trash class="mr-2 h-4 w-4" />
										Remove Item
									</Button> -->

									<Button
										variant="secondary"
										size="sm"
										class="w-full"
										on:click={() => {
											itemEditMode = true;
											itemEditIndex = i;
											focusedItem = item;
											openItemModal();
										}}
									>
										<Pen class="h-4 w-4" />
										Edit Item
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
							// formData.items = [
							// 	...formData.items,
							// 	{
							// 		name: '',
							// 		description: '',
							// 		quantity: 1,
							// 		unit_price: 0,
							// 		is_taxable: true
							// 	}
							// ];

							openItemModal();
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
								{formatCurrency(subtotal)}
							</p>
						</div>
						<div class="flex items-center space-x-2">
							<p class="text-sm">Tax:</p>
							<p class="text-sm font-semibold">
								{formatCurrency(tax)}
							</p>
						</div>
						<div class="flex items-center space-x-2">
							<p class="text-sm">Discount:</p>
							<p class="text-sm font-semibold">
								{formatCurrency(discount)}
							</p>
						</div>
						<div class="flex items-center space-x-2">
							<p class="text-sm">Total:</p>
							<p class="text-sm font-semibold">
								{formatCurrency(total)}
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
					{:else if invoiceToEdit}
						Update Invoice
					{:else}
						Create Invoice
					{/if}
				</Button>
			</div>

			{#if invoiceToEdit}
				<Button
					class="bottom-10 right-0 md:col-span-2"
					variant="secondary"
					on:click={togglePaymentStatus}
				>
					{#if togglingPaymentStatus}
						<Loader2 class="animate-spin" />
					{:else if invoiceToEdit.paid}
						Mark as unpaid
					{:else}
						Mark as paid
					{/if}
				</Button>
			{/if}
		</div>
	{/if}
</div>
