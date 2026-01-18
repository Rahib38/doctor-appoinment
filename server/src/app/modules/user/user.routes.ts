import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { UserValidation } from "./user.validation";
import { fileUploader } from "../../helper/fileUploader";

const router = express.Router();

router.get("/", UserController.getAllUsersFromDB);


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

router.post(
  "/create-doctor",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    UserValidation.createDoctorValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createDoctor(req,res,next);
  }
);
// create admin

router.post(
  "/create-admin",
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    UserValidation.createAdminValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    return UserController.createAdmin(req,res,next);
  }
);



export const userRoutes = router;
