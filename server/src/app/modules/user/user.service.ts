import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { fileUploader } from "../../helper/fileUploader";
import { Doctor, User, UserRole } from "../../../../prisma/generated/prisma/client";

const createPatient = async (req: Request) => {
  //   console.log("RAW BODY 👉", req.body);
  //   console.log("FILE 👉", req.file);
  //  Parse the incoming data
  if (!req.body.data) {
    throw new Error("Missing 'data' in request body");
  }

  const parsedData = JSON.parse(req.body.data);

  const { password, patient } = parsedData;

  if (!password) throw new Error("Password is required");
  if (!patient || !patient.email)
    throw new Error("Patient data is required with email");

  // Handle file upload if exists
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    patient.profilePhoto = uploadResult?.secure_url;
    console.log("UPLOAD RESULT 👉", uploadResult);
  }

  //  Hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  //  Create user
  const createUser = await prisma.user.create({
    data: {
      email: patient.email,
      password: hashPassword,
    },
  });

  //  Create patient
  const createPatients = await prisma.patient.create({
    data: patient,
  });

  return {
    createUser,
    createPatients,
  };
};

type CreateDoctorResponse = {
  createUser: User;
  doctor: Doctor;
};

const createDoctor = async (req: Request):Promise<CreateDoctorResponse> => {
    // console.log("RAW BODY 👉", req.body);
  //   console.log("FILE 👉", req.file);

  //  Parse the incoming data
  if (!req.body.data) {
    throw new Error("Missing 'data' in request body");
  }


  const parsedData = JSON.parse(req.body.data);

  const { password, doctor } = parsedData;

  if (!password) throw new Error("Password is required");
  if (!doctor || !doctor.email)
    throw new Error("Doctor data is required with email");

  // Handle file upload if exists
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    doctor.profilePhoto = uploadResult?.secure_url;
    console.log("UPLOAD RESULT 👉", uploadResult);
  }

  //  Hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  //  Create user
const createUser = await prisma.user.create({
  data: {
    email: doctor.email,
    password: hashPassword,
    role: UserRole.DOCTOR,
  },
});

const createDoctors = await prisma.doctor.create({
  data: {
    name: doctor.name,
    email: doctor.email,
    profilePhoto: doctor.profilePhoto,
    contactNumber: doctor.contactNumber,
    address: doctor.address,
    registrationNumber: doctor.registrationNumber,
    exprience: doctor.exprience ?? 0,
    gender: doctor.gender,
    appoinmentFee: doctor.appoinmentFee,
    qualification: doctor.qualification,
    currentWorkingPlace: doctor.currentWorkingPlace,
    designation: doctor.designation,
  },
});


  return {
    createUser,
    doctor:createDoctors,
  };

};
// const createPatient = async (req: Request) => {
//   //   console.log("RAW BODY 👉", req.body);
//   //   console.log("FILE 👉", req.file);

//   //  Parse the incoming data
//   if (!req.body.data) {
//     throw new Error("Missing 'data' in request body");
//   }

//   const parsedData = JSON.parse(req.body.data);

//   const { password, patient } = parsedData;

//   if (!password) throw new Error("Password is required");
//   if (!patient || !patient.email)
//     throw new Error("Patient data is required with email");

//   // Handle file upload if exists
//   if (req.file) {
//     const uploadResult = await fileUploader.uploadToCloudinary(req.file);
//     patient.profilePhoto = uploadResult?.secure_url;
//     console.log("UPLOAD RESULT 👉", uploadResult);
//   }

//   //  Hash the password
//   const hashPassword = await bcrypt.hash(password, 10);

//   //  Create user
//   const createUser = await prisma.user.create({
//     data: {
//       email: patient.email,
//       password: hashPassword,
//     },
//   });

//   //  Create patient
//   const createPatients = await prisma.patient.create({
//     data: patient,
//   });

//   return {
//     createUser,
//     createPatients,
//   };
// };

export const UserService = {
  createPatient,
  createDoctor
};
