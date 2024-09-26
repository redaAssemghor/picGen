import prisma from "../prisma";

export const createUser = async ({ id }: { id: string }) => {
  try {
    const user = await prisma.user.create({
      data: {
        clerkId: id,
        points: 50,
      },
    });
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

export const updateUserPoints = async ({ id }: { id: string }) => {
  try {
    const user = await prisma.user.update({
      where: {
        clerkId: id,
      },
      data: {
        points: {
          decrement: 20,
        },
      },
    });
    return user;
  } catch (error) {
    console.error("Error updating user points:", error);
  }
};

export const getUser = async ({ id }: { id: string }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: id,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};
