<script lang="ts">
	import type { PageServerData } from './$types';

	import ModeToggle from '$lib/components/ModeToggle.svelte';
	import CreateUser from './create-user.svelte';

	let { data }: { data: PageServerData } = $props();

	const user = data.user;
</script>

<div class="flex h-full w-full items-center justify-center p-6">
	{#if user.role === 'admin'}
		<CreateUser {data} />
	{/if}
	<ModeToggle />
</div>
