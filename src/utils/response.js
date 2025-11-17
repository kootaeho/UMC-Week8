import { StatusCodes } from "http-status-codes";

export const successResponse = (res, data, statusCode = StatusCodes.OK) => {
  return res.status(statusCode).json({
    isSuccess: true,
    code: statusCode,
    message: "success",
    result: data,
  });
};

export const errorResponse = (res, message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, data = null) => {
  const response = {
    isSuccess: false,
    code: statusCode,
    message: message,
  };

  if (data) {
    response.result = data;
  }

  return res.status(statusCode).json(response);
};
