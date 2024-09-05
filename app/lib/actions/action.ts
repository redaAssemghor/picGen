import prisma from "../prisma";

export const createUser = async ({ id }: { id: string }) => {
  try {
    const user = await prisma.user.create({
      data: {
        clerkId: id,
        points: 10,
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
  }
};
