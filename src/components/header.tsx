import { createMemo, createSignal, onCleanup, onMount, Show } from "solid-js"
import { getSupabaseClient, setUser, user } from "../lib"
import { Icon } from "./icon"

type Props = {
  supabaseUrl: string
  supabaseKey: string
}

export function Header(props: Props) {
  let headerElementRef: HTMLElement
  const supabaseClient = getSupabaseClient(props.supabaseUrl, props.supabaseKey)
  
  supabaseClient
    .auth
    .getSession()
    .then(({ data, error }) => {
      if (error) {
        console.error(error)
        return
      }

      if (data.session) {
        setUser(data.session.user)
      }
    })

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

  const onClickLogoutButton = async () => {
    await supabaseClient.auth.signOut()
    setUser(null)
  }

  onMount(async () => {
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

      <nav class="text-right lg:text-left lg:block" classList={{ "hidden": !isOpen() }}>
        <ul class="flex flex-col lg:flex-row gap-4">
          <li>
            <a onClick={ onClickTrigger } href="/#schedule">Расписание</a>
          </li>
          <li>
            <a onClick={ onClickTrigger } href="/#speakers">Докладчики</a>
          </li>
          <li>
            <a onClick={ onClickTrigger } href="/cfp">Подать доклад</a>
          </li>
        </ul>
      </nav>

      <div class="text-right flex md:flex flex-col items-center md:flex-row gap-2 lg:text-left" classList={{ "hidden": !isOpen() }}>
        <Show when={ user() !== null }>
          <span>{ user()!.email }</span>
          <button class="button p-2" onClick={ onClickLogoutButton }>
            <div class="w-[1em]"><Icon name="logout" /></div>
          </button>
        </Show>
        <Show when={ user() === null }>
          <a class="button md:py-1 sm:w-fit no-underline bg-primary hover:bg-primary/70" href="/login">Войти</a>
          <a class="button md:py-1 no-underline" href="/registration">Зарегистрироваться</a>
        </Show>
      </div>
    </div>
  </header>
}
