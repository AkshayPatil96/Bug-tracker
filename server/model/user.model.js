const { Schema, model, default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
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
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
    project: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "project",
    },
  },

  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      let salt = bcrypt.genSaltSync(10);

      const hashedPassword = await bcrypt.hashSync(this.password, salt);

      this.password = hashedPassword;
    }
  } catch (error) {
    next(error);
  }
});

const User = model("user", userSchema);

module.exports = User;
