<script lang="ts">
	import type { PageData } from './$types';
	import LoginForm from './LoginForm.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="h-screen w-screen">
	<LoginForm {data} />
</div>
