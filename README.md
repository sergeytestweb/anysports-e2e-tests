# anysports-e2e-tests

# Установка зависимостей
npm install

# Установка браузеров Playwright
npx playwright install

# Запуск тестов
npm test

# Запуск в режиме отладки
npm run test:headed

# Генерация отчета
npm run test:report

# Запуск тестов в Docker
npm run test:docker

# Или напрямую через docker-compose
docker-compose up --build

# Запуск с просмотром результатов
docker-compose up --build --abort-on-container-exit

# Запуск в CI/CD: просто запустите команду в вашей CI системе
npm run test:ci