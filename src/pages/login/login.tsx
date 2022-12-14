import { createEffect, createMemo, createSignal, Show } from "solid-js"
import { createStore } from "solid-js/store"
import { Portal } from "solid-js/web"
import { Alert } from "../../components"
import { getSupabaseClient, setUser } from "../../lib"
import type { AlertMessage } from "../../models"

type Props = {
  supabaseUrl: string
  supabaseKey: string
}

export default function LoginPage(props: Props) {
  const supabaseClient = getSupabaseClient(props.supabaseUrl, props.supabaseKey)
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
  const [ optSent, setOtpSent ] = createSignal(false)
  
  const [ formValue, setformValue ] = createStore({
    email: "",
    otp: ""
  })

  async function onSubmitForm(event: Event) {
    event.preventDefault();

    if (isLoading()) {
      return
    }

    setIsLoading(true)
    
    if (optSent()) {
      try {
        const { data, error } = await supabaseClient
          .auth
          .verifyOtp({
            email: formValue.email,
            token: formValue.otp,
            type: "magiclink"
          })
        
        if (error) {
          throw error
        }
        
        setUser(data.user)
      } catch(error) {
        console.error(error)
      } finally {
        setIsLoading(false)
        location.replace("/")
      }

      return
    }
    
    try {
      const { error } = await supabaseClient
        .auth
        .signInWithOtp({ email: formValue.email })
      
      setOtpSent(true)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  function createOnInputHandler(key: "email" | "otp") {
    return (event: Event) => setformValue(key, (event.target as HTMLInputElement).value)
  }

  return <div class="wrap flex flex-col gap-4">
    <h2 class="text-4xl font-bold">??????????????????????</h2>

    <form id="login-form" class="flex flex-col gap-4 md:max-w-[300px]" onSubmit={ onSubmitForm }>
      <div class="form-field-container">
        <label class="label" for="email">Email<span class="text-red-600">*</span></label>
        <input class="input" id="email" type="email" name="email" autocomplete="on" required onInput={ createOnInputHandler("email") } />
      </div>

      <Show when={optSent()}>
        <div class="form-field-container">
          <label class="label" for="otp-password">?????????????????????? ????????????<span class="text-red-600">*</span></label>
          <input class="input" id="otp-password" type="text" name="otp-password" required onInput={ createOnInputHandler("otp") } />
        </div>
      </Show>
    </form>

    <button type="submit" form="login-form" class="button w-fit md:max-w-[300px]" disabled={ isLoading() }>
      <Show when={ !isLoading() } fallback={ <>????????????????...</> }>
        <Show when={ optSent() } fallback={ <>????????????????????</> }>??????????</Show>
      </Show>
    </button>

    <Portal mount={document.getElementById("modal-container")}>
      { showAlert() && <Alert alert={ alert()! } /> }
    </Portal>
  </div>
}
