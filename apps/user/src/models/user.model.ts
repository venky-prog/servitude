import mongoose, { InferSchemaType, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import {SignJWT} from 'jose';

interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
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
});

userSchema.pre('save', async function () {
  console.log("Pre-save hook triggered for user:", this);
  if (!this.isModified('password') || !this.isNew) {
    throw new Error('Password is not modified');
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.method('comparePassword', async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
});

userSchema.method('generateAuthToken', async function () {
  const token = await new SignJWT({ userId: this._id.toHexString() })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('12h')
    .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret'));
  return token; // Replace with actual token generation
});

const User = mongoose.model('User', userSchema);

export default User;
