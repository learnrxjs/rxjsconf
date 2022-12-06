import { createEffect, createSignal, Show } from "solid-js"
import { Portal } from "solid-js/web"
import { validate } from "superstruct"
import { Icon } from "../../components"
import { CfpFormValue, CfpSchema } from "../../models"

type Alert = {
  type: "error" | "success" | "warn"
  message: string
}

export function CfpPage() {
  const [ alert, showAlert ] = createSignal<Alert | null>(null)
  const [ isLoading, setIsLoading ] = createSignal(false)
  const [ formValue, setFormValue ] = createSignal<CfpFormValue>({
    firstName: "",
    lastName: "",
    email: "",
    telegramUrl: "",
    githubUrl: "",
    about: "",
    talkTitle: "",
    talkDesc: ""
  })

  const createOnInput = (prop: keyof CfpFormValue) => {
    return (event: InputEvent) => {
      setFormValue((prev) => {
        return {
          ...prev,
          [ prop ]: (event.target as HTMLInputElement).value
        }
      })
    }
  }

  const submitFormHandler = (event: Event) => {
    event.preventDefault();

    const value = formValue()
    
    const [ error, result ] = validate(value, CfpSchema)
    
    if (typeof error === "undefined") {
      setIsLoading(true)
      fetch("https://ysrkaxltbcvxajqnnpdw.functions.supabase.co/cfp", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(result)
      })
        .then(() => {
          showAlert({
            type: "success",
            message: "Заявка успешно отправлена!"
          })
        })
        .catch((error) => {
          console.error(error)
          showAlert({
            type: "error",
            message: "Ошибка при отправке заявки."
          })
        })
        .finally(() => setIsLoading(false))
      return
    }

    showAlert({
      type: "warn",
      message: "Форма заполнена не правильно."
    })
  }

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

    <h2 class="text-4xl font-bold mb-4">Подать доклад</h2>

    <p class="mb-2"><span class="text-red-600">*</span> — обязательные поля.</p>

    <p class="mb-2">Если вы обнаружите какие-то ошибки, то вы можете <a href="https://github.com/learnrxjs/rxjsconf/issues">создать ишью</a> или написать в телегам <a href="https://t.me/mephistorine">@mephistorine</a>.</p>

    <form class="flex flex-col gap-4 md:max-w-[300px]" onSubmit={submitFormHandler}>
      <div class="form-field-container">
        <label class="label" for="first_name">Имя<span class="text-red-600">*</span></label>
        <input class="input" id="first_name" type="text" name="name_first" required onInput={ createOnInput("firstName") } />
      </div>

      <div class="form-field-container">
        <label class="label" for="last_name">Фамилия<span class="text-red-600">*</span></label>
        <input class="input" id="last_name" type="text" name="name_last" required onInput={ createOnInput("lastName") } />
      </div>

      <div class="form-field-container">
        <label class="label" for="email">Email<span class="text-red-600">*</span></label>
        <input class="input" id="email" type="email" name="email_address" required onInput={ createOnInput("email") } />
      </div>

      <div class="form-field-container">
        <label class="label" for="telegram_link">Телеграм</label>
        <input class="input" id="telegram_link" type="url" name="telegram_link" placeholder="https://t.me/<nickname>" onInput={ createOnInput("telegramUrl") } />
      </div>

      <div class="form-field-container">
        <label class="label" for="github_link">Гитхаб</label>
        <input class="input" id="github_link" type="url" name="github_link" placeholder="https://github.com/<nickname>" onInput={ createOnInput("githubUrl") } />
      </div>

      <div class="form-field-container">
        <label class="label" for="about">О себе<span class="text-red-600">*</span></label>
        <p class="text-sm text-zinc-400">Буквально пару слов о себе.</p>
        <textarea class="input font-mono min-h-[100px]" id="about" required onInput={ createOnInput("about") }></textarea>
      </div>

      <div class="form-field-container">
        <label class="label" for="talk_title">Название доклада</label>
        <input class="input" id="talk_title" type="text" name="talk_title" onInput={ createOnInput("talkTitle") } />
      </div>

      <div class="form-field-container">
        <label class="label" for="talk_desc">О чем хотите рассказать?<span class="text-red-600">*</span></label>
        <textarea class="input font-mono min-h-[100px]" id="talk_desc" required onInput={ createOnInput("talkDesc") }></textarea>
      </div>

      <div>
        <button type="submit" class="button flex items-center gap-2 disabled:cursor-not-allowed" disabled={isLoading()}>
          <Show when={isLoading()}>
            <div class="w-4"><Icon name="spinner" /></div>
            <span>Отправляется...</span>
          </Show>

          <Show when={!isLoading()}>
            <span>Отправить</span>
          </Show>
        </button>
      </div>
    </form>
  </div>
}
