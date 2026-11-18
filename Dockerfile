FROM node:20-alpine

WORKDIR /usr/src/app

# Копируем файлы зависимостей
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем зависимости
RUN npm install

# Копируем весь исходный код проекта
COPY . .

# Генерируем Prisma клиент и выполняем сборку NestJS
RUN npx prisma generate
RUN npm run build

# Открываем порт
EXPOSE 3000

# Запускаем через стандартный продакшн-скрипт NestJS
CMD ["npm", "run", "start:prod"]