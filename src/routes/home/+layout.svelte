<script lang="ts">
	import Navbar from './Navbar.svelte';
	import { page } from '$app/stores';
	import '../../app.css';
	let { children } = $props();

	const data = $page.data;
</script>

<svelte:head>
	<title>Inicio</title>
</svelte:head>

<div class="flex">
	<div>
		<Navbar {data} />
	</div>
	{@render children()}
</div>
