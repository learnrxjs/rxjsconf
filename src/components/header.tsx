import { createMemo, createSignal, onCleanup, onMount } from "solid-js"
import { Icon } from "./icon"

export function Header() {
  let headerElementRef: HTMLElement

  const [ isOpen, setIsOpen ] = createSignal(false)
  const iconName = createMemo(() => isOpen() ? "close" : "menu")

  const onClickTrigger = () => {
    setIsOpen((prev) => !prev)
  }

  const onDocumentClick = (event: MouseEvent) => {
    if (headerElementRef.contains(event.target as HTMLElement)) {
      return
    }

    setIsOpen(false)
  }

  onMount(() => {
    document.addEventListener("click", onDocumentClick)
  })

  onCleanup(() => {
    document.removeEventListener("click", onDocumentClick)
  })

  return <header ref={ headerElementRef } class="fixed lg:static bottom-0 left-0 w-full bg-white border-t lg:border-none lg:bg-transparent">
    <div class="wrap flex flex-col gap-4 lg:gap-0 lg:flex-row lg:justify-between lg:items-center py-5">
      <div class="flex justify-between items-center order-last lg:order-none">
        <a class="no-underline flex gap-2" href="/">
          <img class="w-4 lg:hidden" src="/rxjs-conf-logo-without-stroke.svg" alt="RxJS Conf logo" />
          <span><span class="font-bold text-primary">RxJS</span> <span>Conf</span></span>
        </a>

        <button onClick={ onClickTrigger } class="text-black w-7 lg:hidden">
          <Icon name={ iconName() } />
        </button>
      </div>

      <nav class="text-right lg:text-left lg:block" attr:data-hidden={ !isOpen() }>
        <ul class="flex flex-col lg:flex-row gap-4">
          <li>
            <a onClick={ onClickTrigger } href="/#schedule">Расписание</a>
          </li>
          <li>
            <a onClick={ onClickTrigger } href="/#speakers">Докладчики</a>
          </li>
        </ul>
      </nav>

      <div class="text-right lg:text-left lg:block order-first lg:order-none" attr:data-hidden={ !isOpen() }>
        <a href="/cfp">Подать доклад</a>
      </div>
    </div>
  </header>
}
