import { StatusCodes } from "http-status-codes";
import { bodyToUser } from "../dtos/user.dto.js";
import { bodyToStore } from "../dtos/store.dto.js";
import { bodyToReview } from "../dtos/review.dto.js";
import { bodyToMission } from "../dtos/mission.dto.js";
import { userSignUp, StoreAdd } from "../services/user.service.js";
import { addReviewToStore } from "../services/review.service.js";
import { addMissionToStore, startMissionForUser } from "../services/mission.service.js";
import { successResponse } from "../utils/response.js";

/**
 * @swagger
 * /api/v1/users/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - gender
 *               - birth
 *               - address
 *               - phoneNumber
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               name:
 *                 type: string
 *                 example: "홍길동"
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE]
 *                 example: "MALE"
 *               birth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *               address:
 *                 type: string
 *                 example: "서울시 강남구"
 *               detailAddress:
 *                 type: string
 *                 example: "역삼동 123-45"
 *               phoneNumber:
 *                 type: string
 *                 example: "010-1234-5678"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     name:
 *                       type: string
 *                       example: "홍길동"
 *                     gender:
 *                       type: string
 *                       example: "MALE"
 *                     birth:
 *                       type: string
 *                       example: "1990-01-01"
 *                     address:
 *                       type: string
 *                       example: "서울시 강남구"
 *                     detailAddress:
 *                       type: string
 *                       example: "역삼동 123-45"
 *                     phoneNumber:
 *                       type: string
 *                       example: "010-1234-5678"
 *                     preferences:
 *                       type: array
 *                       items:
 *                         type: object
 *       409:
 *         description: 이미 존재하는 이메일
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: integer
 *                   example: 409
 *                 message:
 *                   type: string
 *                   example: "이미 존재하는 이메일입니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "데이터베이스 오류가 발생했습니다."
 */
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

/**
 * @swagger
 * /api/v1/store/add:
 *   post:
 *     summary: 가게 추가
 *     tags: [Stores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - store_name
 *             properties:
 *               store_name:
 *                 type: string
 *                 example: "맛있는 식당"
 *               store_num:
 *                 type: string
 *                 example: "02-1234-5678"
 *               store_address:
 *                 type: string
 *                 example: "서울시 강남구"
 *               area:
 *                 type: string
 *                 example: "강남"
 *     responses:
 *       201:
 *         description: 가게 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "맛있는 식당"
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "데이터베이스 오류가 발생했습니다."
 */
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

/**
 * @swagger
 * /api/v1/stores/{storeId}/reviews:
 *   post:
 *     summary: 가게 리뷰 추가
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 가게 ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - content
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: "음식이 정말 맛있었어요!"
 *     responses:
 *       201:
 *         description: 리뷰 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     storeId:
 *                       type: integer
 *                       example: 1
 *                     content:
 *                       type: string
 *                       example: "음식이 정말 맛있었어요!"
 *       404:
 *         description: 가게를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "해당 가게를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "데이터베이스 오류가 발생했습니다."
 */
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

/**
 * @swagger
 * /api/v1/stores/{storeId}/missions:
 *   post:
 *     summary: 가게 미션 추가
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: storeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 가게 ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: "리뷰 5개 작성하기"
 *     responses:
 *       201:
 *         description: 미션 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     storeId:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "리뷰 5개 작성하기"
 *       404:
 *         description: 가게를 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "해당 가게를 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "데이터베이스 오류가 발생했습니다."
 */
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

/**
 * @swagger
 * /api/v1/users/{userId}/missions/{missionId}/start:
 *   post:
 *     summary: 유저 미션 시작
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *         example: 1
 *       - in: path
 *         name: missionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 미션 ID
 *         example: 1
 *     responses:
 *       201:
 *         description: 미션 시작 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "success"
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     mission_id:
 *                       type: integer
 *                       example: 1
 *                     status:
 *                       type: string
 *                       example: "ONGOING"
 *       400:
 *         description: 이미 진행 중인 미션
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "이미 진행 중인 미션입니다."
 *       404:
 *         description: 미션을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "해당 미션을 찾을 수 없습니다."
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "데이터베이스 오류가 발생했습니다."
 */
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