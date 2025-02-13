<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import { Input } from '$lib/components/ui/input';
	import { Calendar } from '$lib/components/ui/calendar';
	import { Switch } from '$lib/components/ui/switch';
	import { Slider } from '$lib/components/ui/slider';
	import { Textarea } from '$lib/components/ui/textarea';

	import { toast } from 'svelte-sonner';

	import { cvsSchema, type CvsSchema } from '$lib/schema';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-svelte';
	import formdate from '$lib/constants';

	let { data }: { data: { form: SuperValidated<Infer<CvsSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(cvsSchema),
		taintedMessage: null,
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Formulario para empresa: ${f.data.cliente} criado com sucesso!`);
			} else {
				toast.error('Por favor, corrija os erros no formulário.');
			}
		}
	});

	const { form: formData, enhance } = form;

	const df = new DateFormatter('pt-BR', {
		dateStyle: 'short'
	});

	let valueCalendar = $state<DateValue | undefined>();

	$effect(() => {
		valueCalendar = $formData.form_date ? parseDate($formData.form_date) : undefined;
	});

	let placeholder = $state<DateValue>(today(getLocalTimeZone()));

	let valueLevel = $state(50);
</script>

<div>
	<form method="POST" action="?/create" class="w-full space-y-8 py-8" use:enhance>
		<Form.Field {form} name="form_date" class="flex flex-col">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Data</Form.Label>
					<Popover.Root>
						<Popover.Trigger
							{...props}
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'w-[400px] justify-start pl-4 text-left font-normal',
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
					<Form.FieldErrors />
					<input hidden value={$formData.form_date} name={props.name} />
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Field {form} name="tecnico_forms" class="flex flex-col">
			<Popover.Root>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Tecnico responsavel pelo formulario</Form.Label>
						<Popover.Trigger
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'w-[400px] justify-between',
								!$formData.tecnico_forms && 'text-muted-foreground'
							)}
							role="combobox"
							{...props}
						>
							{formdate.tec_email.find((f) => f.value === $formData.tecnico_forms)?.label ??
								'Selecione um tecnico'}
							<ChevronsUpDown class="opacity-50" />
						</Popover.Trigger>
						<input hidden value={$formData.tecnico_forms} name={props.name} />
					{/snippet}
				</Form.Control>
				<Popover.Content class="w-[400px] p-0">
					<Command.Root>
						<Command.Input autofocus placeholder="Encontra tecnico..." class="h-9" />
						<Command.Empty>Tecnico não encontrado.</Command.Empty>
						<Command.Group>
							{#each formdate.tec_email as tec}
								<Command.Item
									value={tec.label}
									onSelect={() => {
										$formData.tecnico_forms = tec.value;
									}}
								>
									{tec.label}
									<Check
										class={cn(
											'ml-auto',
											tec.value !== $formData.tecnico_forms && 'text-transparent'
										)}
									/>
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
			<Form.Description>Tecnico responsavel pelo atendimento.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="tecnico_os" class="flex flex-col">
			<Popover.Root>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Tecnico responsavel pelo formulario</Form.Label>
						<Popover.Trigger
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'w-[400px] justify-between',
								!$formData.tecnico_os && 'text-muted-foreground'
							)}
							role="combobox"
							{...props}
						>
							{formdate.tec_email.find((f) => f.value === $formData.tecnico_os)?.label ??
								'Selecione um tecnico'}
							<ChevronsUpDown class="opacity-50" />
						</Popover.Trigger>
						<input hidden value={$formData.tecnico_os} name={props.name} />
					{/snippet}
				</Form.Control>
				<Popover.Content class="w-[400px] p-0">
					<Command.Root>
						<Command.Input autofocus placeholder="Encontra tecnico..." class="h-9" />
						<Command.Empty>Tecnico não encontrado.</Command.Empty>
						<Command.Group>
							{#each formdate.tec_email as tec}
								<Command.Item
									value={tec.label}
									onSelect={() => {
										$formData.tecnico_os = tec.value;
									}}
								>
									{tec.label}
									<Check
										class={cn('ml-auto', tec.value !== $formData.tecnico_os && 'text-transparent')}
									/>
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
			<Form.Description>Tecnico responsavel pelo atendimento.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="cliente" class="flex flex-col">
			<Popover.Root>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Cliente</Form.Label>
						<Popover.Trigger
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'w-[400px] justify-between',
								!$formData.cliente && 'text-muted-foreground'
							)}
							role="combobox"
							{...props}
						>
							{formdate.cliente.find((f) => f.value === $formData.cliente)?.label ??
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
							{#each formdate.cliente as clt}
								<Command.Item
									value={clt.label}
									onSelect={() => {
										$formData.cliente = clt.value;
									}}
								>
									{clt.label}
									<Check
										class={cn('ml-auto', clt.value !== $formData.cliente && 'text-transparent')}
									/>
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
			<Form.Description>Cliente a qual o atendimento foi direcionado.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="solicitante">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Solicitante</Form.Label>
					<Input {...props} bind:value={$formData.solicitante} />
				{/snippet}
			</Form.Control>
			<Form.Description>Responsavel por solicita o atendimento.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field
			{form}
			name="necessario_tecnico"
			class="flex flex-row items-center justify-between rounded-lg border p-4"
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
		<Form.Field {form} name="dificuldade_os">
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-0.5">
						<Form.Label>Dificuldade da OS</Form.Label>
						<Form.Description class="flex items-center justify-between text-sm">
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
					<Slider type="single" bind:value={valueLevel} max={100} step={50} />
					<input type="hidden" value={valueLevel} name="dificuldade_os" />
				{/snippet}
			</Form.Control>
		</Form.Field>
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
										class={cn('ml-auto', def.value !== $formData.defeito && 'text-transparent')}
									/>
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
			<Form.Description>Defeito encontrado no atendimento.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="solucao" class="flex flex-col">
			<Popover.Root>
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Solução</Form.Label>
						<Popover.Trigger
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'w-[400px] justify-between truncate',
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
										class={cn('ml-auto', diag.value !== $formData.solucao && 'text-transparent')}
									/>
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
			<Form.Description>Solução encontrada para resolver o atendimento.</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="procedimento">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Procedimento / Observacoes</Form.Label>
					<Textarea
						{...props}
						placeholder="Descreva o procedimento realizado no atendimento"
						class="resize-none"
						bind:value={$formData.procedimento}
					/>
					<Form.Description>Descreva o procedimento realizado no atendimento.</Form.Description>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Button type="submit" class="w-full">Criar formulario</Form.Button>
	</form>
</div>
