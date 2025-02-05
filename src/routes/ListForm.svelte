<script lang="ts">
    import * as Accordion from "$lib/components/ui/accordion/index.js";    let {data} : { data: {list: {cliente: string}[]}} = $props()
	import { Button } from "$lib/components/ui/button";
	import formdate from "$lib/constants";
    let list = data.list 

</script>

<div class="flex flex-col  h-screen p-2 border border-muted rounded-md">
    {#each formdate.cliente as item}
    <Accordion.Root type="single">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>{item.label}</Accordion.Trigger>
          <Accordion.Content>
            <Button>
                Gerar cvs resumido
            </Button>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    {/each}
</div>