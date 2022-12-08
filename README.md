# RxJS Conf

[![deploy](https://github.com/learnrxjs/rxjsconf/actions/workflows/deploy.yml/badge.svg)](https://github.com/learnrxjs/rxjsconf/actions/workflows/deploy.yml)

[Сайт](https://rxjsconf.ru) • [Докладчики](https://rxjsconf.ru/#speakers) • [Доклады](https://rxjsconf.ru/#talks) • [Подать доклад](https://rxjsconf.ru/cfp)

[![](/misc/readme/readme-demo.png)](https://rxjsconf.ru)

## Разработка

| `pnpm start` | Запуск проекта по пути http://localhost:3000 |
|:-----|:----|
| `pnpm run build` | Запуск сборки. Артифакты будут лежать в директории `dist`. |
| `pnpm run preview` | Запуск превью сборки. От `start`-а отличается этапом сборки, и уже из директории `dist` запускается сайт.  |

## Docker

1. Собрать докер образ
    ```bash
    docker build --tag rxjsconf .
    ```

2. Запустить контейнер. Контейнер запустится по пути http://localhost
    ```bash
    docker run --name rxjsconf --publish 80:80 --publish 443:443 --detach rxjsconf
    ```

## Организаторы

- Сэм Булатов (@mephistorine)
- Денис Макаров (@limitofzero)
