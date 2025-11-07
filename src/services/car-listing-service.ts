import apiClient from "@/lib/api";
import { CarQueryParams, CarResponse, } from "@/types/car-listing";


export const getCars = async (params?: CarQueryParams) => {
    const { data } = await apiClient.get<CarResponse>("/car-listing", { params });
    return data;
};