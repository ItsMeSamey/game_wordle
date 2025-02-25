import { createEffect, createSignal, For, JSX, onCleanup, onMount, Show } from 'solid-js'
import { createMutable, createStore, SetStoreFunction, unwrap } from 'solid-js/store'
import { showToast } from '~/registry/ui/toast'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from '~/registry/ui/drawer'

import { showError, showServerError } from '../utils/toast'
import LoadingScreen from '../pages/loading_screen'
import { addAllWords, addWords, calcDiff, getGuessWord, getRandomWord, setDone } from './words'
import { LocalstorageStore } from '../utils/store'
import { Settings, SettingsHardProps, SettingsSoftProps } from './settings'

// Green, Yellow, Red respectively
type WordleStringState = 'g' | 'y' | 'r'

// All possible keys for the keyboard
type Keys = 'Q' | 'W' | 'E' | 'R' | 'T' | 'Y' | 'U' | 'I' | 'O' | 'P' | 'A' | 'S' | 'D' | 'F' | 'G' | 'H' | 'J' | 'K' | 'L' | 'Z' | 'X' | 'C' | 'V' | 'B' | 'N' | 'M' | 'BACKSPACE'

interface KeyState {
  state: WordleStringState | undefined
  pressed: boolean
}

interface KeyboardState extends Record<Keys, KeyState> {}

const defaultKeyboardState: KeyboardState = {
  BACKSPACE: {state: undefined, pressed: false}
} as any

const ABCD = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ⏎⌫'
for (const key of ABCD) {
  defaultKeyboardState[key as Keys] = {state: undefined, pressed: false}
}

function Keyboard({state: KeyboardState}: {state: KeyboardState}) {
  return <div class='flex flex-col select-none'>
    {['QWERTYUIOP', 'ASDFGHJKL', '⏎ZXCVBNM⌫'].map((text, row) => (
      <div
        class='flex flex-row mx-auto'
        style={{
        'padding-left': `${row%2}rem`,
      }}>
        {text.split('').map(char => {
          const key = char === '⏎' ? 'Enter' : char === '⌫' ? 'Backspace' : char
          const evObj = {key: key, code: key, location: 0, ctrlKey: false, shiftKey: false, altKey: false, metaKey: false, repeat: false}
          return <div
            onmousedown={() => document.dispatchEvent(new KeyboardEvent('keydown', evObj))}
            onmouseup={() => document.dispatchEvent(new KeyboardEvent('keyup', evObj))}
            onmouseleave={() => document.dispatchEvent(new KeyboardEvent('keyup', evObj))}
            class={'text-center content-center size-10 rounded transition-all will-change-transform ' + (
              KeyboardState[char as Keys].state === 'g' ? 'bg-green-600/60':
              KeyboardState[char as Keys].state === 'y' ? 'bg-yellow-500/70':
              KeyboardState[char as Keys].state === 'r' ? 'bg-red-700/50': 'bg-muted'
              ) + ' ' + (KeyboardState[char as Keys].pressed ? 'scale-105 invert': '')
            }
            style={{
              'height': `min(2.5rem, 10vw)`,
              'width' : key.length === 1? `min(2.5rem, ${100/11.6}vw)`: `calc(1.6 * min(2.5rem, ${100/11.6}vw))`,
              'margin': `min(0.5rem, ${10/16}vw)`,
            }}
          >{char}</div>
        })}
      </div>
    ))}
  </div>
}

function Block(wordLength: number, word: string, mask: string) {
  word = word.slice(0, wordLength)
  if (word.length < wordLength) word += ' '.repeat(wordLength - word.length)
  return (
    <span class='flex flex-row text-foreground overflow-visible mx-auto'>
      <For each={word as unknown as string[]}>
        {(char, i) => (
          <div
            class={'border border-muted-foreground/50 font-extrabold capitalize rounded text-2xl text-center items-center ' + (
              mask[i()] === 'r' ? 'bg-red-700/50':
              mask[i()] === 'y' ? 'bg-yellow-500/70':
              mask[i()] === 'g' ? 'bg-green-600/60':
              'bg-transparent'
            )}
            style={{
              'height': `min(2.5rem, ${100/(word.length*1.5)}vw)`,
              'width':  `min(2.5rem, ${100/(word.length*1.5)}vw)`,
              'margin': `min(0.25rem, ${100/(word.length*6)}vw)`,
            }}
          >
            <span class='w-full h-full items-center align-middle justify-items-center justify-center justify-self-center'>{char}</span>
          </div>
        )}
      </For>
    </span>
  )
}

function keyboardStateFromHistory(history: [string, string][]): KeyboardState {
  const state = structuredClone(defaultKeyboardState)
  for (const [guess, response] of history) {
    for (let i = 0; i < guess.length; i += 1) {
      const key = guess[i].toUpperCase() as keyof KeyboardState
      const obj = state[key] ?? {pressed: false}
      if (obj.state === 'g' || (obj.state === 'y' && response[i] === 'r')) continue
      obj.state = response[i] as WordleStringState
      state[key] = obj
    }
  }
  return state
}

