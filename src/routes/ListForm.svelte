<script lang="ts">
  import { CalendarIcon, Check, ChevronsUpDown, Zap, Sheet } from "lucide-svelte";
  import type { DateRange } from "bits-ui";
  import {
    CalendarDate,
    DateFormatter,
    type DateValue,
    getLocalTimeZone
  } from "@internationalized/date";
  import { toast } from 'svelte-sonner';
  import { cn } from "$lib/utils.js";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Label } from "$lib/components/ui/label"
  import { RangeCalendar } from "$lib/components/ui/range-calendar";
  import * as Popover from "$lib/components/ui/popover";
  import * as Command from "$lib/components/ui/command";
  import formdate from "$lib/constants";
  import { tick } from "svelte";

  const df = new DateFormatter("pt-BR", { dateStyle: "medium" });

  const dataAtual = new Date()
  const year = dataAtual.getFullYear()
  const month = dataAtual.getMonth()
  const day = dataAtual.getDate()

  let value: DateRange = $state({
    start: new CalendarDate(year, month, day),
    end: new CalendarDate(year, month, day).add({ days: -30 })
  });

  let startValue: DateValue | undefined = $state(undefined);
  let open = $state(false);
  let value_cliente = $state("");
  let triggerRef = $state<HTMLButtonElement>(null!);

  const selectedValue = $derived(
    formdate.cliente.find((f) => f.value === value_cliente)?.label || ""
  );

  const client = $derived(
    formdate.cliente.find((f) => f.value === value_cliente)?.value || ""
  )

  function closeAndFocusTrigger() {
    open = false;
    tick().then(() => {
      triggerRef.focus();
    });
  }


  function handleCreateCvs(cliente: string, date: DateRange | undefined, type: "completo" | "resumido") {
    try {
      if (!cliente || !date || !date.start || !date.end || !type) {
        toast.error(`Cliente, tipo ou data não foram selecionados corretamente.`);
        console.warn("Cliente, tipo ou data não foram selecionados corretamente.");
        return;
      }

      toast.success(`Csv para empresa: ${cliente} criado com sucesso!`);

      const startDate = date.start.toDate(getLocalTimeZone()).toISOString().split("T")[0];
      const endDate = date.end.toDate(getLocalTimeZone()).toISOString().split("T")[0];

      
      let url = `/download-csv?cliente=${encodeURIComponent(cliente)}&data_inicio=${startDate}&data_fim=${endDate}&tipo=${type}`;

      console.log(cliente, date, type);
      window.location.href = url;
    } catch (error) {
      console.error("Erro: ", error);
    }
  }
</script>

<div class="w-full space-y-8 py-8">
  <div>
    <Label>Cliente</Label>
    <Popover.Root bind:open>
    <Popover.Trigger bind:ref={triggerRef} name="cliente_definition">
      {#snippet child({ props })}
        <Button
          variant="outline"
          class="w-[400px] justify-between"
          {...props}
          role="combobox"
          aria-expanded={open}
        >
          {selectedValue || "Busca cliente..."}
          <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-[400px] p-0">
      <Command.Root>
        <Command.Input placeholder="Busca cliente..." />
        <Command.List>
          <Command.Empty>Cliente não encontrado.</Command.Empty>
          <Command.Group>
            {#each formdate.cliente as clt}
              <Command.Item
                value={clt.value}
                onSelect={() => {
                  value_cliente = clt.value;
                  closeAndFocusTrigger();
                }}
              >
                <Check class={cn("mr-2 size-4", value_cliente !== clt.value && "text-transparent")} />
                {clt.label}
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
    </Popover.Root>
  </div>

 <div class="flex flex-col space-y-1">
  <Label>Data</Label>
  <Popover.Root>
    <Popover.Trigger class={cn(buttonVariants({ variant: "outline" }), !value && "text-muted-foreground")}>
      <CalendarIcon class="mr-2 size-4" />
      {#if value && value.start}
        {#if value.end}
          {df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(value.end.toDate(getLocalTimeZone()))}
        {:else}
          {df.format(value.start.toDate(getLocalTimeZone()))}
        {/if}
      {:else if startValue}
        {df.format(startValue.toDate(getLocalTimeZone()))}
      {:else}
        Selecione a data
      {/if}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <RangeCalendar
        bind:value
        onStartValueChange={(v) => {
          startValue = v
        }}
        numberOfMonths={2}
      />
    </Popover.Content>
  </Popover.Root>
 </div>
  <div class="flex gap-4 justify-between items-center mb-4">
    <Button
      class="flex w-full items-center justify-around"
      variant="outline"
      onclick={() => 
        handleCreateCvs(client, value, "resumido")}
      type="submit"
    >
      <Zap class="text-yellow-600" />
      Csv resumido
    </Button>
    <Button
      class="flex w-full items-center justify-around"
      variant="outline"
      onclick={() => 
        handleCreateCvs(client, value, "completo")}
      type="submit"
    >
      <Sheet class="text-green-600" />
      Csv completo
    </Button>
  </div>
</div>
