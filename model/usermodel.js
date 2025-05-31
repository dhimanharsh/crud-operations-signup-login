const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,

      validate(val) {
        if (!validator.isEmail(val)) {
          throw new Error("email is not valid");
        }
      },
    },
    password: {
      type: String,
      validate(val) {
        if (!validator.isStrongPassword(val)) {
          throw new Error("try another pasword...");
        }
      },
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("userData", userSchema);

module.exports = UserModel;
