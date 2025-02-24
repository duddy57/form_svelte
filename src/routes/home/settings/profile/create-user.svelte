<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input/index.js';

	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { registeSchema, type RegisteSchema } from '$lib/schema';
	import formdate from '$lib/constants';
	import { toast } from 'svelte-sonner';

	import { Plus } from 'lucide-svelte';

	let { data }: { data: { form: SuperValidated<Infer<RegisteSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(registeSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Usuario ${JSON.stringify(f.data.name, null, 2)}`);
			} else {
				toast.error('Por favor revise os campos.');
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<Dialog.Root>
	<Dialog.Trigger class="flex items-center">
		Criar usuario
		<Plus />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Adicionar usuario</Dialog.Title>
		</Dialog.Header>
		<form action="?/add_user" method="POST" class="w-full space-y-6" use:enhance>
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Nome</Form.Label>
						<Input {...props} bind:value={$formData.name} />
					{/snippet}
				</Form.Control>
				<Form.Description>Nome do usuario.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="email">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Email</Form.Label>
						<Input type="email" {...props} bind:value={$formData.email} />
					{/snippet}
				</Form.Control>
				<Form.Description>Email do usuario.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="ramal">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Ramal</Form.Label>
						<Input type="number" {...props} bind:value={$formData.ramal} />
					{/snippet}
				</Form.Control>
				<Form.Description>Ramal do usuario.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Senha</Form.Label>
						<Input {...props} bind:value={$formData.password} />
					{/snippet}
				</Form.Control>
				<Form.Description>Senha do usuario.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="role">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Cargo</Form.Label>
						<Select.Root type="single" bind:value={$formData.role} name={props.name}>
							<Select.Trigger {...props}>
								{$formData.role ? $formData.role : 'Selecione o cargo'}
							</Select.Trigger>
							<Select.Content>
								{#each formdate.role as role}
									<Select.Item value={role.value} label={role.label} />
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.Description>Cargo do usuario.</Form.Description>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Button class="w-full font-bold tracking-tighter">Criar</Form.Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
