import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";
import mongoosePaginate from 'mongoose-paginate-v2';

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
  },
  owner: {
    type: String,
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
const roleSchema = new mongoose.Schema(
  {
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
  },
  { _id: false }
);

// Define Member Schema
const memberSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => Snowflake.generate(),
    unique: true,
  },
  community: {
    type: String,
    ref: "Community",
  },
  user: {
    type: String,
    ref: "User",
  },
  role: {
    type: String,
    ref: "Role",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

communitySchema.plugin(mongoosePaginate);
roleSchema.plugin(mongoosePaginate);
userSchema.plugin(mongoosePaginate);
memberSchema.plugin(mongoosePaginate);

// Create MongoDB models based on the schemas
const User = mongoose.model("User", userSchema);
const Community = mongoose.model("Community", communitySchema);
const Role = mongoose.model("Role", roleSchema);
const Member = mongoose.model("Member", memberSchema);

export { User, Community, Role, Member };
