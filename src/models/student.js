// src/models/student.js

import { Schema } from 'mogoose';
import { model } from 'mongoose';

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

export const Student = model('Student', studentSchema);
