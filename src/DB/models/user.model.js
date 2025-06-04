import { model, Schema } from "mongoose";
import { hash } from "../../utils/hashing.js";
import { encrypt } from "../../utils/encryption.js";
export const genders = {
  male: "male",
  female: "female",
};
export const roles = {
  admin: "admin",
  user: "user",
};
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: [6, "Password must be at least 6 characters"],
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Username must be at least 3 characters"],
      maxLength: [20, "Username must be at most 20 characters"],
    },
    gender: {
      type: String,
      enum: Object.values(genders),
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,

      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(roles),
      default: roles.user,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = hash({ plaintext: this.password });
  }
  if (this.isModified("phone")) {
    this.phone = encrypt({ data: this.phone });
  }
  next();
});
userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.$set?.password) {
    update.$set.password = hash({ plaintext: update.$set.password });
  }

  if (update.$set?.phone) {
    update.$set.phone = encrypt({ data: update.$set.phone });
  }

  next();
});
const userModel = model("User", userSchema);

export default userModel;
