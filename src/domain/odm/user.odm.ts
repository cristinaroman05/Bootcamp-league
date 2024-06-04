import { User, IUser, IUserCreate } from "../entities/user.entity";
import { Document } from "mongoose";

const getBusyUsers = async (page: number, limit: number): Promise<IUser[]> => {
  return await User.find({ team: { $exists: true } })
    .limit(limit)
    .skip((page - 1) * limit)
    .populate("team");
};

const getTeamUsers = async (page: number, limit: number, teamId: string): Promise<IUser[] | []> => {
  if (!teamId) {
    return [];
  }
  return await User.find({ team: teamId })
    .limit(limit)
    .skip((page - 1) * limit);
};

const getUserCount = async (): Promise<number> => {
  return await User.countDocuments();
};

const getUserById = async (id: string): Promise<Document<IUserCreate> | any> => {
  return await User.findById(id).populate("team");
};

const getUserByEmailWithPassword = async (email: string): Promise<Document<IUser> | null> => {
  const user: Document<IUser> | null = (await User.findOne({ email }).select("+password")) as any;
  return user;
};

const getFreeUsers = async (page: number, limit: number): Promise<IUser[]> => {
  return await User.find({ team: { $exists: false } })
    .limit(limit)
    .skip((page - 1) * limit);
};

const createUser = async (userData: IUserCreate): Promise<Document<IUser>> => {
  const user = new User(userData);
  const document: Document<IUser> = (await user.save()) as any;
  const userCopy = document.toObject();
  delete userCopy.password;

  return userCopy;
};

const deleteUser = async (id: string): Promise<Document<IUser> | null> => {
  return await User.findByIdAndDelete(id);
};

const updateUser = async (id: string, userData: IUserCreate): Promise<Document<IUser> | null> => {
  return await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true });
};

export const userOdm = {
  getBusyUsers,
  getUserCount,
  getUserById,
  getUserByEmailWithPassword,
  getFreeUsers,
  getTeamUsers,
  createUser,
  deleteUser,
  updateUser,
};
