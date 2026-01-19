import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { fileUploader } from "../../helper/fileUploader";
import {
  Admin,
  Doctor,
  Prisma,
  User,
  UserRole,
} from "../../../../prisma/generated/prisma/client";
import { paginationHelper } from "../../helper/paginationHelpers";
import { userSearchableField } from "./user.constant";

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

const createDoctor = async (req: Request): Promise<CreateDoctorResponse> => {
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
    data: doctor,
  });

  return {
    createUser,
    doctor: createDoctors,
  };
};

type CreateAdminResponse = {
  createUser: User;
  admin: Admin;
};

const createAdmin = async (req: Request): Promise<CreateAdminResponse> => {
  //   console.log("RAW BODY 👉", req.body);
  //   console.log("FILE 👉", req.file);

  //  Parse the incoming data
  if (!req.body.data) {
    throw new Error("Missing 'data' in request body");
  }

  const parsedData = JSON.parse(req.body.data);

  const { password, admin } = parsedData;

  if (!password) throw new Error("Password is required");
  if (!admin || !admin.email)
    throw new Error("admin data is required with email");

  // Handle file upload if exists
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    admin.profilePhoto = uploadResult?.secure_url;
    console.log("UPLOAD RESULT 👉", uploadResult);
  }

  //  Hash the password
  const hashPassword = await bcrypt.hash(password, 10);

  //  Create user
  const createUser = await prisma.user.create({
    data: {
      email: admin.email,
      password: hashPassword,
      role: UserRole.ADMIN,
    },
  });

  //  Create admin
  const createAdmins = await prisma.admin.create({
    data: admin,
  });

  return {
    createUser,
    admin: createAdmins,
  };
};

const getAllUser = async (
  //   {
  //   page,
  //   limit,
  //   searchTerm,
  //   sortBy,
  //   sortOrder,
  //   role,
  //   status,
  // }: {
  //   page: number;
  //   limit: number;
  //   searchTerm: any;
  //   sortBy: any;
  //   sortOrder: any;
  //   role: any;
  //   status: any;
  // }
  params: any,
  options: any,
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableField.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const result = await prisma.user.findMany({
    skip,
    take: limit,
    where: {
      AND: andConditions,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });
  console.log(result, "result");
  return result;
};

export const UserService = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUser,
};
