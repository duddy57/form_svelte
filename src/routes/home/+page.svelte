<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';

	import type { PageServerData } from './$types';

	import CreateForm from './create-form.svelte';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="h-full w-full p-6">
	<div>
		<h1 class="text-3xl font-bold tracking-tighter shadow-lg">Bem vindo, {data.user.name}!</h1>
	</div>
	<Separator class="w-full" />
	<div>
		<CreateForm {data} />
	</div>
</div>
