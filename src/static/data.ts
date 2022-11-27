import { buildDateFromTime } from "../lib"

export const UNKNOWN_SPEAKER = "unknown-speaker"

export type SpeakerSocial = {
  type: "twitter" | "telegram" | "web_site"
  value: string
  text: string
}

export type Speaker = {
  id: string
  firstName: string
  lastName: string
  bio: string
  avatarUrl: string
  job: string
  socials: readonly SpeakerSocial[]
}

export type Talk = {
  id: string
  speakerId: Speaker["id"]
  title: string
  description: string
}

export type BreakScheduleRow = {
  type: "BREAK",
  title: string
}

export type TalkScheduleRow = {
  type: "TALK",
  talk: Talk
  speaker: Speaker
}

export type ScheduleRow = (BreakScheduleRow | TalkScheduleRow) & { time: Date }

export const speakers: ReadonlyMap<Speaker["id"], Speaker> = new Map<Speaker["id"], Speaker>()
  .set("sam-bulatov", {
    id: "sam-bulatov",
    firstName: "Сэм",
    lastName: "Булатов",
    bio: `Ведущий фронт в <a target="_blank" href="https://waliot.com">Waliot</a> из Краснодара, организует мероприятия krd.dev. Любит Angular и участвует в OSS, переводит документацию RxJS на русский язык, участник подкаста NgRuAir. Фанатеет по аниме и манге.`,
    avatarUrl: "https://ysrkaxltbcvxajqnnpdw.supabase.co/storage/v1/object/public/images/mephi-green-lightweight.jpeg",
    job: "Waliot, krd.dev",
    socials: [
      { type: "telegram", value: "https://t.me/mephistorine", text: "@mephistorine" },
      { type: "twitter", value: "https://twitter.com/mephistorine", text: "@mephistorine" },
      { type: "web_site", value: "https://mephi.dev", text: "mephi.dev" },
    ]
  })
  .set(UNKNOWN_SPEAKER, {
    id: UNKNOWN_SPEAKER,
    firstName: "(￣▽￣)ノ",
    lastName: "",
    bio: "Докладчик уточняется",
    avatarUrl: "https://ysrkaxltbcvxajqnnpdw.supabase.co/storage/v1/object/public/images/mephi-green-lightweight.jpeg",
    job: "",
    socials: []
  })

export const talks: ReadonlyMap<Talk["id"], Talk> = new Map<Talk["id"], Talk>()
  .set("rxjs-intro", {
    id: "rxjs-intro",
    speakerId: "sam-bulatov",
    title: "Введение в реактивное программирование",
    description: `React — не реактивен (спойлер: не совсем), а вот Vue, <a target="_blank" href="https://svelte.dev/">Svelte</a> и Angular — да. Но почему? Во времена jQuery, когда программа получала данные, она должна была знать все места, где эти данные задействованы, чтобы обновить их. Сейчас же фреймворки позволяют вам просто обновить данные, а отображением они уже займутся сами. Это один из принципов реактивности — инверсия зависимостей. Отображение следит за изменением данных, чтобы сделать что-то самому. В React этого не происходит, но все же стало лучше, чем было — теперь не нужно обновлять вручную во всех местах, за нас это сделает фреймворк. Доклад будет не о фреймворках, хотя и о них тоже поговорим, а больше про фундаментальные вещи.`
  })
  .set("unknown-talk", {
    id: "unknown-talk",
    speakerId: UNKNOWN_SPEAKER,
    title: "┐(￣ヘ￣;)┌",
    description: "Доклад уточняется..."
  })

export function getSchedule(): readonly Readonly<ScheduleRow>[] {
  const parseTime = buildDateFromTime(new Date(2022, 11, 11))
  return [
    { type: "BREAK", time: parseTime("12:00"), title: "Открытие" },
    {
      type: "TALK",
      time: parseTime("12:10"),
      talk: talks.get("rxjs-intro")!,
      speaker: speakers.get(talks.get("rxjs-intro")!.speakerId)!
    },
    { type: "BREAK", time: parseTime("12:50"), title: "Перерыв" },
    {
      type: "TALK",
      time: parseTime("13:00"),
      talk: talks.get("unknown-talk")!,
      speaker: speakers.get(talks.get("unknown-talk")!.speakerId)!
    },
    { type: "BREAK", time: parseTime("13:40"), title: "Перерыв" },
    {
      type: "TALK",
      time: parseTime("13:50"),
      talk: talks.get("unknown-talk")!,
      speaker: speakers.get(talks.get("unknown-talk")!.speakerId)!
    },
    { type: "BREAK", time: parseTime("14:30"), title: "Закрытие" }
  ]
}
