import { StatusCodes } from "http-status-codes";
import { BaseError } from "../errors/custom-errors.js";

export const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err);

  if (err instanceof BaseError && err.isOperational) {
    return res.status(err.status).json({
      isSuccess: false,
      code: err.status,
      message: err.message,
      ...(err.data && Object.keys(err.data).length > 0 && { result: err.data }),
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
    isSuccess: false,
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "서버 내부 오류가 발생했습니다.",
  });
};
