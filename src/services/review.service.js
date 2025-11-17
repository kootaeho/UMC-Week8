import { getStoreById } from "../repositories/store.repository.js";
import { addReview } from "../repositories/review.repository.js";
import { responseFromReview } from "../dtos/review.dto.js";
import { NotFoundError } from "../errors/custom-errors.js";

export const addReviewToStore = async (data) => {
  const store = await getStoreById(data.storeId);
  if (!store) {
    throw new NotFoundError("해당 가게를 찾을 수 없습니다.");
  }

  const review = await addReview({
    userId: data.userId,
    storeId: data.storeId,
    content: data.content,
  });

  return responseFromReview({ review });
};
