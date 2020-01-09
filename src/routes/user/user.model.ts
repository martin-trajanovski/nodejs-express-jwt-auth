import { Schema, model, Document } from 'mongoose';
import User from './user.interface';

const addressSchema = new Schema({
  city: {
    type: String,
    default: '',
  },
  country: {
    type: String,
    default: '',
  },
  street: {
    type: String,
    default: '',
  },
});

const userSchema = new Schema({
  address: addressSchema,
  firstName: {
    type: String,
    default: '',
  },
  lastName: {
    type: String,
    default: '',
  },
  email: String,
  password: String,
  refreshToken: {
    type: String,
    default: '',
  },
});

const userModel = model<User & Document>('users', userSchema);

export default userModel;
