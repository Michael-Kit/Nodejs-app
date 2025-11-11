// src/routes/studentsRoutes.js

import { Router } from 'express';
import { celebrate } from 'celebrate';

import {
  createStudentSchema,
  studentIdParamSchema,
  updateStudentSchema,
} from '../validation/studentsValidation.js';

import {
  getStudents,
  getStudentById,
  createStudent,
  deleteStudent,
  updateStudent,
} from '../controllers/studentsController.js';

const router = Router();

router.get('/students', getStudents);

router.get(
  '/students/:studentId',
  celebrate(studentIdParamSchema),
  getStudentById,
);

router.post('/students', celebrate(createStudentSchema), createStudent);

router.delete(
  '/students/:studentId',
  celebrate(studentIdParamSchema),
  deleteStudent,
);

router.patch(
  '/students/:studentId',
  celebrate(updateStudentSchema),
  updateStudent,
);

export default router;
