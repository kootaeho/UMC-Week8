import { getStoreById } from "../repositories/store.repository.js";
import {
  addMission,
  getMissionById,
  getUserMissionByUserAndMission,
  addUserMission,
} from "../repositories/mission.repository.js";
import { responseFromMission } from "../dtos/mission.dto.js";
import { NotFoundError, BadRequestError } from "../errors/custom-errors.js";

export const addMissionToStore = async (data) => {
  const store = await getStoreById(data.storeId);
  if (!store) {
    throw new NotFoundError("해당 가게를 찾을 수 없습니다.");
  }

  const mission = await addMission({ storeId: data.storeId, title: data.title });
  return responseFromMission({ mission });
};

export const startMissionForUser = async (data) => {
  const mission = await getMissionById(data.missionId);
  if (!mission) {
    throw new NotFoundError("해당 미션을 찾을 수 없습니다.");
  }

  const existing = await getUserMissionByUserAndMission(data.userId, data.missionId);
  if (existing && existing.status === "ONGOING") {
    throw new BadRequestError("이미 진행 중인 미션입니다.");
  }

  const userMission = await addUserMission({ userId: data.userId, missionId: data.missionId });

  return userMission;
};
