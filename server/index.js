import express from "express";
import mongoose, { mongo } from "mongoose";
import "dotenv/config";
import bcrypt from "bcrypt";
import User from "./Schema/User.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import cors from "cors";
import admin from "firebase-admin";
import serviceAccountKey from "./mern-blogging-website-c0b9f-firebase-adminsdk-zefln-4f1ba04329.json" assert { type: "json" };
import { getAuth } from "firebase-admin/auth";

const server = express();
let PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const corsOptions = {
  origin: "http://localhost:5173", // Your frontend origin
  credentials: true, // Allow cookies and credentials
};

server.use(express.json());
server.use(cors(corsOptions));

mongoose.connect(process.env.DB_URL, {
  autoIndex: true,
});

const formatDatatoSend = (user) => {
  const access_token = jwt.sign(
    { id: user._id },
    process.env.SECRET_ACCESS_KEY
  );

  return {
    access_token,
    profile_img: user.personal_info.profile_img,
    fullname: user.personal_info.fullname,
    username: user.personal_info.username,
  };
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];

  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  isUsernameNotUnique ? (username += nanoid().substring(0, 5)) : "";
  return username;
};

server.post("/api/signup", (req, res) => {
  let { fullname, email, password } = req.body;

  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be atleast 3 letters long." });
  }
  if (!email.length) {
    return res.status(403).json({ error: "Email is required." });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is invalid." });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password should be 6 to 20 characters long with a number, atleast one lowercase and uppercase letters.",
    });
  }

  //hash password

  bcrypt.hash(password, 10, async (err, hashed_password) => {
    let username = await generateUsername(email);

    let user = new User({
      personal_info: {
        fullname,
        email,
        password: hashed_password,
        username,
      },
    });

    user
      .save()
      .then((u) => {
        return res.status(200).json(formatDatatoSend(u));
      })
      .catch((err) => {
        if (err.code == 11000) {
          return res.status(500).json({ error: "Email already exists." });
        }

        return res.status(500).json({ error: err.message });
      });
  });
});

server.post("/api/signin", (req, res) => {
  let { email, password } = req.body;
  User.findOne({ "personal_info.email": email })
    .then((user) => {
      //if user not found
      if (!user) {
        return res.json(403).json({ error: "User not found" });
      }

      bcrypt.compare(password, user.personal_info.password, (err, result) => {
        if (err) {
          return res
            .status(403)
            .json({ error: "Error found in login. Please try again." });
        }

        if (!result) {
          return res.status(403).json({ error: "Incorrect password." });
        } else {
          // console.log("Signin Succesfull");
          return res.status(200).json(formatDatatoSend(user));
        }
      });
    })
    //if any other internal error
    .catch((err) => {
      console.log(err);
      return res.json(500).json({ error: err.message });
    });
});

server.post("/api/google-auth", async (req, res) => {
  let { access_token } = req.body;

  getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {
      let { email, name, picture } = decodedUser;

      //when we get the picture it is very low quality so to increase the quality of the picture

      picture = picture.replace("s96-c", "s384-c");

      let user = await User.findOne({ "personal_info.email": email })
        .select(
          "personal_info.fullname personal_info.username google_auth personal_info.profile_img"
        )
        .then((u) => {
          return u || null;
        })
        .catch((err) => {
          return res.status(500).json({ error: err.message });
        });

      if (user) {
        //login
        if (!user.google_auth) {
          return res.status(403).json({
            error:
              "This email was signed up without google. Please login with password to access the account. ",
          });
        }
      } else {
        //signup

        let username = await generateUsername(email);

        user = new User({
          personal_info: {
            fullname: name,
            email,
            profile_img: picture,
            username,
          },
          google_auth: true,
        });

        await user
          .save()
          .then((u) => {
            user = u;
          })
          .catch((err) => {
            return res.status(500).json({ error: err.message });
          });
      }
      return res.status(200).json(formatDatatoSend(user));
    })
    .catch((err) => {
      return res.status(500).json({
        error: "Failed to authenticate. Try with another google account.",
      });
    });
});

server.listen(PORT, () => {
  console.log("listensing on port ->" + PORT);
});
