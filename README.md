# React Task Manager (Итоговый проект)

Полноценный менеджер задач с авторизацией, регистрацией и бэкендом на Node.js.

## Возможности

- Регистрация и авторизация пользователей (пароли хешируются через bcrypt)
- Создание, редактирование, завершение и удаление задач
- Фильтрация задач по статусу и автору
- Экспорт задач в CSV
- Разделение по пользователям

## Технологии

**Frontend:**
- React 19
- React Router 7
- Create React App

**Backend:**
- Node.js (чистый `http` модуль)
- JSON-файлы в качестве хранилища
- bcryptjs (хеширование паролей)

![Окно авторизации](/img/Authorization.jpg)
![Список задач](/img/TaskList.jpg)
![Темная тема](/img/DarkTheme.jpg)
## Запуск проекта
1. Клонируй репозиторий:
```bash
git clone https://github.com/ilyaGladyshev/react-itog.git
cd react-itog
Установи зависимости:
bash
npm install
Запусти бэкенд (в отдельном терминале):
bash
cd backend
node server.js
Запусти фронтенд:
bash
npm start
Приложение будет доступно по адресу: http://localhost:3000
Бэкенд работает на порту 5000.
Структура проекта
react-itog/
├── backend/           # Сервер + JSON-хранилище
│   ├── server.js
│   ├── jsonMoker.js
│   ├── tasks.json
│   └── users.json
├── src/
│   ├── Authorisation/
│   ├── TaskList/
│   ├── AddTask/
│   ├── Workspace/
│   └── ...
└── package.json
Автор
Илья Гладышев
GitHub