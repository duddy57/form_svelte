<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import * as Popover from '$lib/components/ui/popover';
	import * as Command from '$lib/components/ui/command';
	import * as Accordion from '$lib/components/ui/accordion';

	import { Switch } from '$lib/components/ui/switch';

	import formdate from '$lib/constants';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { listSchema, type ListSchema } from '$lib/schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { Check, ChevronsUpDown, Table2, Zap } from 'lucide-svelte';
	import { tick, onMount } from 'svelte';
	import { useId } from 'bits-ui';

	let { data }: { data: { list: SuperValidated<Infer<ListSchema>> } } = $props();

	const form = superForm(data.list, {
		validators: zodClient(listSchema),
		taintedMessage: null,
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Formulario para empresa: ${f.data.cliente} criado com sucesso!`);
			} else {
				toast.error('Por favor, corrija os erros no formulário.');
			}
		}
	});

	onMount(() => {
        if (form?.redirect) {
            window.location.href = form.redirect;
        }
    });;

	const { form: formData, enhance } = form;

	let open = $state(false);

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
	const triggerId = useId();
</script>

<div class="flex h-screen flex-col rounded-md border border-muted p-2">
	<form method="POST" action="?/list" use:enhance class="space-y-4 p-2">
		<Form.Field {form} name="cliente" class="flex flex-col">
			<Popover.Root bind:open>
				<Form.Control id={triggerId}>
					{#snippet children({ props })}
						<Form.Label>Cliente</Form.Label>
						<Popover.Trigger
							class={cn(
								buttonVariants({ variant: 'outline' }),
								'w-[380px] justify-between',
								!$formData.cliente && 'text-muted-foreground'
							)}
							role="combobox"
							{...props}
						>
							{formdate.cliente.find((f) => f.value === $formData.cliente)?.label ??
								'Selecione um cliente'}
							<ChevronsUpDown class="opacity-50" />
						</Popover.Trigger>
						<input hidden value={$formData.cliente} name={props.name} />
					{/snippet}
				</Form.Control>
				<Popover.Content class="h-[300px] w-[400px] p-0">
					<Command.Root>
						<Command.Input autofocus placeholder="Encontra cliente..." class="h-9" />
						<Command.Empty>Cliente não encontrado.</Command.Empty>
						<Command.Group>
							{#each formdate.cliente as clt}
								<Command.Item
									value={clt.label}
									onSelect={() => {
										$formData.cliente = clt.value;
										closeAndFocusTrigger(triggerId);
									}}
								>
									{clt.label}
									<Check
										class={cn('ml-auto', clt.value !== $formData.cliente && 'text-transparent')}
									/>
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field
			{form}
			name="cvsresumido"
			class="flex w-[380px] flex-row items-center justify-between rounded-lg border p-4"
		>
			<Form.Control>
				{#snippet children({ props })}
					<div class="space-y-0.5">
						<Form.Label>Gera cvs resumido</Form.Label>
						<Form.Description>
							<Zap class="text-yellow-600" />
							Gere um cvs apenas com os campos relevantes
						</Form.Description>
					</div>
					<Switch {...props} bind:checked={$formData.cvsresumido} />
				{/snippet}
			</Form.Control>
		</Form.Field>
		<Form.Button class="w-[380px]" type="submit">Gera cvs</Form.Button>
	</form>

	<div>
		<h1>Ultimos cvs gerados</h1>
		<Accordion.Root type="single">
			<Accordion.Item value="item-1">
				<Accordion.Trigger>Is it accessible?</Accordion.Trigger>
				<Accordion.Content>Yes. It adheres to the WAI-ARIA design pattern.</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>
</div>


<script lang="ts">
  import * as Command from "$lib/components/ui/command";
  import * as Popover from "$lib/components/ui/popover";
  import * as Select from "$lib/components/ui/select";

 
  import { ChevronsUpDown, Zap, Check, Sheet, CalendarIcon } from "lucide-svelte";
  import type { DateRange } from "bits-ui";

  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { cn } from "$lib/utils.js";
  import formdate from '$lib/constants';

  import {
    CalendarDate,
    DateFormatter,
    type DateValue,
    getLocalTimeZone
  } from "@internationalized/date";
  import { RangeCalendar } from "$lib/components/ui/range-calendar";

  let open = $state(false);
  let value = $state("");
  let triggerRef = $state<HTMLButtonElement>(null!);

  const df = new DateFormatter("pt-BR", { dateStyle: "short" });

  let valueDate: DateRange = $state({
    start: new CalendarDate(2022, 1, 20),
    end: new CalendarDate(2022, 1, 20).add({ days: 20 })
  });

  let startValue: DateValue | undefined = $state(undefined);

  const selectedValue = $derived(
    formdate.cliente.find((f) => f.value === value)?.label || ""
  );

  function handleCreateCvsResumido(cliente: string, startDate: string, endDate: string) {
    try {
      if (!cliente || !startDate || !endDate) {
        console.warn("Cliente ou datas não foram selecionados corretamente.");
        return;
      }
      console.log(cliente,startDate, endDate)
      const url = `/download-csv-resumido?cliente=${encodeURIComponent(cliente)}&start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`;
      window.location.href = url;
    } catch (error) {
      console.error("Erro: ", error);
    }
  }

  // Extração das datas formatadas
  const formattedStartDate = $derived(
    valueDate?.start ? df.format(valueDate.start.toDate(getLocalTimeZone())) : ""
  );
  const formattedEndDate = $derived(
    valueDate?.end ? df.format(valueDate.end.toDate(getLocalTimeZone())) : ""
  );
</script>

<div>
  <Popover.Root bind:open>
    <Popover.Trigger bind:ref={triggerRef}>
      {#snippet child({ props })}
        <Button
          variant="outline"
          class="w-[200px] justify-between"
          {...props}
          role="combobox"
          aria-expanded={open}
        >
          {selectedValue || "Busca cliente..."}
          <ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      {/snippet}
    </Popover.Trigger>
    <Popover.Content class="w-[200px] p-0">
      <Command.Root>
        <Command.Input placeholder="Busca cliente..." />
        <Command.List>
          <Command.Empty>Cliente não encontrado.</Command.Empty>
          <Command.Group>
            {#each formdate.cliente as clt}
              <Command.Item
                value={clt.value}
                onSelect={() => {
                  value = clt.value;
                }}
              >
                <Check class={cn("mr-2 size-4", value !== clt.value && "text-transparent")} />
                {clt.label}
              </Command.Item>
            {/each}
          </Command.Group>
        </Command.List>
      </Command.Root>
    </Popover.Content>
  </Popover.Root>

  <Popover.Root>
    <Popover.Trigger class={cn(buttonVariants({ variant: "outline" }), !valueDate && "text-muted-foreground")}>
      <CalendarIcon class="mr-2 size-4" />
      {#if formattedStartDate}
        {#if formattedEndDate}
          {formattedStartDate} - {formattedEndDate}
        {:else}
          {formattedStartDate}
        {/if}
      {:else}
        Selecione uma data
      {/if}
    </Popover.Trigger>
    <Popover.Content class="w-auto p-0" align="start">
      <Select.Root
      type="single"
      bind:value={() => valueString,
      (v) => {
        if (!v) return;
        value = today(getLocalTimeZone()).add({ days: Number.parseInt(v) });
      }}
    >
      <Select.Trigger>
        {valueString}
      </Select.Trigger>
      <Select.Content>
        {#each items as item}
          <Select.Item value={`${item.value}`}>{item.label}</Select.Item>
        {/each}
      </Select.Content>
    </Select.Root>
    <div class="rounded-md border">
      <RangeCalendar
      bind:value
      onStartValueChange={(v) => {
        startValue = v;
      }}
      numberOfMonths={2}
    />
    </div>

    </Popover.Content>
  </Popover.Root>

  <div class="flex justify-between items-center">
    <Button
      class="flex items-center justify-between"
      size="sm"
      variant="outline"
      onclick={() => handleCreateCvsResumido(selectedValue, formattedStartDate, formattedEndDate)}
      type="submit"
    >
      <Zap class="text-yellow-600" />
      Csv resumido
    </Button>
    <Button
      class="flex items-center justify-between"
      size="sm"
      variant="outline"
      onclick={() => handleCreateCvsResumido(selectedValue, formattedStartDate, formattedEndDate)}
      type="submit"
    >
      <Sheet class="text-green-600" />
      Csv resumido
    </Button>
  </div>
</div>
