import apiClient from "@/lib/api";
import { Car, CarQueryParams, CarResponse } from "@/types/car-listing";

export const getCars = async (params?: CarQueryParams) => {
  const { data } = await apiClient.get<Promise<CarResponse>>("/car-listing", {
    params,
  });
  return data;
};

export const getCarById = async (id: number) => {
  const { data } = await apiClient.get<Car>(`/car-listing/${id}`);
  return data;
};

export const getCarByUserId = async (
  userId: number,
  params?: Pick<CarQueryParams, "search" | "limit" | "skip">
) => {
  const { data } = await apiClient.get<CarResponse>(
    `/car-listing/user/${userId}`,
    {
      params,
    }
  );
  return data;
};

export const createCarListing = async (userId: number, carData: FormData) => {
  const { data } = await apiClient.post<CarResponse>(
    `/car-listing/${userId}`,
    carData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 seconds for file uploads
    }
  );
  return data;
};

export const updateCarListing = async (id: number, carData: FormData) => {
  const { data } = await apiClient.patch<CarResponse>(
    `/car-listing/${id}`,
    carData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 60 seconds for file uploads
    }
  );
  return data;
};

export const deleteCarListing = async (id: number) => {
  const { data } = await apiClient.delete<{ message: string }>(
    `/car-listing/${id}`
  );
  return data;
};

export const carListingCategories = async () => {
  const { data } = await apiClient.get<string[]>(`/car-listing/categories`);
  return data;
};

// /car-listing/car-available-dates/{id}
export const getCarAvailableDates = async (id: number) => {
  const { data } = await apiClient.get<string[]>(
    `/car-listing/car-available-dates/${id}`
  );
  return data;
};

// /car-listing/delete-image/{id}
export const deleteCarImage = async (
  id: number,
  payload: { carImageUrl: string }
) => {
  const { data } = await apiClient.put<{ message: string }>(
    `/car-listing/delete-image/${id}`,
    { data: payload }
  );
  return data;
};

// /car-listing/status/{id}
export const updateCarStatus = async (
  id: number,
  payload: { status: string; changeStatusDescription: string }
) => {
  const { data } = await apiClient.patch<CarResponse>(
    `/car-listing/status/${id}`,
    payload
  );
  return data;
};
