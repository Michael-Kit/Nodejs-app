// src/server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { errors } from 'celebrate';
import { connectMongoDB } from './db/connectMongoDB.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import studentsRoutes from './routes/studentsRoutes.js';

const app = express();
// Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT ?? 3000;

// Глобальні middleware
app.use(logger); // 1.Логер першим бачить усі запити
app.use(express.json()); // 2.Парсинг JSON-тіла
app.use(cors()); // Дозвіл для запитів штших доменів

// Логування часу
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// Кореневий маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello, World!' });
});

// підключаємо групу маршрутів студента
app.use(studentsRoutes);
// обробка 404
app.use(notFoundHandler);

// обробка помилок від celebrate (валідація)
app.use(errors());

// Error якщо підчас запиту виникла помилка(глобальна обробка інших помилок)
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
