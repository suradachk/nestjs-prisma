import { User } from '@prisma/client';

export const getUserProfile = ({
  userId,
  firstName,
  lastName,
  email,
  nickName,
}: User) => {
  return {
    userId,
    firstName,
    lastName,
    email,
    nickName,
  };
};
