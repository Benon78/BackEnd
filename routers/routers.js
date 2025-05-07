/** @format */

import express from "express";
import {
  registerUser,
  loginUser,
  changePasswordController,
} from "../controllers_and_middleware/controllers.js";
import {
  authMiddleware,
  adminAuthMiddleware,
} from "../controllers_and_middleware/auth-middleware.js";
import {
  uploadImageToDb,
  fetchImagesController,
  deleteImageByIdController,
} from "../controllers_and_middleware/imageController.js";
import { uploadMiddleware } from "../controllers_and_middleware/upload-middleware.js";
const routers = express.Router();

// all routers are related to authentication & authorization
routers.post("/register", registerUser);
routers.post("/login", loginUser);

// change password route
routers.put('/change-password',authMiddleware,changePasswordController);

//home page route
routers.get("/home", authMiddleware, (req, res) => {
  const { userId, username, role } = req.userInfo;
  res.status(200).json({
    message: "Welcome to the home page",
    user: {
      _id: userId,
      username,
      role,
    },
  });
});

// admin page route
routers.get("/admin", authMiddleware, adminAuthMiddleware, (req, res) => {
  const { userId, username, role } = req.userInfo;
  res.status(200).json({
    message: "Welcome to the admin page",
    user: {
      _id: userId,
      username,
      role,
    },
  });
});

// router for setup confirmation on render



// uploading Image route
routers.post(
  "/upload/image",
  authMiddleware,
  adminAuthMiddleware,
  uploadMiddleware.single("image"),
  uploadImageToDb
);

// get all images from db route
routers.get("/images", authMiddleware, fetchImagesController);

// delete image by ID route
routers.delete(
  "/delete/images/:id",
  authMiddleware,
  adminAuthMiddleware,
  deleteImageByIdController
);

export default routers;
