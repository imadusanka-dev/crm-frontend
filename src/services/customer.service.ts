import api from "./api";
import type { ICustomer } from "../types";

export const getCustomers = async (): Promise<ICustomer[]> => {
  const response = await api.get("/customer");
  return response.data;
};

export const getCustomerById = async (id: string): Promise<ICustomer> => {
  const response = await api.get(`/customer/${id}`);
  return response.data;
};

export const createCustomer = async (
  customer: Omit<ICustomer, "id" | "createdAt">
): Promise<ICustomer> => {
  const response = await api.post("/customer", customer);
  return response.data;
};

export const updateCustomer = async (
  id: string,
  customer: Omit<ICustomer, "id" | "createdAt">
) => {
  const response = await api.put(`/customer/${id}`, customer);
  return response.data;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await api.delete(`/customer/${id}`);
};
