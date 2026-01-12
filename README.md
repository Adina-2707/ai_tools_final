TechSpec Generator — локальная версия с мок-Firebase

Коротко:
- SPA генератор ТЗ для сайтов (Vanilla JS + Bootstrap).
- Локальная мок-аутентификация и mock Firestore (хранятся в localStorage).

Запуск локально:

1) Откройте терминал в папке проекта `spec-generator` и запустите простой сервер:

```powershell
python -m http.server 8000
```

2) Откройте в браузере: http://localhost:8000/index.html

Что протестировать:
- Перейдите в `register.html` и создайте аккаунт (логин/пароль сохраняются в localStorage).
- Вернитесь на `index.html` и выполните генерацию ТЗ — оно автоматически сохранится под пользователем в mock Firestore.
- Откройте `admin.html`, чтобы просмотреть содержимое `mock_users` и `mock_firestore` в localStorage.

Примечания:
- Мок-Firebase реализован в `firebase-config.js`. Это демонстрационный код — не используйте в продакшн.
- Email отправка использует EmailJS, но по умолчанию настроена фоллбек-механика `mailto:`.
- PDF экспорт — через `html2pdf.js` (CDN).

Файлы интереса:
- `index.html`, `script.js` — основной SPA и логика.
- `firebase-config.js` — мок Firebase (Auth + Firestore).
- `auth.js` — обёртки регистрации/входа и наблюдение за состоянием.
- `admin.html` — утилита для просмотра mock-хранилищ.

Если нужно, могу:
- Добавить тестовый сценарий (end-to-end) с Puppeteer/Playwright для автоматического прохождения регистрации и сохранения ТЗ.
- Подключить real Firebase (инструкции и правки безопасности).

Автоматические тесты (E2E + a11y)

1) Инициализация (в папке `spec-generator`):

```powershell
npm install
npx playwright install
```

2) Запуск E2E теста (Playwright):

```powershell
npm test
```

3) Запуск проверки доступности (axe-core):

```powershell
node tests/run-axe.js
```

Результаты a11y сохраняются в `axe-results.json`.
