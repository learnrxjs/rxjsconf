import { Show } from "solid-js";
import { Icon, YoutubeVideo } from "../components";
import { formatScheduleTime, getSpeakerFullName, user } from "../lib";
import { getSchedule, SITE_SETTINGS, speakers, TalkScheduleRow, UNKNOWN_SPEAKER, type Speaker } from "../static";

export default function MainPage() {
  const schedule = getSchedule()

  function isShowTalkActions(row: TalkScheduleRow): boolean {
    return row.talk.slidesUrl !== null
      || row.talk.videoUrl !== null
      || SITE_SETTINGS.showFeedbacks
  }

  return <>
    <section>
      <div class="wrap grid lg:grid-cols-2 p-8">
        <div class="md:order-1 hidden md:block justify-self-center">
          <img class="w-[300px]" src="/rxjs-conf-logo.svg" alt="RxJS Logo" />
        </div>

        <div class="flex flex-col gap-4 w-full">
          <h1
            class="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight text-primary"
          >
            11.12
          </h1>

          <h1
            class="text-5xl lg:text-6xl xl:text-7xl font-bold lg:tracking-tight"
          >
            Онлайн конференция по RxJS
          </h1>

          <p class="text-lg text-slate-600 max-w-xl">
            Собираемся вместе, чтобы делиться знаниями и опытом. <br /> Подпишитесь
            на наш телеграм канал, чтобы быть в курсе всего.
          </p>

          <div class="flex flex-col md:flex-row gap-4">
            <a
              href="https://t.me/rxjsconf"
              class="button sm:w-fit justify-center sm:justify-start no-underline bg-primary hover:bg-primary/70 flex items-center gap-2"
            >
              <div class="w-4"><Icon name="telegram" /></div>
              <span>Подписаться</span>
            </a>
            <Show when={ SITE_SETTINGS.youtubeVideoId !== null }>
              <a href={ `https://www.youtube.com/watch?v=${ SITE_SETTINGS.youtubeVideoId }` } target="_blank" class="button sm:w-fit justify-center sm:justify-start no-underline bg-[red] hover:bg-[red]/70 flex items-center gap-2">
                <div class="w-4"><Icon name="youtube" /></div>
                <span>Смотреть трансляцию</span>
              </a>
            </Show>
          </div>
        </div>
      </div>
    </section>

    <Show when={ SITE_SETTINGS.youtubeVideoId !== null }>
      <section>
        <div class="wrap">
          <YoutubeVideo id={ SITE_SETTINGS.youtubeVideoId! } title="Видео-трансляция конференции" />
        </div>
      </section>
    </Show>

    <section>
      <div class="wrap">
        <h2 id="schedule" class="text-3xl font-bold">Расписание</h2>

        <p>Время указано в часовом поясе GTM+3</p>

        <ul class="text-xl divide-y">
          {
            schedule.map((row) => {
              if (row.type === "BREAK") {
                return (
                  <li
                    id="schedule-10-00"
                    class="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 py-4"
                  >
                    <time datetime={row.time.toISOString()}>
                      {formatScheduleTime(row.time)}
                    </time>
                    <p class="text-gray-500">{row.title}</p>
                  </li>
                );
              }

              return (
                <li class="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 py-4">
                  <time
                    id={formatScheduleTime(row.time)}
                    datetime={row.time.toISOString()}
                  >
                    {formatScheduleTime(row.time)}
                  </time>

                  <div class="flex-grow flex flex-col gap-2">
                    <h3 id={row.talk.id} class="text-2xl font-bold flex items-center gap-2">
                      <span>{row.talk.title}</span>
                      <a class="no-underline text-gray-400" href={ `/#${ row.talk.id }` }>#</a>
                    </h3>

                    <div class="text-base formatted-text" innerHTML={row.talk.description} />

                    <Show when={ isShowTalkActions(row) }>
                      <ul class="text-base flex gap-4">
                        <Show when={row.talk.slidesUrl !== null}>
                          <li>
                            <a
                              class="flex items-center gap-1"
                              target="_blank"
                              download
                              href={row.talk.slidesUrl}
                            >
                              <div class="w-4">
                                <Icon name="pdf" />
                              </div>
                              <span>Слайды</span>
                            </a>
                          </li>
                        </Show>
                        <Show when={row.talk.videoUrl !== null}>
                          <li>
                            <a
                              class="flex items-center gap-1"
                              target="_blank"
                              href={row.talk.videoUrl}
                            >
                              <div class="w-4">
                                <Icon name="youtube" />
                              </div>
                              <span>Запись</span>
                            </a>
                          </li>
                        </Show>
                        <Show when={ SITE_SETTINGS.showFeedbacks }>
                          <li>
                            <a href={`/feedback?talkId=${ row.talk.id }&email=${ user()?.email }`} target="_blank">Оставить отзыв</a>
                          </li>
                        </Show>
                      </ul>
                    </Show>
                  </div>

                  {row.speaker.id !== UNKNOWN_SPEAKER && (
                    <div class="flex flex-col gap-2">
                      <img
                        class="rounded min-w-[150px] max-w-[150px]"
                        src={row.speaker.avatarUrl}
                        alt=""
                      />
                      <div>
                        <p>
                          <a href={`/#${row.speaker.id}`}>
                            {getSpeakerFullName(row.speaker)}
                          </a>
                        </p>
                        <div class="text-black/50 text-sm" innerHTML={row.speaker.job}></div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })
          }
        </ul>
      </div>
    </section>

    <section>
      <div class="wrap">
        <div
          class="bg-black text-white p-8 md:px-20 md:py-20 rounded-lg flex flex-col gap-4 items-center text-center"
        >
          <h2 class="text-4xl md:text-5xl font-bold">Сообщество</h2>
          <p class="text-slate-400 text-lg">
            Конференция подготовлена в рамках телеграм сообщества «RxJS —
            русскоговорящее сообщество».
          </p>
          <a
            class="button bg-white text-black hover:bg-white/80 no-underline"
            target="_blank"
            href="https://t.me/rxjs_ru">Присоединиться к сообществу</a
          >
        </div>
      </div>
    </section>

    <section>
      <div class="wrap">
        <h2 id="speakers" class="text-3xl font-bold">Докладчики</h2>

        <ul class="divide-y">
          {
            Array.from(speakers.values())
              .filter((speaker) => speaker.id !== UNKNOWN_SPEAKER)
              .map((speaker: Speaker) => {
                return (
                  <li class="flex flex-col sm:flex-row items-start gap-4 sm:gap-8 py-4">
                    <figure>
                      <img
                        class="rounded min-w-[150px] max-w-[150px]"
                        src={speaker.avatarUrl}
                        alt=""
                      />
                    </figure>
                    <div class="flex flex-col gap-2">
                      <h3 id={speaker.id} class="text-2xl font-bold">
                        {getSpeakerFullName(speaker)}
                      </h3>
                      <div class="text-black/50" innerHTML={speaker.job}></div>
                      <p innerHTML={speaker.bio} />

                      {speaker.socials.length > 0 && (
                        <ul class="flex gap-2 flex-wrap">
                          {speaker.socials.map((social) => {
                            return (
                              <li class="after:content-['•'] after:ml-2 after:text-black/50 last:after:hidden flex items-center">
                                <a
                                  href={social.value}
                                  class="flex items-center gap-1"
                                >
                                  <div class="w-4">
                                    <Icon name={social.type} />
                                  </div>
                                  <span>{social.text}</span>
                                </a>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </li>
                );
              })
          }
        </ul>
      </div>
    </section>
  </>
}
