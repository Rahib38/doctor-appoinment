import { Gender } from "../../../../prisma/generated/prisma/enums";

export type createPatientInput = {
    name: string;
    email: string;
    password: string;
}


export type createDoctorInput= {
    
    name: string;
    email: string;
    password: string;
    profilePhoto?: string;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    exprience?: number;
    gender: Gender;
    appoinmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
  
}


export type createAdminInput= {
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber: string;

}
