import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [String], // Array of strings
      default: [] // Optional: set a default empty array if no roles are provided
    },
    approval: {
      type: Boolean,
      default: false, // Default to false (not approved)
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword, next) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    next(error);
  }
};

export default mongoose.model("User", userSchema);
