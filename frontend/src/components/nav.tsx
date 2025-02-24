import { ComponentProps, createSignal, JSX, onCleanup, Show, splitProps } from "solid-js"
import { IconClock, IconCopy, IconExternalLink, IconHome, IconLoader, IconTrash } from "~/components/icons"
import { Avatar, AvatarImage, AvatarFallback } from "~/registry/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "~/registry/ui/popover"
import { cn } from "~/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "~/registry/ui/dialog"
import { Button } from "~/registry/ui/button"
import { showToast } from "~/registry/ui/toast"

import { logout, p, Page, setP } from "../utils/navigation"
import { LocalstorageStore } from "../utils/store"
import { leaveTeam, myInfo, Team, User } from "../utils/api"
import { showError } from "../utils/toast"
import { Timer } from "../utils/timer"
import { PAGES } from "../pages/level_selection"
import { getGlobalWs } from "../utils/networking"

export enum TickDownType {
  None = -1,
  My = 0,
  Other = 1,
  Both = 2
}

export interface TimeLeftType {
  start_ms: number,
  remaining_my: number,
  remaining_other: number,
  tickdown: TickDownType,
}

const [timeLeft, _setTimeLeft] = createSignal<TimeLeftType>({
  remaining_my: Infinity,
  remaining_other: Infinity,
  start_ms: 0,
  tickdown: TickDownType.None
})
const _timer = new Timer()
export function setTimeLeft(timeLeft: TimeLeftType) {
  _setTimeLeft(timeLeft)
  _timer.reset()
}
export function setTickdownType(tickdown: TickDownType) {
  _setTimeLeft(old => {
    return { ...old, tickdown }
  })
}

