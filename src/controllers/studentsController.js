// src/controllers/studentsController.js

import { Student } from '../models/student.js';
import createHttpError from 'http-errors';

// Отримати список усіх студентів
export const getStudents = async (req, res) => {
  // Отримуємо параметри пагінаціі
  const {
    page = 1,
    perPage = 10,
    gender,
    minAvgMark,
    search,
    sortBy = '_id',
    sortOrder = 'asc',
  } = req.query;
  const skip = (page - 1) * perPage;
  // Створюємо базовий запит
  const studentsQuery = Student.find(
    // Додаємо критерій пошуку тільки студентів поточного користувача
    { userId: req.user._id },
  );
  // Текстовий пошук по name (працює лише якщо створено текстовий індекс)
  if (search) {
    studentsQuery.where({
      $text: { $search: search },
    });
  }
  //Будуємо фільтр за статю
  if (gender) {
    studentsQuery.where('gender').equals(gender);
  }
  // фільтр за середнім балом
  if (minAvgMark) {
    studentsQuery.where('avgMark').gte(minAvgMark);
  }
  // Виконуємо одразу два запити паралельно
  const [totalItems, students] = await Promise.all([
    studentsQuery.clone().countDocuments(),
    studentsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);
  // Обчисляємо загальну кількість "сторінок"

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    students,
  });
};

// Отримати одного студента за id
export const getStudentById = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findOne({
    _Id: studentId,
    userId: req.user._id,
  });

  // Додаємо базову обробку помилки замість res.status(404)
  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json(student);
};

// Новий контролер
export const createStudent = async (req, res) => {
  const student = await Student.create({
    ...req.body,
    // Додаємо властивість userId
    userId: req.user._id,
  });

  res.status(201).json(student);
};

export const deleteStudent = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findOneAndDelete({
    _id: studentId,
    userId: req.user._id,
  });
  if (!student) {
    return next(createHttpError(404, 'Student Not Found'));
  }
  res.status(200).json(student);
};

// частково оновлюємо
export const updateStudent = async (req, res, next) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndUpdate(
    { _id: studentId, userId: req.user._id }, // Шукаємо по userId
    req.body,
    { new: true }, // повертаємо оновлений документ
  );

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json(student);
};
