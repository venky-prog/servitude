import mongoose, { Model } from 'mongoose';
import bcrypt from 'bcrypt';
import { generateToken } from '@servitude/config';

interface IUser extends mongoose.Document<string> {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
  isEmailVerified?: boolean;
  isActive?: boolean;
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): Promise<string>;
}

const userSchema = new mongoose.Schema<IUser, Model<IUser>, IUserMethods>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Exclude password from query results by default
  },
  dob: {
    type: String,
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre('save', async function () {
  console.log('Pre-save hook triggered for user:', this);
  if (!this.isModified('password') || !this.isNew) {
    throw new Error('Password is not modified');
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.method(
  'comparePassword',
  async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
  },
);

userSchema.method('generateAuthToken', async function () {
  return generateToken(this._id.toString()); // Replace with actual token generation
});

const User = mongoose.model('User', userSchema);

export default User;
