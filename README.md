# Sleeper

Минимальный черно-белый PWA-калькулятор циклов сна для GitHub Pages.

## Локальный запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

Сайт собирается в `dist/`. Vite настроен с `base: "/sleeper/"`, поэтому сборка готова для GitHub Pages по адресу репозитория `chikirao/sleeper`.

## Деплой на GitHub Pages

В проекте есть workflow `.github/workflows/pages.yml`. Он запускается при push в `main`, собирает статический Vite-проект и публикует `dist` через GitHub Pages.

В настройках репозитория GitHub Pages должен быть выбран источник **GitHub Actions**.

## iPhone Home Screen

1. Откройте опубликованный сайт в Safari на iPhone.
2. Нажмите кнопку Share.
3. Выберите **Add to Home Screen**.
4. Приложение сохранится как `Sleeper` и запустится в standalone-режиме.
