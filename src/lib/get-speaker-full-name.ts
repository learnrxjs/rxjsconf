import type { Speaker } from "./../static"

export function getSpeakerFullName(speaker: Speaker): string {
  return `${ speaker.firstName } ${ speaker.lastName }`
}
