import { nonempty, object, optional, string } from "superstruct"
import { email } from "../lib"

export type CfpFormValue = {
  firstName: string
  lastName: string
  email: string
  telegramUrl: string | null
  githubUrl: string | null
  about: string
  talkTitle: string | null
  talkDesc: string
}

export const CfpSchema = object({
  firstName: nonempty(string()),
  lastName: nonempty(string()),
  email: nonempty(email()),
  telegramUrl: optional(string()),
  githubUrl: optional(string()),
  about: nonempty(string()),
  talkTitle: optional(string()),
  talkDesc: nonempty(string())
})
