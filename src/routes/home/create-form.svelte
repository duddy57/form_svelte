<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';

	import Generate from './generate.svelte';

	import { Input } from '$lib/components/ui/input';
	import { Calendar } from '$lib/components/ui/calendar';
	import { Switch } from '$lib/components/ui/switch';
	import { Separator } from '$lib/components/ui/separator';
	import { Slider } from '$lib/components/ui/slider';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button, buttonVariants } from '$lib/components/ui/button';

	import { goto } from '$app/navigation';

	import { CalendarIcon, Check, ChevronsUpDown, LoaderCircle, Plus } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils';
	import formdate from '$lib/constants';

	import { cvsSchema, type CvsSchema } from '$lib/schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let {
		data
	}: {
		data: {
			form: SuperValidated<Infer<CvsSchema>>;
			user: { email: string };
			client: {
				full_name: string;
				short_name: string;
			}[];
		};
	} = $props();

	let client = data.client;

	let loading = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(cvsSchema),
		taintedMessage: null,
		onUpdated: ({ form: f }) => {
			loading = true;
			{
				f.valid
					? toast.success(`Formulario para empresa: ${f.data.cliente} criado com sucesso!`)
					: toast.error('Por favor, corrija os erros no formulário.');
			}
			loading = false;
		}
	});

	const { form: formData, enhance } = form;

	const df = new DateFormatter('pt-BR', {
		dateStyle: 'medium'
	});

	let valueCalendar = $state<DateValue | undefined>();

	$effect(() => {
		valueCalendar = $formData.form_date ? parseDate($formData.form_date) : undefined;
	});

	let placeholder = $state<DateValue>(today(getLocalTimeZone()));

	let valueLevel = $state(50);
</script>

