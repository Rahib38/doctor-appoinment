import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../helper/fileUploader";

const router = express.Router();

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    UserValidation.createPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createPatient(req,res,next);
  }
);
// create doctor
// create admin

export const userRoutes = router;
