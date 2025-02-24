<script lang="ts">
	import { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Card from '$lib/components/ui/card';

	import { goto } from "$app/navigation";

	import { Input } from '$lib/components/ui/input/index.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { loginSchema, type LoginSchema } from '$lib/schema';
	import { toast } from 'svelte-sonner';

	let { data }: { data: { form: SuperValidated<Infer<LoginSchema>> } } = $props();

	const form = superForm(data.form, {
		validators: zodClient(loginSchema),
		onUpdated: ({ form: f }) => {
			console.log(f);
			if (f.valid) {
				toast.success(`Bem vindo ${JSON.stringify(f.data.email, null, 2)}`);
				goto('/home')
			} else {
				toast.error('Ops! algo deu errado, tente novamente.');
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex h-full w-full items-center justify-center">
	<Card.Root>
		<Card.Header>
			<Card.Title>Seja bem vindo</Card.Title>
			<Card.Description>A senha e email que o administrador te passou</Card.Description>
		</Card.Header>
		<Card.Content class="w-full">
			<form action="?/login" method="POST" class="w-full space-y-6" use:enhance>
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input class="w-full" {...props} bind:value={$formData.email} />
						{/snippet}
					</Form.Control>
					<Form.Description>Email utilizada para login</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Senha</Form.Label>
							<Input class="w-full" {...props} bind:value={$formData.password} />
						{/snippet}
					</Form.Control>
					<Form.Description>Senha utilizada para login</Form.Description>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button type="submit" class="w-full font-bold tracking-tighter">Entrar</Form.Button>
			</form>
		</Card.Content>
		<Card.Footer>
			<p>Não conseguiu entrar?. Solicite acesso ao administrador</p>
		</Card.Footer>
	</Card.Root>
</div>
