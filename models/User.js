const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Utils = require("./../utils")
require("mongoose-type-email")

// schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pronouns: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
    accessLevel: {
      type: Number,
      required: true,
    },
    newUser: {
      type: Boolean,
      default: true,
    },
    role: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
    },
    skills: [{ type: Schema.ObjectId, ref: "Skill" }],
    // square bracket as it is an array
    favouriteProjects: [{ type: Schema.ObjectId, ref: "Project" }],
  },
  { timestamps: true }
)

// encrypt password field on save
userSchema.pre("save", function (next) {
  // check if password is present and is modifed
  if (this.password && this.isModified()) {
    this.password = Utils.hashPassword(this.password)
  }
  next()
})

// model
const userModel = mongoose.model("User", userSchema)

// export
module.exports = userModel
