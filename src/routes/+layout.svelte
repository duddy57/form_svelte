<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	let { children } = $props();
</script>

<ModeWatcher />
<Toaster />
<svelte:head>
	<title>Inicio</title>
</svelte:head>
{@render children()}
