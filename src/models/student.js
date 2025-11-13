// src/models/student.js

import { Schema, model } from 'mongoose';

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // прибираєпробіли на початку та в кінці
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    avgMark: {
      type: Number,
      required: true,
    },
    omDuty: {
      type: Boolean,
      defalt: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Додаємо текстовий індекс: кажемо MongoDB, що по полю name можна робити $text
studentSchema.index(
  { name: 'text' },
  {
    name: 'StudnetTextIndex',
    weights: { name: 10 },
    default_language: 'english',
  },
);

export const Student = model('Student', studentSchema);
