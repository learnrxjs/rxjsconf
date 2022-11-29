import { buildDateFromTime } from "../lib"

export const UNKNOWN_SPEAKER = "unknown-speaker"

export type SpeakerSocial = {
  type: "twitter" | "telegram" | "web_site" | "github" | "youtube"
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
  slidesUrl: string | null
  videoUrl: string | null
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
    avatarUrl: "https://ysrkaxltbcvxajqnnpdw.supabase.co/storage/v1/object/public/images/sam-bulatov",
    job: "Waliot, krd.dev",
    socials: [
      { type: "telegram", value: "https://t.me/mephistorine", text: "@mephistorine" },
      { type: "twitter", value: "https://twitter.com/mephistorine", text: "@mephistorine" },
      { type: "web_site", value: "https://mephi.dev", text: "mephi.dev" },
    ]
  })
  .set("denis-makarov", {
    id: "denis-makarov",
    firstName: "Денис",
    lastName: "Макаров",
    bio: "Senior developer в компании 1inch. Более 6 лет работаю с Angular/RxJS. Увлекаюсь блокчейн технологиями, dApp и фронтендом. Пробую вести канал про web3 разработку. Пишу про RxJS, когда есть время 🙂 и админю русскоязычный чатик RxJS.",
    avatarUrl: "https://ysrkaxltbcvxajqnnpdw.supabase.co/storage/v1/object/public/images/denis-makarov",
    job: "1inch Network",
    socials: [
      { type: "telegram", value: "https://t.me/limitofzero", text: "@limitofzero" },
      { type: "twitter", value: "https://twitter.com/limitofzero", text: "@limitofzero" },
      { type: "github", value: "https://github.com/limitofzero", text: "@limitofzero" }
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
  .set("sam-bulatov-talk", {
    id: "sam-bulatov-talk",
    speakerId: "sam-bulatov",
    title: "Шедулеры в RxJS",
    description: `Буду разбирать внутренности того как RxJS работает с асинхронщиной, какие могут встретиться подводные камни и когда их нужно использовать, буду затрагивать тему шуделеров и операторов по типу observeOn. Комбинация опыта работы с RxJS и объяснения внутренной реализации.`,
    slidesUrl: null,
    videoUrl: null
  })
  .set("denis-makarov-talk", {
    id: "denis-makarov-talk",
    speakerId: "denis-makarov",
    title: "Готовим безопасный и читаемый RxJS",
    description: "Затронем темы, которые часто всплывают в сообществе RxJS. Поговорим про вечный вопрос - \"нужна ли отписка?\". Когда вам точно не нужен tap. Как протестировать ваш Observable так, чтобы было не стыдно показать тимлиду.",
    slidesUrl: null,
    videoUrl: null
  })
  .set("unknown-talk", {
    id: "unknown-talk",
    speakerId: UNKNOWN_SPEAKER,
    title: "┐(￣ヘ￣;)┌",
    description: "Доклад уточняется...",
    slidesUrl: null,
    videoUrl: null
  })

export function getSchedule(): readonly Readonly<ScheduleRow>[] {
  const parseTime = buildDateFromTime(new Date(2022, 11, 11))
  return [
    { type: "BREAK", time: parseTime("12:00"), title: "Открытие" },
    {
      type: "TALK",
      time: parseTime("12:10"),
      talk: talks.get("sam-bulatov-talk")!,
      speaker: speakers.get(talks.get("sam-bulatov-talk")!.speakerId)!
    },
    { type: "BREAK", time: parseTime("12:50"), title: "Перерыв" },
    {
      type: "TALK",
      time: parseTime("13:00"),
      talk: talks.get("denis-makarov-talk")!,
      speaker: speakers.get(talks.get("denis-makarov-talk")!.speakerId)!
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

export const SITE_SOCIALS: readonly Readonly<SpeakerSocial>[] = [
  { type: "telegram", value: "https://t.me/rxjsconf", text: "Телеграм" },
  { type: "twitter", value: "https://twitter.com/rxjsconf", text: "Твиттер" },
  { type: "github", value: "https://github.com/learnrxjs", text: "Гитхаб" },
  { type: "youtube", value: "https://www.youtube.com/@rxjsconf", text: "Ютуб" }
]
