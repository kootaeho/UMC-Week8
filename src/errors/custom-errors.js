export class BaseError extends Error {
  constructor(message, status, data = {}) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.data = data;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = "요청한 리소스를 찾을 수 없습니다.", data = {}) {
    super(message, 404, data);
  }
}

export class BadRequestError extends BaseError {
  constructor(message = "잘못된 요청입니다.", data = {}) {
    super(message, 400, data);
  }
}

export class ConflictError extends BaseError {
  constructor(message = "이미 존재하는 데이터입니다.", data = {}) {
    super(message, 409, data);
  }
}

export class DatabaseError extends BaseError {
  constructor(message = "데이터베이스 오류가 발생했습니다.", data = {}) {
    super(message, 500, data);
  }
}

export class InternalServerError extends BaseError {
  constructor(message = "서버 내부 오류가 발생했습니다.", data = {}) {
    super(message, 500, data);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = "인증이 필요합니다.", data = {}) {
    super(message, 401, data);
  }
}

export class ForbiddenError extends BaseError {
  constructor(message = "접근 권한이 없습니다.", data = {}) {
    super(message, 403, data);
  }
}
