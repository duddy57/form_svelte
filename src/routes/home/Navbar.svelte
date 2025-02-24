<script lang="ts">
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	import { Separator } from '$lib/components/ui/separator';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Home, Settings, Monitor, CircleUser } from 'lucide-svelte';

	let { data } = $props();
</script>

<div class="sticky ml-4 flex h-screen w-16 items-center">
	<div
		class="mx-4 flex h-auto w-full flex-col items-center justify-around space-y-2 rounded-lg bg-black bg-opacity-50 shadow-lg backdrop-blur-lg"
	>
		<div class="flex h-full w-full flex-col items-center justify-center space-y-4">
			<Tooltip.Provider delayDuration={100}>
				<Tooltip.Root disableHoverableContent>
					<Tooltip.Trigger
						onclick={() => {
							goto('/home');
						}}
						class={buttonVariants({ variant: 'ghost', size: 'icon' })}
					>
						<Home class="h-6 w-6" />
					</Tooltip.Trigger>
					<Tooltip.Content side="right">Inicio</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
			<Tooltip.Provider delayDuration={100}>
				<Tooltip.Root disableHoverableContent>
					<Tooltip.Trigger
						onclick={() => goto('/home/devices')}
						class={buttonVariants({ variant: 'ghost', size: 'icon' })}
					>
						<Monitor class="h-6 w-6" />
					</Tooltip.Trigger>
					<Tooltip.Content side="right">
						<p>Dispositivos</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
			<Tooltip.Provider delayDuration={100}>
				<Tooltip.Root disableHoverableContent>
					<Tooltip.Trigger
						onclick={() => goto('/home/settings')}
						class={buttonVariants({ variant: 'ghost', size: 'icon' })}
					>
						<Settings class="h-6 w-6" />
					</Tooltip.Trigger>
					<Tooltip.Content side="right">Configurações</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</div>
		<Separator class="w-[60%]" />
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Tooltip.Provider delayDuration={100}>
					<Tooltip.Root disableHoverableContent>
						<Tooltip.Trigger class={buttonVariants({ variant: 'ghost', size: 'icon' })}>
							<CircleUser class="h-6 w-6" />
						</Tooltip.Trigger>
						<Tooltip.Content side="right">Perfil</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content side="right" sideOffset={4}>
				<DropdownMenu.Group>
					<DropdownMenu.GroupHeading>
						<div>
							<div class="flex items-center justify-between">
								<span>@{data.user.name}</span>
								<p class="font-bold">{data.user.ramal}</p>
							</div>
							<p class="tracking-tight">
								{data.user.email}
							</p>
						</div>
					</DropdownMenu.GroupHeading>
					<DropdownMenu.Separator />
					<DropdownMenu.Item class="font-bold">Equipe</DropdownMenu.Item>
					<DropdownMenu.Item class="font-bold" onclick={() => goto('/home/settings/profile')}>
						Preferencias
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<form method="post" action="?/logout" use:enhance>
							<button class="font-bold">Sair</button>
						</form>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
