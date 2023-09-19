import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";

// Define User Schema
const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => Snowflake.generate(),
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Define Community Schema
const communitySchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => Snowflake.generate(),
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Define Role Schema
const roleSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => Snowflake.generate(),
    unique: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
},{ _id: false });

// Define Member Schema
const memberSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => Snowflake.generate(),
    unique: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create MongoDB models based on the schemas
const User = mongoose.model("User", userSchema);
const Community = mongoose.model("Community", communitySchema);
const Role = mongoose.model("Role", roleSchema);
const Member = mongoose.model("Member", memberSchema);

export { User, Community, Role, Member };
