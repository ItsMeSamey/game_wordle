import { Accessor, createSignal, JSX, Setter, Show } from "solid-js";
import { IconSettings } from "~/components/icons";
import { Popover, PopoverTrigger, PopoverContent } from "~/registry/ui/popover";
import { Slider, SliderFill, SliderLabel, SliderThumb, SliderTrack, SliderValueLabel } from "~/registry/ui/slider";

import ModeToggleGroup from "../components/mode_toggle_group";
import { WordLength } from "./words";

export function Settings({wordLength, setWordLength}: {wordLength: Accessor<WordLength>, setWordLength: Setter<WordLength>}): JSX.Element {
  const [open, setOpen] = createSignal(false)

  const emptydiv = <div class='w-full -mt-1 mb-1'/>

  const button = <div
    class='p-2 cursor-pointer hover:bg-muted/50 transition-all duration-300 rounded active:bg-muted-foreground/40 motion-rotate-in-45'
    onClick={() => setOpen(x => !x)}
  >
    <IconSettings class='size-5' />
  </div>

  return <Popover anchorRef={() => emptydiv as any} open={open()} onOpenChange={setOpen}>
    <PopoverTrigger>
      {emptydiv}
      <Show when={!open()}>
        <div onClick={e => e.stopPropagation()} class='motion-preset-slide-up-right'>
          {button}
        </div>
      </Show>
    </PopoverTrigger>
    <PopoverContent class='border-muted absolute overflow-visible motion-preset-slide-down-left space-y-4'>
      <Show when={open()}>
        <div class='flex flex-row items-end w-full h-full'>
          <ModeToggleGroup class='border border-muted rounded-lg' />
          <div class='w-full' />
          <div class='motion-preset-slide-down-left motion-delay-75'>
            {button}
          </div>
        </div>
      </Show>

      <Slider
        minValue={3}
        maxValue={20}
        value={[wordLength()]}
        getValueLabel={(params) => <strong class='mr-1'>{params.values}</strong> as any}
        onChange={([len]) => setWordLength(len as WordLength)}
        class="space-y-3 "
      >
        <div class="flex w-full justify-between">
          <SliderLabel>Money</SliderLabel>
          <SliderValueLabel />
        </div>
        <SliderTrack>
          <SliderFill />
          <SliderThumb />
        </SliderTrack>
      </Slider>
    </PopoverContent>
  </Popover>
}