function formatMs(time_ms: number): string {
  time_ms = Math.max(0, time_ms - 5)
  const seconds = time_ms % 60;
  return `${Math.floor(time_ms / 60)}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const userInfo = new LocalstorageStore<User>('user')
type IconProps = ComponentProps<"svg">
const Icon = (props: IconProps) => {
  const [, rest] = splitProps(props, ["class"])
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={cn("size-4", props.class)}
      {...rest}
    />
  )
}

function IconLogout(props: IconProps) {
  return <Icon {...props}>
    <path stroke="none" d="M0 0h24v24H0z"/>
    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
    <path d="M7 12h14l-3 -3m0 6l3 -3" />
  </Icon>
}

export default function Nav(): JSX.Element {
  const [user, setUser] = createSignal<User>(userInfo.get() ?? {
    name: 'Loading...',
    mail: 'Loading...',
    picture: '',
  })
  const [team, setTeam] = createSignal<Team|undefined>(undefined)
  if (user().picture === '') updateUser()
  async function updateUser() {
    const info = await myInfo()
    setTeam(info.team)
    setUser(info.team.user1.mail === info.mail? info.team.user1 : info.team.user2!)
  }

  function UserAvatar() {
    return <Avatar>
      <AvatarImage src={user().picture}/>
      <AvatarFallback>{user().picture === ''? <IconLoader class='motion-preset-spin motion-duration-2000' /> : user().name[0]}</AvatarFallback>
    </Avatar>
  }

  let times = 0

  const interval = setInterval(() => {
    const dt = _timer.getReset()
    _setTimeLeft(old => {
      switch (old.tickdown) {
        case TickDownType.None: var retval = old; break
        case TickDownType.My: var retval = { ...old, remaining_my: old.remaining_my - dt }; break
        case TickDownType.Other: var retval = { ...old, remaining_other: old.remaining_other - dt }; break
        case TickDownType.Both: var retval = { ...old, remaining_my: old.remaining_my - dt, remaining_other: old.remaining_other - dt }; break
      }
      if (retval.remaining_my <= 0 || retval.remaining_other <= 0) {
        times += 1
      } else {
        times = 0
      }

      if ((times&31) === 31) getGlobalWs()?.send('!s')
      if ((times&63) === 63) setP(Page.LevelSelection)

      return retval
    })
  }, 500)

  //const interval2 = setInterval(() => {
  //  if (getGlobalWs()?.ws?.readyState === WebSocket.OPEN) {
  //    getGlobalWs()?.send('!s')
  //  }
  //}, 10000)

  onCleanup(() => {
    clearInterval(interval)
    //clearInterval(interval2)
  })

  return <nav>
    <div
      id='__home_button'
      class='z-50 justify-end top-0 left-0 absolute mt-2 ml-2 p-[.625rem] cursor-pointer hover:bg-muted/75 rounded transition-all active:duration-0 duration-200 active:bg-foreground group'
      onclick={() => setP(Page.LevelSelection)}
    >
      <IconHome class='group-active:stroke-background transition-all group-active:duration-0 duration-300' />
    </div>
    <div class='z-50 justify-end top-0 right-0 absolute mt-2 mr-2 overflow-visible flex flex-row'>
      <Show when={PAGES.includes(p())}>
        <div class="w-full flex flex-row mr-1 px-4 rounded-full transition-all hover:bg-muted/50 [&:has(.child-first:hover)]:bg-error/50 [&:has(.child-last:hover)]:bg-success/65">
          <span class='child-first py-auto pr-2 text-error-foreground content-center'>{formatMs(Math.trunc(timeLeft().remaining_other / 1000))}</span>
          <IconClock class='size-6 my-auto' />
          <span class='child-last py-auto pl-2 text-success-foreground content-center'>{formatMs(Math.trunc(timeLeft().remaining_my / 1000))}</span>
        </div>
      </Show>
      <Popover>
        <PopoverTrigger>
          <UserAvatar />
        </PopoverTrigger>
        <PopoverContent class='border-muted absolute overflow-visible'>
          <div class='space-y-2'>
            <div class='flex items-center gap-3'>
              <UserAvatar />
              <div>
                <p class='font-medium text-md'>{user().name}</p>
                <p class='text-muted-foreground text-sm'>{user().mail}</p>
              </div>
            </div>
            <div class='mx-auto text-lg text-center' >
              Team  <strong><i>{team()?.name}</i></strong>
            </div>
            <div class='w-full p-auto flex' >
              <span class='flex flex-col whitespace-nowrap my-auto mr-auto'>{team()?.money.toFixed(2)} 💰</span>
              <Dialog>
                <DialogTrigger class='outline-none outline-transparent'>
                  <IconTrash class='size-8 p-1 rounded hover transition-all will-change-transform scale-110 cursor-pointer hover:bg-red-500/75 mr-1' />
                </DialogTrigger>
                <DialogContent class='outline-transparent border-muted'>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    <span class='text-success-foreground'>
                      This gives you option to <strong>join another team</strong> by <strong><em>re-signup</em></strong> with same google account.
                    </span>
                  </DialogDescription>
                  <DialogFooter>
                    <Button
                      type="submit"
                      class='bg-error text-error-foreground hover:bg-error-foreground hover:text-error transition-colors'
                      onclick={async() => {
                        try {
                          leaveTeam()
                          logout()
                        } catch (e) {
                          showError(e as Error)
                        }
                      }}
                    >
                      Delete It!
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <IconLogout class='size-8 p-1 rounded hover transition-all will-change-transform scale-110 cursor-pointer hover:bg-yellow-500/50 ml-1' onclick={logout}/>
            </div>
            <div class='w-full p-auto flex select-text group'
              onclick={() => {
                const id = team()?.id
                if (id === undefined) return
                navigator.clipboard.writeText(id)
                showToast({
                  title: 'Team ID copied to clipboard',
                  description: 'You can share this with your teammate to let them join your team',
                  variant: 'success',
                  duration: 3000
                })
              }}
            >
              <span class='flex flex-col whitespace-nowrap my-auto mr-auto'>{team()?.id}</span>
              <IconCopy
                class={'size-8 p-1 transition-all cursor-pointer bg-muted/25 stroke-foreground group-hover:bg-foreground/100 rounded group-hover:stroke-background ml-1 ' + (
                  team()?.id === undefined? '': 'active:transition-none active:bg-success-foreground'
                )}
              />
            </div>
            <div class='flex flex-row cursor-pointer border-none group' onclick={() => setP(Page.Leaderboard)}>
              <span class='my-auto mr-auto'>Leaderboard</span>
              <IconExternalLink class='size-8 my-auto p-1 rounded group-hover:stroke-background transition-all group-hover:bg-foreground stroke-foreground bg-background' />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  </nav>
}

