import { For } from "solid-js";
import { SITE_SOCIALS } from "../static";

export function Footer() {
  return <footer>
    <div class="wrap flex flex-col lg:flex-row justify-between items-center my-5">
      <div class="flex flex-row lg:flex-col">
        <a class="no-underline" href="/">
          <span class="font-bold text-primary">RxJS</span> <span>Conf</span>
        </a>
        <p><span>&copy; 2022</span></p>
      </div>

      <div>
        <ul class="flex gap-2">
          <For each={SITE_SOCIALS}>
            {(social) => {
              return <li class="after:content-['•'] after:ml-2 after:text-black/50 last:after:hidden">
                <a target="_blank" href={ social.value }>{ social.text }</a>
              </li>
            }}
          </For>
        </ul>
      </div>
    </div>
  </footer>
}
