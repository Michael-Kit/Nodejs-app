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
  const studentsQuery = Student.find();
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
  const student = await Student.findById(studentId);
  // Код що був до цього
  // if (!student) {
  //   return res.status(404).json({ message: 'Student not found' });
  // }

  // Додаємо базову обробку помилки замість res.status(404)
  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json(student);
};

// Новий контролер
export const createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
};

export const deleteStudent = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findOneAndDelete({
    _id: studentId,
  });
  if (!student) {
    next(createHttpError(404, 'Student Not Found'));
    return;
  }
  res.status(200).json(student);
};

// частково оновлюємо
export const updateStudent = async (req, res, next) => {
  const { studentId } = req.params;

  const student = await Student.findOneAndUpdate(
    { _id: studentId }, // Шукаємо по id
    req.body,
    { new: true }, // повертаємо оновлений документ
  );

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json(student);
};
