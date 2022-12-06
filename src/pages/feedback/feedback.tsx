import { createEffect, createSignal, For, onMount, Show } from "solid-js"
import * as s from "superstruct"
import { createRenderEffect, Signal } from "solid-js"
import { Portal } from "solid-js/web"
import { talks as talkMap } from "../../static"
import { Icon } from "../../components/icon"

type Alert = {
  type: "error" | "success" | "warn"
  message: string
}

type Feedback = {
  email: string
  name: string
  talkId: string
  rating: number
  feedback: string
}

const FeedbackSchema = s.object({
  email: s.nonempty(s.string()),
  name: s.nonempty(s.string()),
  talkId: s.nonempty(s.string()),
  rating: s.max(s.min(s.number(), 1), 5),
  feedback: s.nonempty(s.string())
})

/* async function test() {
  const s = await import("https://esm.sh/@supabase/supabase-js@2")
  const client = s.createClient("https://ysrkaxltbcvxajqnnpdw.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcmtheGx0YmN2eGFqcW5ucGR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2OTM5NDU5OSwiZXhwIjoxOTg0OTcwNTk5fQ.IcJ0H8BT__a8mKngvTXnhjn48lgIK2kXrKe-pwe6q4Q")
  const ddd = await client
    .from("feedbacks")
    .select()
  debugger
} */

