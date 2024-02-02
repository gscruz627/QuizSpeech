import User from "../models/User.js";
import jwt from "jsonwebtoken"
import express from "express";
import { genSalt, genSaltSync, hash, hashSync, compareSync} from "bcrypt";

const authController = express.Router();
const JWT_SECRET=process.env.JWT_SECRET;

authController.post("/register", async (req, res) => {
    const username = req.body["username"];
    const password = req.body["password"];
    const salt = await genSalt(10);
    const hashedPassword = await hash(password,salt);
    const newUser = new User({
        username: username,
        password: hashedPassword
    });
    newUser.save();
    res.status(201).json({message: "Sucsess"})

})

authController.post("/login", async (req, res) => {
    const username = req.body["username"];
    const password = req.body["password"];
    const user = await User.findOne({username: username});
    if (!user){
        return res.status(403).json({message: "Invalid credentials"});
    }
    const check = await compare(password, user.password);
    if (!check){
        return res.status(403).json({message: "Invalid credentials"});
    }
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
    res.status(200).json({user: user, token: token});
})

export default authController;