import { prisma } from "../../../../lib/prisma";
import { UserStatus } from "../../../../prisma/generated/prisma/enums";
import bcrypt from "bcryptjs";

const login = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }
};

export const AuthService = {
  login,
};