export function FeedbackPage() {
  const talks = Array.from(talkMap.values()) 
  const [ alert, showAlert ] = createSignal<Alert | null>(null)
  const [ isLoading, setIsLoading ] = createSignal<boolean>(false)

  const [ name, setName ] = createSignal<string>("")
  const [ email, setEmail ] = createSignal<string>("")
  const [ talkId, setTalkId ] = createSignal<string>("")
  const [ rating, setRating ] = createSignal<number>(5)
  const [ feedback, setFeedback ] = createSignal<string>("")

  const submitFormHandler = (event: Event) => {
    event.preventDefault();

    const formValue: Feedback = {
      name: name(),
      email: email(),
      talkId: talkId(),
      rating: rating(),
      feedback: feedback()
    }

    const [ error, value ] = s.validate(formValue, FeedbackSchema)
    
    if (typeof error !== "undefined") {
      console.log(error)
      showAlert({
        type: "warn",
        message: "Форма заполнена не правильно."
      })
      return
    }

    setIsLoading(true)
    fetch("https://ysrkaxltbcvxajqnnpdw.functions.supabase.co/send-feedback", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(value)
    })
      .then(
        () => showAlert({ type: "success", message: "Отзыв успешно отправлен!" }),
        () => showAlert({ type: "error", message: "Ошибка отправки отзыва." }),
      )
      .finally(() => setIsLoading(false))
  }

  onMount(() => {
    const url: URL = new URL(location.href)
    const handlers: Record<keyof Feedback, any> = {
      name: setName,
      email: setEmail,
      talkId: setTalkId,
      rating: setRating,
      feedback: setFeedback
    }
    
    url.searchParams.forEach((value, key) => {
      const handler = Reflect.get(handlers, key)
      Reflect.apply(handler, null, [ value ])
      url.searchParams.delete(key)
    })

    history.pushState(null, "", url)
  })

  createEffect((timoutId: number | null) => {
    if (timoutId !== null) {
      clearTimeout(timoutId)
    }

    const alrt = alert()

    if (alrt === null) {
      return null
    }

    return setTimeout(() => showAlert(null), 2000)
  }, null)

  return <div class="wrap">
    <Portal mount={document.getElementById("modal-container")}>
      <Show when={alert() !== null}>
        <div class="alert" attr:data-alert-type={ alert()!.type }>{ alert()!.message }</div>
      </Show>
    </Portal>

    <h2 class="text-4xl font-bold mb-4">Оставить отзыв о докладе</h2>

    <p class="mb-2"><span class="text-red-600">*</span> — обязательные поля.</p>

    <p class="mb-2">Если вы обнаружите какие-то ошибки, то вы можете <a href="https://github.com/learnrxjs/rxjsconf/issues">создать ишью</a> или написать в телегам <a href="https://t.me/mephistorine">@mephistorine</a>.</p>

    <form class="flex flex-col gap-4 md:max-w-[300px]" onSubmit={submitFormHandler}>
      <div class="form-field-container">
        <label class="label" for="talk-name">Доклад<span class="text-red-600">*</span></label>
        <select use:model={ [ talkId, setTalkId ] } class="input" name="talk_name" id="talk-name">
          <For each={ talks }>{(talk) => <option value={ talk.id }>{ talk.title }</option>}</For>
        </select>
      </div>

      <div class="form-field-container">
        <label class="label" for="first_name">Имя<span class="text-red-600">*</span></label>
        <input use:model={ [ name, setName ] } class="input" id="first_name" type="text" name="name_first" autocomplete="on" required />
      </div>

      <div class="form-field-container">
        <label class="label" for="email">Email<span class="text-red-600">*</span></label>
        <input use:model={ [ email, setEmail ] } class="input" id="email" type="email" name="email" autocomplete="on" required />
      </div>
      
      <div class="form-field-container">
        <label class="label" for="email">Рейтинг<span class="text-red-600">*</span></label>
        
        <div class="flex flex-col">
          <For each={[ 1, 2, 3, 4, 5 ]}>
            {(ratingValue) => {
              return <label class="flex items-center gap-2 hover:bg-primary/10 p-2 rounded cursor-pointer">
                <input use:model={ [ rating, (r: any) => setRating(parseFloat(r)) ] } class="accent-primary rounded-full block" type="radio" name="rating" value={ ratingValue } />
                <span>{ ratingValue }</span>
              </label>
            }}
          </For>
        </div>
      </div>

      <div class="form-field-container">
        <label class="label" for="feedback">Отзыв<span class="text-red-600">*</span></label>
        <textarea use:model={ [ feedback, setFeedback ] } name="feedback" id="feedback" class="input font-mono min-h-[100px]"></textarea>
      </div>

      <div>
        <button type="submit" class="button flex items-center gap-2 disabled:cursor-not-allowed" disabled={ isLoading() }>
          <Show when={ isLoading() }>
            <div class="w-4"><Icon name="spinner" /></div>
            <span>Отправляется...</span>
          </Show>

          <Show when={ !isLoading() }>
            <span>Отправить</span>
          </Show>
        </button>
      </div>
    </form>
  </div>
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      model: any
    }
  }
}

function isInput(target: HTMLElement): target is HTMLInputElement {
  return target.tagName === "INPUT"
}

function isRadioInput(target: HTMLElement): target is HTMLInputElement {
  return target.tagName === "INPUT" && target.getAttribute("type") === "radio"
}

function isTextarea(target: HTMLElement): target is HTMLInputElement {
  return target.tagName === "TEXTAREA"
}

function isSelect(target: HTMLElement): target is HTMLSelectElement {
  return target.tagName === "SELECT"
}

export function model(targetElement: HTMLElement, payload: () => Signal<any>) {
  const [ field, setField ] = payload()

  if (isRadioInput(targetElement)) {
    createRenderEffect(() => {
      targetElement.checked = targetElement.value === field().toString()
      targetElement.addEventListener("change", () => setField(targetElement.value))
    })
    return
  }

  if (isInput(targetElement) || isTextarea(targetElement)) {
    createRenderEffect(() => (targetElement.value = field()))
    targetElement.addEventListener("input", (event) => setField((event.target as HTMLInputElement).value))
    return
  }

  if (isSelect(targetElement)) {
    createRenderEffect(() => (targetElement.value = field()))
    targetElement.addEventListener("change", (event) => setField((event.target as HTMLSelectElement).value))
    return
  }
}
