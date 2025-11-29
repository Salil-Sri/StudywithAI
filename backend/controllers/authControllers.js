import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

export const register = async (req,res) =>{
  try {
    const {name,email,password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
      return res.status(400).json({success:false, message:"User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({success:true,user});
  } catch (err) {
    res.status(500).json({success:false, error: err.message});
  }
};


export const login = async (req,res) =>{
  try {
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user){
      return res.status(404).json({success:false,message:"User not found"});
    }

    const match = await bcrypt.compare(password,user.password);
    if(!match){
      return res.status(400).json({success:false,message:"Wrong password"});
    }

    const token = jwt.sign(
      {id:user._id},
      process.env.JWT_SECRET,
      {expiresIn:"7d"}
    );

    res.json({success:true,token});
  } catch (err) {
    res.status(500).json({success:false,error:err.message});
  }
};
