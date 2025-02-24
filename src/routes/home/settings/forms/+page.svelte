<script lang="ts">
	import SuperDebug, { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { clientSchema, type ClientSchema } from '$lib/schema';

	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form';

	import { Input } from '$lib/components/ui/input';

	let { data }: { data: { form: SuperValidated<Infer<ClientSchema>> } } = $props();

	let loading = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(clientSchema),
		onUpdated: ({ form: f }) => {
			loading = true;
			if (f.valid) {
				toast.success(
					`Cliente: ${f.data.short_name} criado com sucesso!, voltando para pagina inicial`
				);
				loading = false;
				setTimeout(() => {
					window.location.href = "/home"
				}, 3000);
			} else {
				toast.error('Por favor, corrija os erros no formulário.');
				loading = false;
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex h-full w-full items-center justify-center p-8">
	<Card.Root class="w-[500px] bg-secondary/60">
		<Card.Header>
			<Card.Title>Cadastro de cliente</Card.Title>
		</Card.Header>
		<Card.Content class=" flex h-full w-full items-center justify-center">
			<form action="?/add_client" method="POST" class="w-2/3 space-y-6" use:enhance>
				<Form.Field {form} name="full_name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Nome da empresa <span class="text-red-500">*</span></Form.Label>
							<Input {...props} bind:value={$formData.full_name} />
						{/snippet}
					</Form.Control>
					<Form.Description>Nome completo da empresa.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="short_name">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Nome curto <span class="text-red-500">*</span></Form.Label>
							<Input {...props} bind:value={$formData.short_name} />
						{/snippet}
					</Form.Control>
					<Form.Description>A forma que a empresa é chamada.</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button class="w-full" disabled={loading}>Criar</Form.Button>
			</form>
		</Card.Content>
	</Card.Root>
</div>
