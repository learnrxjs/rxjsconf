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
          <li class="after:content-['•'] after:ml-2 after:text-black/50">
            <a target="_blank" href="https://twitter.com/rxjsconf">Твиттер</a>
          </li>
          <li class="after:content-['•'] after:ml-2 after:text-black/50">
            <a target="_blank" href="https://t.me/rxjsconf">Телеграм</a>
          </li>
          <li class="after:content-['•'] after:ml-2 after:text-black/50">
            <a target="_blank" href="https://github.com/learnrxjs">Гитхаб</a>
          </li>
          <li>
            <a target="_blank" href="#">Ютуб</a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
}
