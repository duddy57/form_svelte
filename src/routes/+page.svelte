<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
	import { Plus, Folder } from "lucide-svelte";
	import NewForm from "./NewForm.svelte";
	import type { PageData } from "./$types";
	import ModeToggle from "$lib/components/ModeToggle.svelte";
	import ListForm from "./ListForm.svelte";

    let {data} : { data: PageData} = $props()
</script>
    
<main class="flex flex-col h-screen w-screen gap-4  p-8">
    <div class="flex items-center justify-end w-full">
        <ModeToggle />
    </div>
    <div class="w-full flex items-center justify-center">
        <div class="flex pt-8 mb-24 rounded-lg justify-center items-center bg-secondary/60  w-[500px] shadow-xl shadow-cyan-500/50">
            <Tabs.Root value="new_form" class="w-[400px]">
                <Tabs.List class="w-full justify-between">
                    <Tabs.Trigger value="new_form" class="gap-4 flex items-center w-full justify-center">
                        <Plus class="h-4 w-4"/>
                        Novo formulario
                    </Tabs.Trigger>
                    <Tabs.Trigger value="password" class="gap-4 flex items-center w-full justify-center">
                        <Folder class="h-4 w-4"/>
                        Listar formularios
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="new_form">
                 <NewForm {data}/>
                </Tabs.Content>
                <Tabs.Content value="password">
                    <ListForm/>
                </Tabs.Content>
               </Tabs.Root>
        </div>
    </div>   
</main>