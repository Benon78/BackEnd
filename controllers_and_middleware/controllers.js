/** @format */

import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register controller
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // check if user exist in database
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User is already exists either with username or email! Please Login.",
      });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user and save to DB
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "User created Successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User registered failed! Please try again",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some thing wrong! Please try again.",
    });
  }
};
// login controller
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check user if exist
    const userExist = await User.findOne({ username });
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "Username Invalid! Please try again",
      });
    }

    // check if password correct

    const isPasswordMatch = await bcrypt.compare(password, userExist.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials! Please try again or register",
      });
    }

    // create user token
    const accessToken = jwt.sign(
      {
        userId: userExist._id,
        username: userExist.username,
        role: userExist.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30m",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successfully!",
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some thing wrong! Please try again.",
    });
  }
};

// change password controller
export const changePasswordController = async (req,res) =>{
  try {
    const { userId } = req.userInfo;

    // extract old and new password
    const {oldPassword, newPassword} = req.body;

    //check if the user exist
    const user = await User.findById(userId);
    
    if(!user){
     return res.status(400).json({
        success: false,
        message: 'User does not exist! Please try again.'
      })
    }

    //compare password if matches
    const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);

    if(!isPasswordMatch){
      return res.status(400).json({
        success: false,
        message: 'Old password is not correct! Please try again.'
      })
    }

    // decrypt the new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHashed = await bcrypt.hash(newPassword,salt);

    //update the password of the current user
    // const updatedUser = await User.findByIdAndUpdate(userId,{password:newPasswordHashed},{new: true});
    user.password = newPasswordHashed;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed Successfully!'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Some thing wrong! Please try again.",
    });
  }
}
