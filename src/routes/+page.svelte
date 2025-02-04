<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
	import { Plus, Folder } from "lucide-svelte";
	import NewForm from "./NewForm.svelte";
	import type { PageData } from "./$types";
	import ModeToggle from "$lib/components/ModeToggle.svelte";

    let {data} : { data: PageData} = $props()
</script>
    
<main class="flex flex-col h-screen w-screen gap-4  p-8">
    <div class="flex items-center justify-end w-full">
        <ModeToggle />
    </div>
    <div class="flex justify-center items-center ">
        <Tabs.Root value="new_form" class="w-[400px]">
            <Tabs.List class="w-full justify-between">
             <Tabs.Trigger value="new_form" class=" gap-2 flex items-center justify-between">
                <Plus class="h-4 w-4"/>
                Novo formulario
            </Tabs.Trigger>
            <Tabs.Trigger value="password" class="gap-2 flex items-center justify-between">
                <Folder class="h-4 w-4"/>
                Lista de formularios
            </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="new_form">
             <NewForm {data}/>
            </Tabs.Content>
            <Tabs.Content value="password">Change your password here.</Tabs.Content>
           </Tabs.Root>
    </div>
</main>