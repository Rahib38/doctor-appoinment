import { Gender } from "../../../../prisma/generated/prisma/enums";

export type createPatientInput = {
    name: string;
    email: string;
    password: string;
}


export type createDoctortInput= {
    
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
