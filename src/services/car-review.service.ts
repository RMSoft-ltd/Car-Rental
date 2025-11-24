import apiClient from "@/lib/api";
import { CarReview, CarReviewPayload } from "@/types/car-listing";

export interface CarReviewListResponse {
  count: number;
  rows: CarReview[];
}

export const createCarReview = async (payload: CarReviewPayload) => {
  const { data } = await apiClient.post<CarReview>("/car-review", payload);
  return data;
};

export const getCarReviews = async (params?: {
  carId?: number;
  limit?: number;
  skip?: number;
}) => {
  const { data } = await apiClient.get<CarReviewListResponse>("/car-review", {
    params,
  });
  return data;
};

