import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { GetKpisResponse, GetProductsResponse,GetTransactionsResponse } from "./types";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  reducerPath: "main",
  tagTypes: ["Kpis", "Products","Transactions"],
  endpoints: (build) => ({
    // === GET ===
    getKpis: build.query<Array<GetKpisResponse>, void>({
      query: () => "/kpi/kpis/",
      providesTags: ["Kpis"],
    }),
    getProducts: build.query<Array<GetProductsResponse>, void>({
      query: () => "/product/products/",
      providesTags: ["Products"],
    }),
    getTransactions: build.query<Array<GetTransactionsResponse>, void>({
      query: () => "/transaction/transactions/",
      providesTags: ["Transactions"],
    }),
    // === POST ===
    addProduct: build.mutation<GetProductsResponse, Partial<GetProductsResponse>>({
      query: (newProduct) => ({
        url: "/product/products/",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),

    // === PUT ===
    updateProduct: build.mutation<GetProductsResponse, { id: string; data: Partial<GetProductsResponse> }>({
      query: ({ id, data }) => ({
        url: `/product/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    // === DELETE ===
    deleteProduct: build.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/product/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {   
  useGetKpisQuery,
  useGetProductsQuery,
  useGetTransactionsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = api;