import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email obbligatoria"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "email non valida"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "password obbligatoria"],
    minlength: [8, "La password deve avere almeno 8 caratteri"],
    select: false,
  },
  fullName: {
    type: String,
    required: [true, "Scegli il nome che verrà visualizzato"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Inserire conferma della password"],
    validate: {
      // works only on CREATE and SAVE!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // use this middleware only if password is actually updated
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // 'this' points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Instance method: will be available on all documents
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // this.password won't be available, because of select:false... so we need to pass it to the function
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log({ resetToken }, this.passwordResetToken);
  return resetToken;
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
