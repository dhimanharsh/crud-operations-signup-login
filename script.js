const express = require("express");
const app = express();
const connectdb = require("./config/connectDb");
const user = require("./model/usermodel");
const bcrypt = require("bcrypt");
const { validateUser } = require("./helpers/Validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
// middlewares.........
app.use(express.json());
app.use(cookieParser());
// posting data in the database...

// app.post('/user',async(req,res)=>{
//     const userObj = new user(req.body)
//     try{
//         userObj.save()
//         res.send('user saved successfully....')
//     }
//     catch(err){
//         res.status(400).send("something went wrong.....");
//     }
// })

// signup the user
app.post("/signup", async (req, res) => {
  try {
    validateUser(req);
    const { firstName, lastName, password, emailId } = req.body;
    // encrypt password....
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    // saveing the user...
    const userObj = new user({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await userObj.save();
    res.send("user saved successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// login the user
app.get("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const userz = await user.findOne({ emailId: emailId });
    if (!userz) {
      throw new Error("user not found ...........");
    }
    const isValidPassword = await bcrypt.compare(password, userz.password);
    if (isValidPassword) {
      const token = await jwt.sign({ _id: userz._id }, "Dev@123");
      res.cookie("token", token);
      res.send("logged in.....");
    } else {
      res.send("invalid user or password....");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// profiles....
app.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies;
    console.log(cookie);
    // res.send('cookies....')
    const { token } = cookie
    console.log(token,'thix is token');
    if (!token) {
      throw new Error("invalid user.......");
    }
    const decoded = await jwt.verify(token, "Dev@123");
    console.log(decoded);
    const { _id } = decoded;
    const userFind = await user.findById(_id);
    if (!userFind) {
      throw new Error("user does not exist.....");
    }
    else{
        res.send(userFind);
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//to find user from the database
app.get("/finduser", async (req, res) => {
  const email = req.body.emailId;
  try {
    const userFind = await user.find({ emailId: email });
    res.send(userFind);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// to update : patch
app.patch("/userUpdate", async (req, res) => {
  const data = req.body;
  const id = req.body.userId;
  try {
    const users = await user.findByIdAndUpdate(id, data);
    res.send("user updated successfully....");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// to delete any user from the database
app.delete("/userdlt", async (req, res) => {
  const id = req.body.userId;
  try {
    await user.findByIdAndDelete(id);
    res.send("user deleted successfulyy");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

connectdb().then(() => {
  console.log("connected to server ......");
  app.listen(3000, () => {
    console.log("server started.....");
  });
});
