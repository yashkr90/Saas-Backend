import Connection from "./src/database/db.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
// const jwt = require('jsonwebtoken');
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import roleRoute from "./src/routes/v1/role/role.js"
import userRoute from "./src/routes/v1/user/auth/user.js";
import communityRoute from "./src/routes/v1/community/community.js"

const port = process.env.PORT || 3000;

const app = express();
// app.use(bodyParser.json());

dotenv.config();

app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/",roleRoute);
app.use("/",userRoute);
app.use("/",communityRoute);

const MONGOURL = process.env.MONGOURL;

Connection(MONGOURL).then((res) => {
    console.log(res);
    if (res === "success") {
      app.listen(port || process.env.PORT, () =>
        console.log(`Server is running on PORT ${port}`)
      );
    }
  });