function WordleModel(soft: SettingsSoftProps, hard: SettingsHardProps): JSX.Element {
  const prefix = 'wordle.' + (hard.allowAny? 'any.': '') + hard.wordLength
  const wordStore = new LocalstorageStore<string>(prefix + '.word')
  if (!wordStore.get()) {
    getRandomWord(hard.wordLength).then(wordStore.set.bind(wordStore))
  }
  
  const olderStore = new LocalstorageStore<[string, string][]>(prefix + '.history', [], JSON.parse, JSON.stringify)
  const [older, setOlderFn] = createStore<[string, string][]>(olderStore.get()!)
  const setOlder = ((v: any) => {
    setOlderFn(v)
    olderStore.set(unwrap(older))
  }) as SetStoreFunction<[string, string][]>

  const [state, setState] = createStore<KeyboardState>(keyboardStateFromHistory(unwrap(older)))
  const [current, setCurrent] = createSignal<string>('')

  const [showPopOver, setShowPopOver] = createSignal((unwrap(older).at(-1) ?? ['', 'r'])![1].split('').every(s => s === 'g'))

  // The block that is currently being inputted in
  let currentBlock: HTMLDivElement = undefined as any

  let loading = false
  async function submit() {
    const guess = current()
    if (loading) return

    if (guess.length !== hard.wordLength) return showError(new Error('Invalid length'))

    loading = true
    if (!hard.allowAny && !await getGuessWord(guess)) {
      showToast({title: 'Invalid Guess 😕', description: guess + ' is not present in db', variant: 'error', duration: 1000})
      loading = false
      return
    }
    loading = false // this is before as calcDiff can throw
    const response = calcDiff(wordStore.current_value!, guess)

    for (let i = 0; i < hard.wordLength; i += 1) {
      setState(guess[i].toUpperCase() as Keys, old => {
        if (old.state === 'g' || (old.state === 'y' && response[i] === 'r')) return old
        return {
          ...old,
          state: response[i] as WordleStringState,
        }
      })
    }
    setOlder((old) => [...old, [guess, response]])
    setCurrent('')
    if (response.split('').every(s => s === 'g')) {
      setShowPopOver(true)
    }
  }

  function setKeyState(key: string, pressed: boolean) {
    key = key.toUpperCase()
    if (key === 'ENTER') key = '⏎'
    if (key === 'BACKSPACE') key = '⌫'
    if (key.length === 1 && ABCD.includes(key)) {
      setState(key as Keys, old => ({
        ...old,
        pressed: pressed,
      }))
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      setCurrent('')
      return
    }

    setKeyState(e.key, true)
    if (e.key === 'Enter') {
      submit()
      return
    }

    if (e.key === 'Backspace') {
      setCurrent((old) => old.slice(0, -1))
      return
    }
    const key = e.key.toUpperCase()
    if (key.length !== 1 || !ABCD.includes(key)) return
    if (current().length === hard.wordLength) {
      currentBlock.classList.remove('motion-preset-wiggle')
      setTimeout(() => {
        currentBlock.classList.add('motion-preset-wiggle')
      }, 0)
      return
    }

    setCurrent((old) => old + e.key)
  }

  function handleKeyUp(e: KeyboardEvent) {
    setKeyState(e.key, false)
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
  })

  onCleanup(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)
  })

  return <div class='flex flex-col h-full p-6 max-sm:p-1 sm:content-center sm:justify-center'>
    <Drawer open={showPopOver()} onOpenChange={state => {
      setDone(wordStore.current_value!, unwrap(older), hard.allowAny)
      olderStore.set(undefined)
      getRandomWord(hard.wordLength).then(wordStore.set.bind(wordStore))
      setOlderFn(() => ([]))
      setState(structuredClone(defaultKeyboardState))

      setShowPopOver(state)
    }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle class='text-success-foreground'>{wordStore.current_value}</DrawerTitle>
          <DrawerDescription>Correctly guessed in <span class={
            older.length < hard.wordLength? 'text-success-foreground':
            older.length < 2*hard.wordLength? 'text-warning-foreground': 'text-error-foreground'
          }>{older.length}</span> attempts</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
    <div class='flex flex-col max-h-auto overflow-y-scroll overflow-x-visible mx-auto p-0 max-sm:mt-auto'>
      <For each={older}>
        {([word, mask]) => Block(hard.wordLength, word, mask)}
      </For>
      {(() => {
        currentBlock = Block(hard.wordLength, current(), '') as HTMLDivElement
        onMount(() => {
          currentBlock.scrollIntoView({behavior: 'smooth', block: 'start'})
        })
        return currentBlock as JSX.Element
      })()}
    </div>
    <div class='mt-10 justify-center justify-items-center overflow-visible max-sm:mt-auto max-sm:mb-4 max-sm:pt-4'>
      <Keyboard state={state}/>
    </div>
  </div>
}


export default function Wordle() {
  const hardStore = new LocalstorageStore<SettingsHardProps>('wordle.settings.hard', {
    wordLength: 6,
    allowAny: false,
  }, JSON.parse, JSON.stringify)
  const hard = createMutable(hardStore.get()!)
  createEffect(() => hardStore.set(hard))

  const softStore = new LocalstorageStore<SettingsSoftProps>('wordle.settings.soft', {
  }, JSON.parse, JSON.stringify)
  const soft = createMutable(softStore.get()!)
  createEffect(() => softStore.set(soft))

  const [loading, setLoading] = createSignal<boolean>(true)
  addWords(hard.wordLength).then(() => {
    setLoading(false)
    addAllWords().catch(showServerError)
  }).catch(showServerError)


  return <Show when={!loading()} fallback={<LoadingScreen pageString='Loading Words' />}>
    <nav class='flex flex-col p-2 ml-auto absolute align-middle items-end top-0 left-0 w-full'>
      <Settings soft={soft} hard={hard} />
    </nav>
    {WordleModel(soft, {...hard})}
  </Show>
}

