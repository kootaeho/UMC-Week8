import { responseFromUser } from "../dtos/user.dto.js";
import bcrypt from "bcryptjs";
import { responseFromStore } from "../dtos/store.dto.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../errors/custom-errors.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  updateUser,
} from "../repositories/user.repository.js";
import { addStore, getStoreById } from "../repositories/store.repository.js";

export const userSignUp = async (data) => {
  const hashedPassword = data.password ? await bcrypt.hash(data.password, 10) : null;

  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
    password: hashedPassword,
  });

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};


export const updateUserProfile = async (userId, updates) => {
  const existingUser = await getUser(userId);
  if (!existingUser || existingUser.length === 0) {
    throw new NotFoundError("사용자를 찾을 수 없습니다.");
  }

  const updatedUser = await updateUser(userId, updates);
  if (!updatedUser) {
    throw new BadRequestError("업데이트할 정보가 없습니다.");
  }

  const preferences = await getUserPreferencesByUserId(userId);
  return responseFromUser({ user: updatedUser, preferences });
};

export const StoreAdd = async (data) => {
  const storeId = await addStore({
    store_name: data.store_name,
    store_num: data.store_num,
    store_address: data.store_address,
    area: data.area,
  });

  if (storeId === null || storeId === undefined) {
    throw new InternalServerError("가게 생성에 실패했습니다.");
  }

  const store = await getStoreById(storeId);

  return responseFromStore({ store });
};