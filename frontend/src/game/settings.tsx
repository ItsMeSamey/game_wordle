import { PopoverContent } from "@kobalte/core/src/popover/popover-content.jsx";
import { JSX } from "solid-js";
import { IconSettings } from "~/components/icons";
import { Popover, PopoverTrigger } from "~/registry/ui/popover";


export function Settings(): JSX.Element {
  return <Popover>
    <PopoverTrigger>
      <IconSettings />
    </PopoverTrigger>
    <PopoverContent class='border-muted absolute overflow-visible motion-scale-in'>
      
    </PopoverContent>
  </Popover>

}
