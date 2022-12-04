import type { User } from "@supabase/supabase-js"
import { createSignal } from "solid-js"

const [ user, setUser ] = createSignal<User | null>(null)

export {
  user,
  setUser
}
