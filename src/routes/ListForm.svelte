<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';

	import { Switch } from '$lib/components/ui/switch';

	import formdate from '$lib/constants';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { listSchema, type ListSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { Check, ChevronsUpDown, Table2, Zap } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { useId } from 'bits-ui';

	let { data }: { data: { list: SuperValidated<Infer<ListSchema>> } } = $props();

	const form = superForm(data.list, {
		validators: zodClient(listSchema),
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

	let open = $state(false);

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
	const triggerId = useId();
</script>

<div class="flex h-screen flex-col rounded-md border border-muted p-2">
	<form method="POST" action="?/list" use:enhance class="space-y-4 p-2">
		<Form.Field {form} name="cliente" class="flex flex-col">
			<Popover.Root bind:open>
				<Form.Control id={triggerId}>
					{#snippet children({ props })}
						<Form.Label>Cliente</Form.Label>
						<Popover.Trigger
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'w-[380px] justify-between',
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
										closeAndFocusTrigger(triggerId);
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
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field
			{form}
			name="cvsresumido"
			class="flex flex-row items-center justify-between rounded-lg border p-4 w-[380px]"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-0.5">
						<Form.Label>Gera cvs resumido</Form.Label>
						<Form.Description>
              <Zap class="text-yellow-600" />
              Gere um cvs apenas com os campos relevantes
            </Form.Description>
					</div>
					<Switch {...props} bind:checked={$formData.cvsresumido} />
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Button class="w-[380px]" type="submit">Gera cvs</Form.Button>
	</form>
</div>
