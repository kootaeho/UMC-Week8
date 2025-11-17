import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { bodyToStore } from "../dtos/store.dto.js";
import { bodyToReview } from "../dtos/review.dto.js";
import { bodyToMission } from "../dtos/mission.dto.js";
import { userSignUp, StoreAdd } from "../services/user.service.js";
import { addReviewToStore } from "../services/review.service.js";
import { addMissionToStore, startMissionForUser } from "../services/mission.service.js";
import { successResponse } from "../utils/response.js";

export const handleUserSignUp = async (req, res, next) => {
  try {
    console.log("회원가입을 요청했습니다!");
    console.log("body:", req.body);

    const user = await userSignUp(bodyToUser(req.body));
    return successResponse(res, user, StatusCodes.CREATED);
  } catch (err) {
    next(err);
  }
};

export const handleStoreAdd = async (req, res, next) => {
  try {
    console.log("가게 추가!");
    console.log("body:", req.body);

    const store = await StoreAdd(bodyToStore(req.body));
    return successResponse(res, store, StatusCodes.CREATED);
  } catch (err) {
    next(err);
  }
};

export const handleAddReview = async (req, res, next) => {
  try {
    console.log("가게 리뷰 추가 요청");
    console.log("params:", req.params, "body:", req.body);

    const reviewData = bodyToReview(req.body, { storeId: req.params.storeId });
    const review = await addReviewToStore(reviewData);
    return successResponse(res, review, StatusCodes.CREATED);
  } catch (err) {
    next(err);
  }
};

export const handleAddMission = async (req, res, next) => {
  try {
    console.log("가게 미션 추가 요청", req.params, req.body);

    const missionData = bodyToMission(req.body, { storeId: req.params.storeId });
    const mission = await addMissionToStore(missionData);
    return successResponse(res, mission, StatusCodes.CREATED);
  } catch (err) {
    next(err);
  }
};

export const handleStartMission = async (req, res, next) => {
  try {
    console.log("유저 미션 시작 요청", req.params, req.body);

    const userId = req.params.userId ? Number(req.params.userId) : req.body.userId;
    const missionId = req.params.missionId ? Number(req.params.missionId) : req.body.missionId;
    const result = await startMissionForUser({ userId, missionId });
    return successResponse(res, result, StatusCodes.CREATED);
  } catch (err) {
    next(err);
  }
};