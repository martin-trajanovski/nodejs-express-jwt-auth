import { Schema, model } from 'mongoose';

const loginActivitySchema = new Schema({
  userID: String,
  time: { type: Date, default: Date.now },
  activityType: String,
});

const LoginActivity = model(
  'LoginActivity',
  loginActivitySchema,
  'LoginActivity'
);

export default LoginActivity;
