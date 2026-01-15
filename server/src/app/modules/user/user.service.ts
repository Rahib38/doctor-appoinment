import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";
import { fileUploader } from "../../helper/fileUploader";

const createPatient = async (req: Request) => {

    if(req.file){
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)
        console.log(uploadResult)
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const createUser = await prisma.user.create({
        data:{
            email:req.body.email,
            password:hashPassword
        }
    })
    
    const createPatients = await prisma.patient.create({
        data:{
            name:req.body.name,
            email:req.body.email,
        }
    })

    return {
        createUser,
        createPatients
    }

}

export const UserService = {
    createPatient
}