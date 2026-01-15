import { Request } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/prisma";

const createPatient = async (req: Request) => {


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