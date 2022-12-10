import type { SupabaseClient } from "@supabase/supabase-js"
import { createEffect, createMemo, createSignal, Show } from "solid-js"
import { createStore } from "solid-js/store"
import { Portal } from "solid-js/web"
import * as s from "superstruct"
import { Alert } from "../../components"
import { email, getSupabaseClient } from "../../lib"
import type { AlertMessage } from "../../models"

type Props = {
  supabaseUrl: string
  supabaseKey: string
}

const RegistrationFormSchema = s.object({
  email: s.nonempty(email()),
  password: s.nonempty(s.size(s.string(), 6, Infinity)),
  name: s.string()
})

function validate(target: any, schema: s.Struct<any>): [ boolean, unknown[] | null ] {
  const [ error ] = s.validate(target, schema)

  if (error) {
    const others = error.failures()
    return [
      false,
      [ error, ...others ]
    ]
  }

  return [ true, null ]
}

export default function RegistrationPage(props: Props) {
  const [ alert, setAlert ] = createSignal<AlertMessage | null>(null)
  const showAlert = createMemo(() => alert() !== null)
  createEffect((timoutId: number | null) => {
    if (timoutId !== null) {
      clearTimeout(timoutId)
    }

    const alrt = alert()

    if (alrt === null) {
      return null
    }

    const aliveSeconds: number = alrt.options?.aliveSeconds ?? 2000

    if (!Number.isFinite(aliveSeconds)) {
      return null
    }

    return setTimeout(() => setAlert(null), aliveSeconds)
  }, null)

  const [ isLoading, setIsLoading ] = createSignal(false)
  const [ formValue, setformValue ] = createStore({
    email: "",
    password: "",
    name: ""
  })

  const client: SupabaseClient = getSupabaseClient(props.supabaseUrl, props.supabaseKey)
  
  async function onClickRegisterButton() {
    if (isLoading()) {
      return
    }

    const form = {
      email: formValue.email,
      password: formValue.password,
      name: formValue.name
    }

    const [ isValid, error ] = validate(form, RegistrationFormSchema)
    
    console.error(error)

    if (!isValid) {
      setAlert({
        type: "warn",
        message: "Форма заполнена не правильно."
      })
    }

    setIsLoading(true)

    try {
      const { error } = await client.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: formValue.name
          }
        }
      })

      if (error) {
        throw error
      }

      setAlert({
        type: "success",
        message: "Вы успешно зарегистрировались! Вам на почту должно прийти письмо, с дальнейшими инструкциями.",
        options: {
          aliveSeconds: Infinity
        }
      })
    } catch (error) {
      console.error(error)

      setAlert({
        type: "error",
        message: "Произошла ошибка. Попробуйте еще раз."
      })
    } finally {
      setIsLoading(false)
    }
  }

  function createOnInputHandler(key: "email" | "password" | "name") {
    return (event: Event) => setformValue(key, (event.target as HTMLInputElement).value)
  }

  return <div class="wrap flex flex-col gap-4">
    <h2 class="text-4xl font-bold">Регистрация</h2>
    
    <form id="registration-form" class="flex flex-col gap-4 md:max-w-[300px]">
      <div class="form-field-container">
        <label class="label" for="email">Email<span class="text-red-600">*</span></label>
        <input class="input" id="email" type="email" name="email" required onInput={ createOnInputHandler("email") } />
      </div>

      <div class="form-field-container">
        <label class="label" for="password">Пароль<span class="text-red-600">*</span></label>
        <input class="input" id="password" type="password" name="password" required onInput={ createOnInputHandler("password") } />
        <p class="text-sm text-gray-400">Поле должно быть больше 6 символов</p>
      </div>

      <div class="form-field-container">
        <label class="label" for="name">Имя</label>
        <input class="input" id="name" type="name" name="name" required onInput={ createOnInputHandler("name") } />
      </div>
    </form>
    
    <button class="button w-fit md:max-w-[300px]" onClick={ onClickRegisterButton } disabled={ isLoading() }>
      <Show when={ !isLoading() } fallback={ <>Загрузка...</> }>
        Зарегистрироваться
      </Show>
    </button>

    <Portal mount={document.getElementById("modal-container")}>
      { showAlert() && <Alert alert={ alert()! } /> }
    </Portal>
  </div>
}