<div class="max-w-6xl p-6">
	<Card.Root class="bg-secondary/60">
		<Card.Header class="mx-4 flex flex-col items-center justify-between gap-6 md:flex-row">
			<Card.Title>Formulário O.S Interna</Card.Title>
			<div class="flex items-center justify-between space-x-6">
				<Input disabled class="w-full text-center font-bold md:w-auto" value={data.user.email} />
				<Generate {data} />
			</div>
		</Card.Header>
		<Separator />
		<Card.Content class="p-4">
			<form method="POST" action="?/create" class="grid gap-6 space-y-4" use:enhance>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
					<Form.Field {form} name="form_date" class="flex flex-col">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Data</Form.Label>
								<Popover.Root>
									<Popover.Trigger
										{...props}
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-[250px] justify-start pl-4 text-left font-bold',
											!valueCalendar && 'text-muted-foreground'
										)}
									>
										{valueCalendar ? df.format(valueCalendar.toDate(getLocalTimeZone())) : 'Data'}
										<CalendarIcon class="ml-auto size-4 opacity-50" />
									</Popover.Trigger>
									<Popover.Content class="w-auto p-0" side="top">
										<Calendar
											type="single"
											value={valueCalendar as DateValue}
											bind:placeholder
											minValue={new CalendarDate(1900, 1, 1)}
											maxValue={today(getLocalTimeZone())}
											calendarLabel="Data"
											onValueChange={(v) => {
												if (v) {
													$formData.form_date = v.toString();
												} else {
													$formData.form_date = '';
												}
											}}
										/>
									</Popover.Content>
								</Popover.Root>
								<Form.Description>Data de abertura do atendimento</Form.Description>
								<Form.FieldErrors class="font-bold" />
								<input hidden value={$formData.form_date} name={props.name} />
							{/snippet}
						</Form.Control>
					</Form.Field>
					<Form.Field {form} name="tecnico_os" class="flex flex-col">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Tecnico(s) O.S</Form.Label>
								<Select.Root type="multiple" bind:value={$formData.tecnico_os} name={props.name}>
									<Select.Trigger {...props}>
										{$formData.tecnico_os
											? $formData.tecnico_os
											: 'Selecione os tecnicos do atendimento'}
									</Select.Trigger>
									<Select.Content>
										{#each formdate.tec_email as tec}
											<Select.Item value={tec.value} label={tec.label} />
										{/each}
									</Select.Content>
								</Select.Root>
							{/snippet}
						</Form.Control>
						<Form.Description>Tecnico responsavel pelo atendimento.</Form.Description>
						<Form.FieldErrors class="font-bold" />
					</Form.Field>
					<Form.Field {form} name="solicitante" class="flex flex-col">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Solicitante</Form.Label>
								<Input class="w-[250px]" {...props} bind:value={$formData.solicitante} />
							{/snippet}
						</Form.Control>
						<Form.Description>Responsavel por solicita o atendimento.</Form.Description>
						<Form.FieldErrors class="font-bold" />
					</Form.Field>
				</div>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<Form.Field {form} name="cliente" class="flex flex-col">
						<Popover.Root>
							<Form.Control>
								{#snippet children({ props })}
									<div class="flex w-[400px] items-center justify-between">
										<Form.Label>Cliente</Form.Label>
										<Button
											variant="ghost"
											size="sm"
											type="button"
											onclick={() => {
												goto('/home/settings/forms');
											}}
										>
											Novo
											<Plus />
										</Button>
									</div>
									<Popover.Trigger
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-[400px] justify-between',
											!$formData.cliente && 'text-muted-foreground'
										)}
										role="combobox"
										{...props}
									>
										{client.find((f) => f.full_name === $formData.cliente)?.short_name ??
											'Selecione um cliente'}
										<ChevronsUpDown class="opacity-50" />
									</Popover.Trigger>
									<input hidden value={$formData.cliente} name={props.name} />
								{/snippet}
							</Form.Control>
							<Popover.Content class="h-[300px] w-[400px] p-0">
								<Command.Root>
									<Command.Input autofocus placeholder="Encontra cliente..." class="h-9" />
									<Command.Empty>Cliente não encontrado.</Command.Empty>
									<Command.Group>
										{#each client as clt}
											<Command.Item
												value={clt.full_name}
												onSelect={() => {
													$formData.cliente = clt.full_name;
												}}
											>
												{clt.short_name}
												<Check
													class={cn(
														'ml-auto',
														clt.full_name !== $formData.cliente && 'text-transparent'
													)}
												/>
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
						<Form.Description>Cliente a qual o atendimento foi direcionado.</Form.Description>
						<Form.FieldErrors class="font-bold" />
					</Form.Field>
					<Form.Field {form} name="dificuldade_os">
						<Form.Control>
							{#snippet children({ props })}
								<div class="space-y-0.5">
									<Form.Label>Dificuldade da OS</Form.Label>
									<Form.Description class="flex w-[400px] items-center justify-between text-sm">
										<Button
											size="sm"
											variant="ghost"
											onclick={() => {
												valueLevel = 0;
											}}
											class="text-sm font-bold text-green-600"
										>
											Simples
										</Button>
										<Button
											size="sm"
											variant="ghost"
											onclick={() => {
												valueLevel = 50;
											}}
											class="text-sm font-bold text-yellow-600"
										>
											Intermediaria
										</Button>
										<Button
											size="sm"
											variant="ghost"
											onclick={() => {
												valueLevel = 100;
											}}
											class="text-sm font-bold text-red-600"
										>
											Dificil
										</Button>
									</Form.Description>
								</div>
								<Slider
									class="w-[400px]"
									type="single"
									bind:value={valueLevel}
									max={100}
									step={50}
								/>
								<input type="hidden" value={valueLevel} name="dificuldade_os" />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<Form.Field {form} name="defeito" class="flex flex-col">
						<Popover.Root>
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Defeito</Form.Label>
									<Popover.Trigger
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-[400px] justify-between',
											!$formData.defeito && 'text-muted-foreground'
										)}
										role="combobox"
										{...props}
									>
										{formdate.def.find((f) => f.value === $formData.defeito)?.label ??
											'Selecione um cliente'}
										<ChevronsUpDown class="opacity-50" />
									</Popover.Trigger>
									<input hidden value={$formData.defeito} name={props.name} />
								{/snippet}
							</Form.Control>
							<Popover.Content class="h-[300px] w-[400px] p-0">
								<Command.Root>
									<Command.Input autofocus placeholder="Encontre o defeito..." class="h-9" />
									<Command.Empty>Defeito não encontrado.</Command.Empty>
									<Command.Group>
										{#each formdate.def as def}
											<Command.Item
												value={def.label}
												onSelect={() => {
													$formData.defeito = def.value;
												}}
											>
												{def.label}
												<Check
													class={cn(
														'ml-auto',
														def.value !== $formData.defeito && 'text-transparent'
													)}
												/>
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
						<Form.Description>Defeito encontrado no atendimento.</Form.Description>
						<Form.FieldErrors class="font-bold" />
					</Form.Field>
					<Form.Field {form} name="solucao" class="flex flex-col">
						<Popover.Root>
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Solução</Form.Label>
									<Popover.Trigger
										class={cn(
											buttonVariants({ variant: 'outline' }),
											'w-[400px] justify-between truncate ...',
											!$formData.solucao && 'text-muted-foreground '
										)}
										role="combobox"
										{...props}
									>
										{formdate.diags.find((f) => f.value === $formData.solucao)?.label ??
											'Selecione uma solução'}
										<ChevronsUpDown class="opacity-50" />
									</Popover.Trigger>
									<input hidden value={$formData.solucao} name={props.name} />
								{/snippet}
							</Form.Control>
							<Popover.Content class="h-[300px] w-[400px] p-0">
								<Command.Root>
									<Command.Input autofocus placeholder="Encontre a solução..." class="h-9" />
									<Command.Empty>Solução não encontrada.</Command.Empty>
									<Command.Group>
										{#each formdate.diags as diag}
											<Command.Item
												value={diag.label}
												onSelect={() => {
													$formData.solucao = diag.value;
												}}
											>
												{diag.label}
												<Check
													class={cn(
														'ml-auto',
														diag.value !== $formData.solucao && 'text-transparent'
													)}
												/>
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
						<Form.Description>Solução encontrada para resolver o atendimento.</Form.Description>
						<Form.FieldErrors class="font-bold" />
					</Form.Field>
				</div>
				<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
					<Form.Field {form} name="procedimento">
						<Form.Control>
							{#snippet children({ props })}
								<Form.Label>Procedimento / Observacoes</Form.Label>
								<Textarea
									{...props}
									placeholder="Descreva o procedimento realizado no atendimento"
									class="w-[400px] resize-none"
									bind:value={$formData.procedimento}
								/>
								<Form.Description
									>Descreva o procedimento realizado no atendimento.</Form.Description
								>
							{/snippet}
						</Form.Control>
						<Form.FieldErrors class="font-bold" />
					</Form.Field>
					<Form.Field
						{form}
						name="necessario_tecnico"
						class="flex w-[400px] flex-row items-center justify-between rounded-lg border p-2"
					>
						<Form.Control>
							{#snippet children({ props })}
								<div class="space-y-0.5">
									<Form.Label>Foi necessario visita</Form.Label>
									<Form.Description>Foi necessario enviar um tecnico ao local</Form.Description>
								</div>
								<Switch {...props} bind:checked={$formData.necessario_tecnico} />
							{/snippet}
						</Form.Control>
					</Form.Field>
				</div>
				<Form.Button
					type="submit"
					class="mt-2 w-full font-bold tracking-tighter"
					disabled={loading}
				>
					{#if loading}
						Criando... <LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
					{:else}
						Criar formulário
					{/if}
				</Form.Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
